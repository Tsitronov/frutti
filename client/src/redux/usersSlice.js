import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = `${process.env.REACT_APP_API_URL}/api/adminDemo`;

// 📥 GET – получить всех пользователей
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(URL, {
    headers: { authorization: `Bearer ${token}` },
  });
  return Array.isArray(res.data) ? res.data : [];
});

// ➕ POST – добавить пользователя
export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(URL, user, {
    headers: { authorization: `Bearer ${token}` },
  });
  return res.data;
});

// ✏ PUT – обновить пользователя
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, user }) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${URL}/${id}`, user, {
    headers: { authorization: `Bearer ${token}` },
  });
  return res.data;
});

// ❌ DELETE – удалить пользователя
export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`${URL}/${id}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return id;
});
