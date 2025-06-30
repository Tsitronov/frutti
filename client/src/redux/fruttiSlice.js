import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = "https://frutti-backend.onrender.com/api/frutti";

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

// ✏️ Modifica frutto
export const modificaFrutto = createAsyncThunk('frutti/modificaFrutto', async (frutto) => {
  const res = await axios.put(`${URL}/${frutto.id}`, frutto);
  return res.data;
});

const fruttiSlice = createSlice({
  name: 'frutti',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrutti.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(aggiungiFrutto.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(eliminaFrutto.fulfilled, (state, action) => {
        return state.filter(item => item.id !== action.payload);
      })
      .addCase(modificaFrutto.fulfilled, (state, action) => {
        const index = state.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      });
  }
});

export default fruttiSlice.reducer;