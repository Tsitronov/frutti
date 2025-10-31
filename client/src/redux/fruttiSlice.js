import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL del backend
const URL = `${process.env.REACT_APP_API_URL}/api/fruttiDemo`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    authorization: token ? `Bearer ${token}` : '',
  };
};


// 📥 Carica frutti dal server
export const fetchFrutti = createAsyncThunk('frutti/fetchFrutti', async () => {
  const res = await axios.get(URL, { headers: getAuthHeaders() });
  return Array.isArray(res.data) ? res.data : [];
});

export const aggiungiFrutto = createAsyncThunk('frutti/aggiungiFrutto', async (frutto) => {
  const res = await axios.post(URL, frutto, { headers: getAuthHeaders() });
  return res.data;
});

export const eliminaFrutto = createAsyncThunk('frutti/eliminaFrutto', async (id) => {
  await axios.delete(`${URL}/${id}`, { headers: getAuthHeaders() });
  return id;
});

export const modificaFrutto = createAsyncThunk('frutti/modificaFrutto', async (frutto) => {
  const { id, nome, descrizione, categoria } = frutto;
  const res = await axios.put(`${URL}/${id}`, { nome, descrizione, categoria }, { headers: getAuthHeaders() });
  return res.data;
});

// ✅ Carica frutti da localStorage
export const caricaFruttiLocalStorage = () => (dispatch) => {
  try {
    const localData = localStorage.getItem("frutti");
    const frutti = localData ? JSON.parse(localData) : [];
    dispatch({
      type: fetchFrutti.fulfilled.type,
      payload: Array.isArray(frutti) ? frutti : [],
    });
  } catch {
    dispatch({
      type: fetchFrutti.fulfilled.type,
      payload: [],
    });
  }
};

const fruttiSlice = createSlice({
  name: 'frutti',
  initialState: {
    lista: (() => {
      try {
        const local = JSON.parse(localStorage.getItem("frutti") || "[]");
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
      .addCase(fetchFrutti.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFrutti.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = Array.isArray(action.payload) ? action.payload : [];
        localStorage.setItem("frutti", JSON.stringify(state.lista));
      })
      .addCase(fetchFrutti.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(aggiungiFrutto.fulfilled, (state, action) => {
        if (action.payload) state.lista.push(action.payload);
      })
      .addCase(eliminaFrutto.fulfilled, (state, action) => {
        state.lista = state.lista.filter(item => item.id !== action.payload);
      })
      .addCase(modificaFrutto.fulfilled, (state, action) => {
        const index = state.lista.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      });
  }
});

export const { setCurrentPage } = fruttiSlice.actions;
export default fruttiSlice.reducer;