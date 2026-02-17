import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

// URL del backend
const URL = `${process.env.REACT_APP_API_URL}/api/articoli`;

// 📥 Carica articoli dal server
export const fetchArticoli = createAsyncThunk('articoli/fetchArticoli', async () => {
  const res = await axios.get(URL);
  // Проверяем, что сервер вернул массив, иначе пустой массив
  return Array.isArray(res.data) ? res.data : [];
});

// ➕ Aggiungi nuovo articolo
export const aggiungiArticolo = createAsyncThunk('articoli/aggiungiArticolo', async (articolo) => {
  const res = await axios.post(URL, articolo);
  return res.data;
});

// ❌ Elimina articolo
export const eliminaArticolo = createAsyncThunk('articoli/eliminaArticolo', async (id) => {
  await axios.delete(`${URL}/${id}`);
  return id;
});

// ✏️ Modifica articolo
export const modificaArticolo = createAsyncThunk('articoli/modificaArticolo', async (articolo) => {
  const { id, nome, descrizione, categoria } = articolo;
  const res = await axios.put(`${URL}/${id}`, { nome, descrizione, categoria });
  return res.data;
});

// ✅ Carica articoli da localStorage
export const caricaArticoliLocalStorage = () => (dispatch) => {
  try {
    const localData = localStorage.getItem("articoli");
    const articoli = localData ? JSON.parse(localData) : [];
    dispatch({
      type: fetchArticoli.fulfilled.type,
      payload: Array.isArray(articoli) ? articoli : [],
    });
  } catch {
    dispatch({
      type: fetchArticoli.fulfilled.type,
      payload: [],
    });
  }
};

const articoliSlice = createSlice({
  name: 'articoli',
  initialState: {
    lista: (() => {
      try {
        const local = JSON.parse(localStorage.getItem("articoli") || "[]");
        return Array.isArray(local) ? local : [];
      } catch {
        return [];
      }
    })(),
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticoli.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticoli.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = Array.isArray(action.payload) ? action.payload : [];
        localStorage.setItem("articoli", JSON.stringify(state.lista));
      })
      .addCase(fetchArticoli.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(aggiungiArticolo.fulfilled, (state, action) => {
        if (action.payload) state.lista.push(action.payload);
      })
      .addCase(eliminaArticolo.fulfilled, (state, action) => {
        state.lista = state.lista.filter(item => item.id !== action.payload);
      })
      .addCase(modificaArticolo.fulfilled, (state, action) => {
        const index = state.lista.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      });
  }
});

export const { setCurrentPage } = articoliSlice.actions;
export default articoliSlice.reducer;