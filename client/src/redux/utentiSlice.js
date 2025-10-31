import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';  // 👉 NEW: Базовый URL, чтоб гибко

// 👉 NEW: Thunk для установки token (вызывай после login)
export const setToken = createAsyncThunk('utenti/setToken', async (token) => {
  if (token) {
    localStorage.setItem('jwtToken', token);  // 👉 Сохраняем в localStorage
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // 👉 Глобальный header для axios
  } else {
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
  }
  return token;
});

// 👉 NEW: Загрузка token из localStorage при старте (вызывай в store init)
export const loadTokenFromStorage = createAsyncThunk('utenti/loadTokenFromStorage', async () => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return token;
});

// 📥 Carica tutti gli utenti
export const fetchUtenti = createAsyncThunk('utenti/fetchUtenti', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE}/api/utentiDemo`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // 👉 NEW: Clear token on 401
      localStorage.removeItem('jwtToken');
      delete axios.defaults.headers.common['Authorization'];
    }
    return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки пользователей');
  }
});

// ➕ Aggiungi utente
export const aggiungiUtente = createAsyncThunk('utenti/aggiungiUtente', async (utente, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE}/api/utentiDemo`, utente);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Ошибка добавления пользователя');
  }
});

// ✏️ Modifica utente
export const modificaUtente = createAsyncThunk('utenti/modificaUtente', async (utente, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_BASE}/api/utentiDemo/${utente.id}`, utente);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Ошибка обновления пользователя');
  }
});

// ❌ Elimina utente
export const eliminaUtente = createAsyncThunk('utenti/eliminaUtente', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE}/api/utentiDemo/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Ошибка удаления пользователя');
  }
});

// ✅ Carica utenti da localStorage (fallback, если API down)
export const caricaUtentiLocalStorage = () => (dispatch) => {
  const localData = localStorage.getItem("utenti");
  if (localData) {
    const utenti = JSON.parse(localData);
    dispatch({
      type: fetchUtenti.fulfilled.type,
      payload: utenti,
    });
  }
};

const utentiSlice = createSlice({
  name: 'utenti',
  initialState: {
    lista: JSON.parse(localStorage.getItem("utenti")) || [],
    currentPage: 1,
    isLoading: false,
    error: null,
    token: localStorage.getItem('jwtToken') || null,  // 👉 NEW: Token в state
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    // 👉 NEW: Reducer для token (если не используешь thunk)
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('jwtToken');
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      // Token thunks
      .addCase(setToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      // Fetch utenti
      .addCase(fetchUtenti.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUtenti.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = action.payload;
        localStorage.setItem("utenti", JSON.stringify(action.payload));
      })
      .addCase(fetchUtenti.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;  // 👉 NEW: Используй rejectWithValue
      })
      // Aggiungi
      .addCase(aggiungiUtente.fulfilled, (state, action) => {
        state.lista.push(action.payload);
        localStorage.setItem("utenti", JSON.stringify(state.lista));  // 👉 NEW: Обнови localStorage
      })
      .addCase(aggiungiUtente.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Modifica
      .addCase(modificaUtente.fulfilled, (state, action) => {
        const index = state.lista.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.lista[index] = action.payload;
          localStorage.setItem("utenti", JSON.stringify(state.lista));
        }
      })
      .addCase(modificaUtente.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Elimina
      .addCase(eliminaUtente.fulfilled, (state, action) => {
        state.lista = state.lista.filter(u => u.id !== action.payload);
        localStorage.setItem("utenti", JSON.stringify(state.lista));
      })
      .addCase(eliminaUtente.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, clearToken } = utentiSlice.actions;
export default utentiSlice.reducer;