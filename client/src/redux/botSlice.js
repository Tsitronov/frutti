import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../api.js';

const URL = `${process.env.REACT_APP_API_URL}/api/bot`;

export const fetchBotResult = createAsyncThunk(
  "bot/fetchResult",
  async (query) => {
    const response = await api.post(URL, { query });
    return response.data.result;
  }
);

const botSlice = createSlice({
  name: "bot",
  initialState: { response: "" },

  reducers: {
    // ✅ ДОБАВИЛИ
    clearResponse: (state) => {
      state.response = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBotResult.pending, (state) => {
        state.response = "";
      })

      .addCase(fetchBotResult.fulfilled, (state, action) => {
        state.response = action.payload;
      });
  },
});

// ✅ экспорт action
export const { clearResponse } = botSlice.actions;

export default botSlice.reducer;
