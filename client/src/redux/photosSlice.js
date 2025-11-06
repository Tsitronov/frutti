import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 🔐 Заголовок только с категорией пользователя
const getCategoriaHeader = () => {
  const categoria = localStorage.getItem('categoria'); // у тебя теперь categoria, не userCategoria
  return categoria ? { categoria } : {};
};

// 📤 Загрузка фото
export const uploadPhotos = createAsyncThunk(
  'photos/uploadPhotos',
  async (photos, { rejectWithValue }) => {
    const formData = new FormData();
    photos.forEach(photo => formData.append('photos', photo));

    try {
      const res = await api.post(`${API_BASE}/api/upload-photos`, formData, {
        headers: {
          ...getCategoriaHeader(),
        },
      });
      return res.data.photos;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Ошибка загрузки фото');
    }
  }
);

// 📥 Получение списка фото
export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/api/photos`, {
        headers: {
          ...getCategoriaHeader(),
        },
      });
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
      await api.delete(`${API_BASE}/api/delete-photo/${photoId}`, {
        headers: {
          ...getCategoriaHeader(),
        },
      });
      return photoId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Ошибка удаления фото');
    }
  }
);

// 🧩 Начальное состояние
const initialState = {
  photos: [],
  loading: false,
  error: null,
};

// 🪄 Slice
const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // uploadPhotos
      .addCase(uploadPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = [...state.photos, ...action.payload.map(p => ({ ...p, url: p.path }))];
      })
      .addCase(uploadPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPhotos
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload.map(p => ({ ...p, url: p.path }));
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deletePhoto
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = state.photos.filter(p => p.id !== action.payload);
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = photosSlice.actions;
export default photosSlice.reducer;
