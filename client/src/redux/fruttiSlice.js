import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL del backend

//const URL = "https://frutti-backend.onrender.com/api/frutti";
const URL = "http://localhost:3001/api/frutti";


// 📥 Carica frutti dal server
export const fetchFrutti = createAsyncThunk('frutti/fetchFrutti', async () => {
  const res = await axios.get(URL);
  return res.data;
});

// ➕ Aggiungi nuovo frutto
export const aggiungiFrutto = createAsyncThunk('frutti/aggiungiFrutto', async (frutto) => {
  const res = await axios.post(URL, frutto);
  return res.data;
});

// ❌ Elimina frutto
export const eliminaFrutto = createAsyncThunk('frutti/eliminaFrutto', async (id) => {
  await axios.delete(`${URL}/${id}`);
  return id;
});

// ✏️ Modifica frutto (invia solo i campi rilevanti)
export const modificaFrutto = createAsyncThunk('frutti/modificaFrutto', async (frutto) => {
  const { id, nome, descrizione, categoria } = frutto;

  const res = await axios.put(`${URL}/${id}`, {
    nome,
    descrizione,
    categoria
  });

  return res.data;
});

const fruttiSlice = createSlice({
  name: 'frutti',
  initialState: {
    lista: [],
    currentPage: 1,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrutti.fulfilled, (state, action) => {
        state.lista = action.payload;
      })
      .addCase(aggiungiFrutto.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })
      .addCase(eliminaFrutto.fulfilled, (state, action) => {
        state.lista = state.lista.filter(item => item.id !== action.payload);
      })
      .addCase(modificaFrutto.fulfilled, (state, action) => {
        const index = state.lista.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.lista[index] = action.payload; // Sostituisce tutto, incl. descrizione
        }
      });
  }
});

export const { setCurrentPage } = fruttiSlice.actions;
export default fruttiSlice.reducer;
