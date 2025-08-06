import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = "https://frutti-backend.onrender.com/api/utenti";
//const URL = "http://localhost:3001/api/utenti";


// 📥 Carica tutti gli utenti
export const fetchUtenti = createAsyncThunk('utenti/fetchUtenti', async () => {
  const res = await axios.get(URL);
  return res.data;
});

// ➕ Aggiungi utente
export const aggiungiUtente = createAsyncThunk('utenti/aggiungiUtente', async (utente) => {
  const res = await axios.post(URL, utente);
  return res.data;
});

// ✏️ Modifica utente
export const modificaUtente = createAsyncThunk('utenti/modificaUtente', async (utente) => {
  const res = await axios.put(`${URL}/${utente.id}`, utente);
  return res.data;
});

// ❌ Elimina utente
export const eliminaUtente = createAsyncThunk('utenti/eliminaUtente', async (id) => {
  await axios.delete(`${URL}/${id}`);
  return id;
});

// ✅ Carica utenti da localStorage
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
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message;
      })
      .addCase(aggiungiUtente.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })
      .addCase(modificaUtente.fulfilled, (state, action) => {
        const index = state.lista.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.lista[index] = action.payload;
        }
      })
      .addCase(eliminaUtente.fulfilled, (state, action) => {
        state.lista = state.lista.filter(u => u.id !== action.payload);
      })
  }
});

export const { setCurrentPage } = utentiSlice.actions;
export default utentiSlice.reducer;
