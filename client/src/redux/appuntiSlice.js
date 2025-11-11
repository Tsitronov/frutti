import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

const URL = `${process.env.REACT_APP_API_URL}/api/appuntiDemo`;

export const fetchAppunti = createAsyncThunk(
  'appunti/fetchAppunti',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(URL);
      return res.data.appunti || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error carica appunti');
    }
  }
);


export const aggiungiAppunto = createAsyncThunk(
  'appunti/aggiungiAppunto',
  async (appunto, { rejectWithValue }) => {
    try {
      const res = await api.post(URL, appunto);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error aggiungere');
    }
  }
);


export const modificaAppunto = createAsyncThunk(
  'appunti/modificaAppunto',
  async (appunto, { rejectWithValue }) => {
    try {
      const { id, nome, descrizione, categoria } = appunto;
      const res = await api.put(`${URL}/${id}`, { nome, descrizione, categoria });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error modifica');
    }
  }
);


export const eliminaAppunto = createAsyncThunk(
  'appunti/eliminaAppunto',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error elimina');
    }
  }
);


const appuntiSlice = createSlice({
  name: 'appunti',
  initialState: {
    lista: [],
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
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
      })
      .addCase(fetchAppunti.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // add
      .addCase(aggiungiAppunto.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })
      .addCase(aggiungiAppunto.rejected, (state, action) => {
        state.error = action.payload;
      })

      // edit
      .addCase(modificaAppunto.fulfilled, (state, action) => {
        const index = state.lista.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      })
      .addCase(modificaAppunto.rejected, (state, action) => {
        state.error = action.payload;
      })

      // delete
      .addCase(eliminaAppunto.fulfilled, (state, action) => {
        state.lista = state.lista.filter((item) => item.id !== action.payload);
      })
      .addCase(eliminaAppunto.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, clearError } = appuntiSlice.actions;
export default appuntiSlice.reducer;