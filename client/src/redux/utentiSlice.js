import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

const URL = `${process.env.REACT_APP_API_URL}/api/utenti`;


export const fetchUtenti = createAsyncThunk(
  'utenti/fetchUtenti',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(URL);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Ошибка загрузки utenti');
    }
  }
);


export const aggiungiUtente = createAsyncThunk(
  'utenti/aggiungiUtente',
  async (utente, { rejectWithValue }) => {
    try {
      const res = await api.post(URL, utente);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Ошибка добавления utente');
    }
  }
);


export const modificaUtente = createAsyncThunk(
  'utenti/modificaUtente',
  async (utente, { rejectWithValue }) => {
    try {
      const res = await api.put(`${URL}/${utente.id}`, utente);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Ошибка обновления utente');
    }
  }
);


export const eliminaUtente = createAsyncThunk(
  'utenti/eliminaUtente',
  async (id, { rejectWithValue }) => {
  try {
    await api.delete(`${URL}/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Ошибка удаления utente');
  }
  }
);

const utentiSlice = createSlice({
  name: 'utenti',
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
    .addCase(fetchUtenti.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUtenti.fulfilled, (state, action) => {
      state.isLoading = false;
      state.lista = action.payload;
    })
    .addCase(fetchUtenti.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Ошибка загрузки utenti';
    })


    .addCase(aggiungiUtente.fulfilled, (state, action) => {
      if (action.payload) state.lista.push(action.payload);
    })
    .addCase(aggiungiUtente.rejected, (state, action) => {
      state.error = action.payload;
    })

 
    .addCase(modificaUtente.fulfilled, (state, action) => {
      const index = state.lista.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.lista[index] = action.payload;
    })
    .addCase(modificaUtente.rejected, (state, action) => {
      state.error = action.payload;
    })


    .addCase(eliminaUtente.fulfilled, (state, action) => {
      state.lista = state.lista.filter((u) => u.id !== action.payload);
    })
    .addCase(eliminaUtente.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { setCurrentPage, clearError } = utentiSlice.actions;
export default utentiSlice.reducer;