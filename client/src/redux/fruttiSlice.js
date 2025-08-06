import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL del backend
// const URL = "https://frutti-backend.onrender.com/api/frutti";
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

// ✅ Carica frutti da localStorage
export const caricaFruttiLocalStorage = () => (dispatch) => {
  const localData = localStorage.getItem("frutti");
  if (localData) {
    const frutti = JSON.parse(localData);
    dispatch({
      type: fetchFrutti.fulfilled.type,
      payload: frutti,
    });
  }
};

const fruttiSlice = createSlice({
  name: 'frutti',
  initialState: {
    lista: JSON.parse(localStorage.getItem("frutti")) || [],
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
      .addCase(fetchFrutti.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFrutti.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = action.payload;
        localStorage.setItem("frutti", JSON.stringify(action.payload));
      })
      .addCase(fetchFrutti.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
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
