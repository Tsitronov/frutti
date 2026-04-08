import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

const URL = `${process.env.REACT_APP_API_URL}/api/articoli`;

export const fetchArticoli = createAsyncThunk(
  'articoli/fetchArticoli',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(URL);
      return res.data.articoli || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error carica articoli');
    }
  }
);


export const aggiungiArticolo = createAsyncThunk(
  'articoli/aggiungiArticolo',
  async (articolo, { rejectWithValue }) => {
    try {
      const res = await api.post(URL, articolo);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error aggiungere');
    }
  }
);


export const modificaArticolo = createAsyncThunk(
  'articoli/modificaArticolo',
  async (articolo, { rejectWithValue }) => {
    try {
      const { id, nome, descrizione, categoria } = articolo;
      const res = await api.put(`${URL}/${id}`, { nome, descrizione, categoria });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error modifica');
    }
  }
);


export const eliminaArticolo = createAsyncThunk(
  'articoli/eliminaArticolo',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'error elimina');
    }
  }
);


const articoliSlice = createSlice({
  name: 'articoli',
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
      .addCase(fetchArticoli.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticoli.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchArticoli.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // add
      .addCase(aggiungiArticolo.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })
      .addCase(aggiungiArticolo.rejected, (state, action) => {
        state.error = action.payload;
      })

      // edit
    .addCase(modificaArticolo.fulfilled, (state, action) => {
      const updated = action.payload;

      // Защита от пустого/неправильного ответа сервера
      if (!updated || typeof updated !== 'object' || !updated.id) {
        console.warn("modificaArticolo вернул некорректные данные:", updated);
        return;
      }

      // Приводим оба id к строке — это решает 95% проблем с number vs string
      const updatedId = String(updated.id);

      const index = state.lista.findIndex(item => String(item.id) === updatedId);

      if (index !== -1) {
        // Обновляем объект безопасно (сохраняем старые поля, если сервер не вернул все)
        state.lista[index] = { ...state.lista[index], ...updated };
      } else {
        console.warn(
          `Не нашли Articolo с id ${updatedId} в списке. ` +
          `Текущие id в списке: ${state.lista.map(i => i.id).join(', ')}`
        );
      }
    })

    .addCase(modificaArticolo.rejected, (state, action) => {
      state.error = action.payload || 'Ошибка обновления Articolo';
    })

      // delete
      .addCase(eliminaArticolo.fulfilled, (state, action) => {
        state.lista = state.lista.filter((item) => item.id !== action.payload);
      })
      .addCase(eliminaArticolo.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, clearError } = articoliSlice.actions;
export default articoliSlice.reducer;