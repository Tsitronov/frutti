import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 🔐 Заголовок с категорией пользователя
const getAuthHeader = () => {
  const categoria = localStorage.getItem('userCategoria');
  return { 'user-categoria': categoria || '' };
};

// 📤 Загрузка фото (массив)
export const uploadPhotos = createAsyncThunk(
  'photos/uploadPhotos',
  async (photos, { rejectWithValue }) => {
    const formData = new FormData();
    photos.forEach(photo => formData.append('photos', photo));

    try {
      const res = await axios.post(`${API_BASE}/api/upload-photos`, formData, {
        headers: getAuthHeader()
      });
      return res.data.photos;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Ошибка загрузки');
    }
  }
);

// 📥 Получение списка фото
export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/api/photos`, { headers: getAuthHeader() });
      return res.data.photos || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Ошибка загрузки списка');
    }
  }
);

// ❌ Удаление фото
export const deletePhoto = createAsyncThunk(
  'photos/deletePhoto',
  async (photoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/api/delete-photo/${photoId}`, { headers: getAuthHeader() });
      return photoId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Ошибка удаления');
    }
  }
);

// 🧩 Начальное состояние
const initialState = {
  photos: [],   // массив объектов {id, url, path, filename, ...}
  loading: false,
  error: null
};

// 🪄 Slice
const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    clearError: state => { state.error = null; }
  },
  extraReducers: builder => {
    builder
      // 🔄 upload
      .addCase(uploadPhotos.pending, state => { state.loading = true; state.error = null; })
      .addCase(uploadPhotos.fulfilled, (state, action) => {
        state.loading = false;
        // 👉 Добавляем новые фото в state с url = path
        state.photos = [...state.photos, ...action.payload.map(p => ({ ...p, url: p.path }))];
      })
      .addCase(uploadPhotos.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // 🔄 fetch list
      .addCase(fetchPhotos.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        // 👉 Добавляем url = path для каждого фото
        state.photos = action.payload.map(p => ({ ...p, url: p.path }));
      })
      .addCase(fetchPhotos.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // 🔄 delete
      .addCase(deletePhoto.pending, state => { state.loading = true; })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = state.photos.filter(p => p.id !== action.payload);
      })
      .addCase(deletePhoto.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { clearError } = photosSlice.actions;
export default photosSlice.reducer;