import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

const URL = `${process.env.REACT_APP_API_URL}/api/frutti`;

export const fetchFrutti = createAsyncThunk(
  'frutti/fetchFrutti',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(URL);
      return Array.isArray(res.data.frutti) ? res.data.frutti : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error carica frutti');
    }
  }
);


// ➕ POST – добавить фрукт
export const aggiungiFrutto = createAsyncThunk(
  'frutti/aggiungiFrutto',
  async (frutto, { rejectWithValue }) => {
    try {
      const res = await api.post(URL, frutto);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error aggiungere');
    }
  }
);


export const modificaFrutto = createAsyncThunk(
  'frutti/modificaFrutto',
  async (frutto, { rejectWithValue }) => {
    try {
      const { id, nome, descrizione, categoria } = frutto;
      const res = await api.put(`${URL}/${id}`, { nome, descrizione, categoria });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error modifica');
    }
  }
);


export const eliminaFrutto = createAsyncThunk(
  'frutti/eliminaFrutto',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error elimina');
    }
  }
);


const fruttiSlice = createSlice({
  name: 'frutti',
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
      .addCase(fetchFrutti.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFrutti.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFrutti.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // add
      .addCase(aggiungiFrutto.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })
      .addCase(aggiungiFrutto.rejected, (state, action) => {
        state.error = action.payload;
      })

      // edit
      .addCase(modificaFrutto.fulfilled, (state, action) => {
        const index = state.lista.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      })
      .addCase(modificaFrutto.rejected, (state, action) => {
        state.error = action.payload;
      })

      // delete
      .addCase(eliminaFrutto.fulfilled, (state, action) => {
        state.lista = state.lista.filter((item) => item.id !== action.payload);
      })
      .addCase(eliminaFrutto.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, clearError } = fruttiSlice.actions;
export default fruttiSlice.reducer;
