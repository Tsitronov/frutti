import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from "../UI/navbar/Navbar";
import { fetchUtenti, caricaUtentiLocalStorage } from "../../redux/utentiSlice";

const UtentiTable = () => {
  const utenti = useSelector((state) => state.utenti.lista) || []; // Dati dal Redux store
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error); // Rinominato per chiarezza

  // Фильтры: массив объектов условий
  const [filters, setFilters] = useState([
    { id: 1, column: 'all', operator: 'contains', value: '', logic: 'AND' } // Первое по умолчанию
  ]);
  const [globalLogic, setGlobalLogic] = useState('AND'); // Общая логика (AND/OR для всех)

  // Usa utenti come data base
  const data = useMemo(() => utenti, [utenti]);

  // 📥 Carica utenti (immediatamente, combinando locale + API)
  useEffect(() => {
    // Carica locale prima
    dispatch(caricaUtentiLocalStorage());
    
    // Poi fetch API
    dispatch(fetchUtenti()).then((action) => {
      if (fetchUtenti.fulfilled.match(action)) {
        // Lista aggiornata nel store, filteredData si aggiorna via useMemo/effect
        console.log('Utenti caricati:', action.payload.length);
      }
    });
  }, [dispatch]);

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
          <h3>Tutti Utenti</h3>

          {isLoading && <div className="loading-spinner">Caricamento...</div>}
          {error && <p className="error-login" style={{ color: 'red' }}>{error}</p>}

          {data.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              {/* Блок фильтров */}
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <h4>Фильтры utenti (несколько условий):</h4>
                {filters.map((filter, index) => (
                  <div key={filter.id} style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ddd', borderRadius: '3px' }}>
                    <div style={{ display: 'block', alignItems: 'center', padding: '5px' }}>
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
                        style={{ width: '120px', padding: '5px', margin: '10px 10px' }}
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
                <div style={{ marginTop: '10px', padding: '5px', marginBottom: '10px' }}>
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

              <div
                style={{
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch', // плавная прокрутка на iPhone
                  marginTop: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <h3 style={{ fontSize: '16px', padding: '10px' }}>Таблица utenti (фильтрована):</h3>

                <table
                  border="1"
                  style={{
                    borderCollapse: 'collapse',
                    minWidth: '600px', // 👉 чтобы не сжималась слишком на мобильных
                    width: '100%',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                      {headers.map((key) => (
                        <th
                          key={key}
                          style={{
                            padding: '10px',
                            textAlign: 'left',
                            whiteSpace: 'nowrap', // 👉 предотвращает перенос текста
                          }}
                        >
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
                            key={key}
                            style={{
                              padding: '8px',
                              borderTop: '1px solid #eee',
                              verticalAlign: 'top',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row[key] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredData.length === 0 && (
                  <p style={{ padding: '10px', color: 'gray' }}>Нет результатов. Измени фильтры.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UtentiTable;