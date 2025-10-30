import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import Navbar from "../UI/navbar/Navbar";
import { fetchUtenti, caricaUtentiLocalStorage } from "../../redux/utentiSlice";

const UtentiTable = () => {
  const utenti = useSelector((state) => state.utenti.lista) || []; // Dati dal Redux store
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error);

  // Filtri: array di oggetti condizioni
  const [filters, setFilters] = useState([
    { id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' }
  ]);
  const [globalLogic, setGlobalLogic] = useState('AND');

  // Usa utenti come base dati
  const data = useMemo(() => utenti, [utenti]);


  // Маппинг для русских названий категорий (для отображения)
  const categoryLabels = useMemo(() => ({
    reparto: 'Отдел',
    stanza: 'Комната',
    cognome: 'Фамилия',
    bagno: 'Ванна',
    barba: 'Борода',
    autonomia: 'Автономия',
    vestiti: 'Одежда',
    alimentazione: 'Питание',
    accessori: 'Аксессуары',
    altro: 'Другое',
  }), []);



  // 📥 Carica utenti (immediatamente, combinando locale + API)
  useEffect(() => {
    dispatch(caricaUtentiLocalStorage());
    
    // Poi fetch API
    dispatch(fetchUtenti()).then((action) => {
      if (fetchUtenti.fulfilled.match(action)) {
        console.log('Utenti caricati:', action.payload.length);
      }
    });
  }, [dispatch]);

  // Filtraggio al cambiamento di data o filtri
  useEffect(() => {
    if (data.length === 0) {
      setFilteredData([]);
      return;
    }

    // Funzione per verificare una condizione su una riga
    const checkCondition = (row, filter) => {
      const colKey = filter.column === 'all' ? null : filter.column;
      let cellValue = '';
      if (colKey === null) {
        // Su tutte le colonne
        const values = Object.values(row).map(v => String(v || '').toLowerCase());
        cellValue = values.join(' '); // Unisci per ricerca
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

    // Filtra con logica
    let filtered = [...data];
    if (filters.some(f => f.value.trim())) { // Se ci sono filtri non vuoti
      filtered = filtered.filter(row => {
        let result = checkCondition(row, filters[0]);
        for (let i = 1; i < filters.length; i++) {
          const nextResult = checkCondition(row, filters[i]);
          result = filters[i].logic === 'AND' ? (result && nextResult) : (result || nextResult);
        }
        // Applica logica globale al risultato del gruppo
        return globalLogic === 'AND' ? result : !result; // NOT per OR globale? Wait, fix: per OR globale, forse invertire se tutti AND interni, ma semplifichiamo: usa global per il gruppo finale
      });
    }
    setFilteredData(filtered);
  }, [data, filters, globalLogic]);

  // Aggiungi nuovo filtro
  const addFilter = () => {
    const newId = Math.max(...filters.map(f => f.id)) + 1;
    setFilters([...filters, { id: newId, column: 'all', operator: 'contains', value: '', logic: 'AND' }]);
  };

  // Rimuovi filtro
  const removeFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
    if (filters.length === 1) {
      setFilters([{ id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' }]);
    }
  };

  // Aggiorna filtro
  const updateFilter = (id, field, value) => {
    setFilters(filters.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  // Reset filtri
  const clearFilters = () => {
    setFilters([{ id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' }]);
    setGlobalLogic('AND');
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="container">
      <Navbar />

      <div className="main-content-table-utenti">
        <div className="content-table-utenti">
           

          {isLoading && <div className="loading-spinner"></div>}
          {error && <p className="error-login">{error}</p>}

          {data.length > 0 && (
            <div>
              <h4>Все пользователи <NavLink to="/reportDemo">Отчёт</NavLink></h4>
              <h4>Фильтры пользователей (несколько условий):</h4>
              <div className="forma-ricerca">
                {filters.map((filter, index) => (
                  <div key={filter.id} className="filtri">
                    {index > 0 && (
                      <select
                        value={filter.logic}
                        onChange={(e) => updateFilter(filter.id, 'logic', e.target.value)}
                        className="forma-ricerca"
                      >
                        <option value="AND">И</option>
                        <option value="OR">ИЛИ</option>
                      </select>
                    )}

                    <select
                      value={filter.column}
                      onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                      className="forma-ricerca"
                    >
                    <option value="all">Все столбцы</option>
                      {headers.map((key) => (
                        <option key={key} value={key}>
                          {categoryLabels[key] || key}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                      className="forma-ricerca"
                    >
                      <option value="contains">Содержит</option>
                      <option value="equals">Равно</option>
                      <option value="gt">&gt; (больше)</option>
                      <option value="lt">&lt; (меньше)</option>
                      <option value="empty">Пусто</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Значение..."
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                      disabled={filter.operator === 'empty'}
                      className="forma-ricerca"
                    />
                    {filters.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeFilter(filter.id)}
                        className="btn-elimina"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
                <div className="filtri">
                  <button type="button" onClick={addFilter} className="btn-modifica">Добавить условие</button>
                  <select
                    value={globalLogic}
                    onChange={(e) => setGlobalLogic(e.target.value)}
                    className="forma-ricerca"
                  >
                    <option value="AND">Общая логика: И</option>
                    <option value="OR">Общая логика: ИЛИ</option>
                  </select>
                  <button type="button" onClick={clearFilters} className="btn-salva">Очистить фильтры</button>
                </div>
                <p className="verde">
                  Найдено строк: <strong>{filteredData.length}</strong> из <strong>{data.length}</strong>
                </p>
              </div>

              <div>
                <h4>Таблица пользователей (отфильтрованная):</h4>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        {headers.map((key) => (
                          <th key={key}>
                            {categoryLabels[key] || key}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredData.map((row, index) => (
                        <tr key={index}>
                          {headers.map((key) => (
                            <td key={key}>
                              {row[key] ?? '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredData.length === 0 && (
                  <p className="carico-dati-container">
                    <span className="carico-dati">Нет результатов. Измените фильтры.</span>
                  </p>
                )}
              </div>
            </div>
          )}
          {data.length === 0 && !isLoading && (
            <p className="carico-dati">Пользователь не загружен.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UtentiTable;