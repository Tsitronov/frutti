import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import { setTokens } from '../../api';
import Navbar from "../UI/navbar/Navbar";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function ImportExcel() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filtri: array di oggetti condizioni
  const [filters, setFilters] = useState([
    { id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' }
  ]);
  const [globalLogic, setGlobalLogic] = useState('AND');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) {
      setFilteredData([]);
      return;
    }

    const checkCondition = (row, filter) => {
      const colKey = filter.column === 'all' ? null : filter.column;
      let cellValue = '';
      if (colKey === null) {
        // Su tutte le colonne
        const values = Object.values(row).map(v => String(v || '').toLowerCase());
        cellValue = values.join(' '); // Uniamo per la ricerca
      } else {
        cellValue = String(row[colKey] || '').toLowerCase();
      }

      const valLower = String(filter.value || '').toLowerCase();
      switch (filter.operator) {
        case 'contains': return cellValue.includes(valLower);
        case 'equals': return cellValue === valLower;
        case 'gt': return parseFloat(row[colKey]) > parseFloat(filter.value); // Per numeri
        case 'lt': return parseFloat(row[colKey]) < parseFloat(filter.value);
        case 'empty': return cellValue.trim() === '';
        default: return true;
      }
    };

    let filtered = [...data];
    if (filters.some(f => f.value.trim())) { // Se ci sono non vuoti
      filtered = filtered.filter(row => {
        let result = checkCondition(row, filters[0]);
        for (let i = 1; i < filters.length; i++) {
          const nextResult = checkCondition(row, filters[i]);
          result = filters[i].logic === 'AND' ? result && nextResult : result || nextResult;
        }
        return globalLogic === 'AND' ? result : !result;
      });
    }
    setFilteredData(filtered);
  }, [data, filters, globalLogic]);

  const fetchData = async () => {
    try {
      const response = await api.get('/data');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Errore caricamento dati:', err);
      if (err.response?.status === 401) {
        setTokens(null);  // Сброс токена
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }
      setError('Errore caricamento dati: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Seleziona file!');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        setError('Sessione scaduta — ricarica la pagina e loggati di nuovo');
        window.location.href = '/login';
        return;
      }

      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setData(response.data.data);
        setError('Dati aggiornati');
        fetchData(); 
      }
    } catch (err) {
      setError('Errore: ' + (err.response?.data?.error || err.message));
      if (err.response?.status === 401) {
        setTokens(null);
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const addFilter = () => {
    const newId = filters.length + 1;
    setFilters([...filters, { id: newId, column: 'all', operator: 'contains', value: '', logic: 'AND' }]);
  };

  const removeFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id, field, value) => {
    setFilters(filters.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const clearFilters = () => {
    setFilters([{ id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' }]);
    setGlobalLogic('AND');
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="container">
      <Navbar />

      <div className="main-content-table-utenti">
        <div className="content-table-utenti" style={{marginTop:"5rem"}}>
          <h4> Caricamento Excel con multiple condizioni di ricerca </h4>
          <div className="filtri">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
          />
          <button onClick={handleUpload} disabled={loading || !file}>
            {loading ? 'Caricamento...' : 'Carica e salva'}
          </button>
          </div>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {data.length > 0 && (
            <div>
              <h4>Filtri (multiple condizioni):</h4>
              <div className="forma-ricerca">
                
                {filters.map((filter, index) => (
                  <div key={filter.id} className="filtri">
                    <div>
                      {index > 0 && (
                        <select
                          value={filter.logic}
                          onChange={(e) => updateFilter(filter.id, 'logic', e.target.value)}
                          className="forma-ricerca"
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      )}
                      <select
                        value={filter.column}
                        onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                        className="forma-ricerca"
                      >
                        <option value="all">Tutte le colonne</option>
                        {headers.map((key) => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                        className="forma-ricerca"
                      >
                        <option value="contains">Contiene</option>
                        <option value="equals">Uguale</option>
                        <option value="gt">&gt; (maggiore)</option>
                        <option value="lt">&lt; (minore)</option>
                        <option value="empty">Vuoto</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Valore..."
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                        disabled={filter.operator === 'empty'}
                      />
                      {filters.length > 1 && (
                        <button onClick={() => removeFilter(filter.id)}>Elimina</button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="filtri">
                  <button onClick={addFilter}
                    className="btn-elimina">
                    Aggiungi condizione  
                  </button>
                  <select
                    value={globalLogic}
                    onChange={(e) => setGlobalLogic(e.target.value)}
                  >
                    <option value="AND">Logica generale: E</option>
                    <option value="OR">Logica generale: O </option>
                  </select>
                  <button onClick={clearFilters}> Pulisci filtri </button>
                </div>
                <p>
                  Trovate righe: {filteredData.length} из {data.length}
                </p>
              </div>

              <div>
                <table>
                  <thead>
                    <tr>
                      {headers.map((key) => (
                        <th key={key}>
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr key={index}>
                        {headers.map((key) => (
                          <td
                            key={key}>
                            {row[key] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredData.length === 0 && (
                  <p>Nessun risultato. Cambia i filtri.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ImportExcel;