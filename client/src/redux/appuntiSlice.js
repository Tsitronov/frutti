import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL del backend
const URL = `${process.env.REACT_APP_API_URL}/api/appuntiDemo`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { authorization: token ? `Bearer ${token}` : '' };
};

// 📥 Carica appunti dal server
export const fetchAppunti = createAsyncThunk('appunti/fetchAppunti', async () => {
  const res = await axios.get(URL, { headers: getAuthHeaders() });
  return Array.isArray(res.data) ? res.data : [];
});

export const aggiungiAppunto = createAsyncThunk('appunti/aggiungiAppunto', async (appunto) => {
  const res = await axios.post(URL, appunto, { headers: getAuthHeaders() });
  return res.data;
});

export const eliminaAppunto = createAsyncThunk('appunti/eliminaAppunto', async (id) => {
  await axios.delete(`${URL}/${id}`, { headers: getAuthHeaders() });
  return id;
});

export const modificaAppunto = createAsyncThunk('appunti/modificaAppunto', async (appunto) => {
  const { id, nome, descrizione, categoria } = appunto;
  const res = await axios.put(`${URL}/${id}`, { nome, descrizione, categoria }, { headers: getAuthHeaders() });
  return res.data;
});


// ✅ Carica appunti da localStorage
export const caricaAppuntiLocalStorage = () => (dispatch) => {
  try {
    const localData = localStorage.getItem("appunti");
    const appunti = localData ? JSON.parse(localData) : [];
    dispatch({
      type: fetchAppunti.fulfilled.type,
      payload: Array.isArray(appunti) ? appunti : [],
    });
  } catch {
    dispatch({
      type: fetchAppunti.fulfilled.type,
      payload: [],
    });
  }
};

const appuntiSlice = createSlice({
  name: 'appunti',
  initialState: {
    lista: (() => {
      try {
        const local = JSON.parse(localStorage.getItem("appunti") || "[]");
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
      .addCase(fetchAppunti.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppunti.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = Array.isArray(action.payload) ? action.payload : [];
        localStorage.setItem("appunti", JSON.stringify(state.lista));
      })
      .addCase(fetchAppunti.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(aggiungiAppunto.fulfilled, (state, action) => {
        if (action.payload) state.lista.push(action.payload);
      })
      .addCase(eliminaAppunto.fulfilled, (state, action) => {
        state.lista = state.lista.filter(item => item.id !== action.payload);
      })
      .addCase(modificaAppunto.fulfilled, (state, action) => {
        const index = state.lista.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      });
  }
});

export const { setCurrentPage } = appuntiSlice.actions;
export default appuntiSlice.reducer;