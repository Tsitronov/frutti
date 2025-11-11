import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

const URL = `${process.env.REACT_APP_API_URL}/api/adminDemo`;


export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await api.get(URL);
  return Array.isArray(res.data) ? res.data : [];
});


export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const res = await api.post(URL, user);
  return res.data;
});


export const updateUser = createAsyncThunk('users/updateUser', async ({ id, user }) => {
  const res = await api.put(`${URL}/${id}`, user);
  return res.data;
});


export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await api.delete(`${URL}/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    lista: [],
    isLoading: false,
    error: null,
    currentPage: 1,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lista = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.lista.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.lista = state.lista.filter(u => u.id !== action.payload);
      });
  }
});

export const { setCurrentPage } = usersSlice.actions;
export default usersSlice.reducer;
