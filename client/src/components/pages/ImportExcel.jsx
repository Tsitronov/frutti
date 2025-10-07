import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../UI/navbar/Navbar";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 

function ImportExcel() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Фильтры: массив объектов условий
  const [filters, setFilters] = useState([
    { id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' } // Первое по умолчанию
  ]);
  const [globalLogic, setGlobalLogic] = useState('AND'); // Общая логика (AND/OR для всех)

  // Автозагрузка данных из БД
  useEffect(() => {
    fetchData();
  }, []);

  // Фильтрация при изменении data или filters
  useEffect(() => {
    if (data.length === 0) {
      setFilteredData([]);
      return;
    }

    // Функция проверки условия для одной строки
    const checkCondition = (row, filter) => {
      const colKey = filter.column === 'all' ? null : filter.column;
      let cellValue = '';
      if (colKey === null) {
        // По всем колонкам
        const values = Object.values(row).map(v => String(v || '').toLowerCase());
        cellValue = values.join(' '); // Объединяем для поиска
      } else {
        cellValue = String(row[colKey] || '').toLowerCase();
      }

      const valLower = String(filter.value || '').toLowerCase();
      switch (filter.operator) {
        case 'contains': return cellValue.includes(valLower);
        case 'equals': return cellValue === valLower;
        case 'gt': return parseFloat(row[colKey]) > parseFloat(filter.value); // Для чисел
        case 'lt': return parseFloat(row[colKey]) < parseFloat(filter.value);
        case 'empty': return cellValue.trim() === '';
        default: return true;
      }
    };

    // Фильтруем с логикой
    let filtered = [...data];
    if (filters.some(f => f.value.trim())) { // Если есть непустые
      filtered = filtered.filter(row => {
        let result = checkCondition(row, filters[0]);
        for (let i = 1; i < filters.length; i++) {
          const nextResult = checkCondition(row, filters[i]);
          result = filters[i].logic === 'AND' ? result && nextResult : result || nextResult;
        }
        return globalLogic === 'AND' ? result : !result; // Global OR инвертирует, но лучше переделать на дерево — для простоты AND по умолчанию
        // Примечание: Для полного OR/AND-дерева используй nested logic, но здесь линейно
      });
    }
    setFilteredData(filtered);
  }, [data, filters, globalLogic]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/data`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Выбери файл!');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setData(response.data.data);
        setError('dati rinovati');
        fetchData(); 
      }
    } catch (err) {
      setError('Ошибка: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Добавляем новое условие
  const addFilter = () => {
    const newId = filters.length + 1;
    setFilters([...filters, { id: newId, column: 'all', operator: 'contains', value: '', logic: 'AND' }]);
  };

  // Удаляем условие
  const removeFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  // Обновляем условие
  const updateFilter = (id, field, value) => {
    setFilters(filters.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  // Сброс фильтров
  const clearFilters = () => {
    setFilters([{ id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' }]);
    setGlobalLogic('AND');
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="container">
      <Navbar />

      <div className="main-content">
        <div className="content">
          <h2>Загрузка Excel с несколькими условиями поиска</h2>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
            style={{ marginBottom: '10px' }}
          />
          <button onClick={handleUpload} disabled={loading || !file}>
            {loading ? 'Загрузка...' : 'Загрузить и сохранить'}
          </button>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {data.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              {/* Блок фильтров */}
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <h4>Фильтры (несколько условий):</h4>
                {filters.map((filter, index) => (
                  <div key={filter.id} style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {index > 0 && (
                        <select
                          value={filter.logic}
                          onChange={(e) => updateFilter(filter.id, 'logic', e.target.value)}
                          style={{ width: '60px' }}
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      )}
                      <select
                        value={filter.column}
                        onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                        style={{ flex: 1, padding: '5px' }}
                      >
                        <option value="all">Все колонки</option>
                        {headers.map((key) => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                        style={{ width: '100px', padding: '5px' }}
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
                        style={{ flex: 2, padding: '5px' }}
                        disabled={filter.operator === 'empty'}
                      />
                      {filters.length > 1 && (
                        <button onClick={() => removeFilter(filter.id)} style={{ color: 'red' }}>Удалить</button>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={addFilter} style={{ marginRight: '10px' }}>Добавить условие</button>
                  <select
                    value={globalLogic}
                    onChange={(e) => setGlobalLogic(e.target.value)}
                    style={{ marginRight: '10px' }}
                  >
                    <option value="AND">Общая логика: AND</option>
                    <option value="OR">Общая логика: OR</option>
                  </select>
                  <button onClick={clearFilters}>Очистить фильтры</button>
                </div>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Найдено строк: {filteredData.length} из {data.length}
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <h3>Таблица (фильтрована):</h3>
                <table 
                  border="1" 
                  style={{ 
                    borderCollapse: 'collapse', 
                    width: '100%', 
                    fontSize: '14px' 
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      {headers.map((key) => (
                        <th key={key} style={{ padding: '8px', textAlign: 'left' }}>
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr key={index}>
                        {headers.map((key) => (
                          <td key={key} style={{ padding: '8px' }}>
                            {row[key] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length === 0 && <p>Нет результатов. Измени фильтры.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ImportExcel;