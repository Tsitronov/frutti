import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPhotos, fetchPhotos, deletePhoto, clearError } from '../../redux/photosSlice';

const PhotoUploader = () => {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  // Выбор файлов
  const handleFileSelect = (e) => {
    const maxNew = 5 - photos.length;
    if (maxNew <= 0) return;
    const files = Array.from(e.target.files).slice(0, maxNew);
    setSelectedFiles(files);
  };

  // Загрузка выбранных файлов
  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      await dispatch(uploadPhotos(selectedFiles));
      setSelectedFiles([]);
      dispatch(fetchPhotos());  // 👉 Обновляем список
    }
  };

  // Удаление фото
  const handleDelete = async (photoId) => {
    await dispatch(deletePhoto(photoId));
    dispatch(fetchPhotos());  // 👉 Обновляем список
  };

  // 👉 Очистка ошибки
  const handleClearError = () => dispatch(clearError());

  {loading && <div className="loading-spinner"></div>}

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h4>Управление фото (макс. 5)</h4>
      <p>Текущих: {photos.length}/5</p>

      {photos.length < 5 && (
        <>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            disabled={loading}
          />
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || loading}
            style={{ marginLeft: '10px' }}
          >
            Загрузить ({selectedFiles.length})
          </button>
        </>
      )}

      {error && (
        <p style={{ color: 'red' }}>
          Ошибка фото: {error}
          <button onClick={handleClearError} style={{ marginLeft: '10px' }}>
            Очистить
          </button>
          <button onClick={() => dispatch(fetchPhotos())} style={{ marginLeft: '5px' }}>
            Повторить
          </button>
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
        {photos.map((photo, index) => (
          <div key={photo.id ?? index} style={{ margin: '5px', textAlign: 'center' }}>
            <img
              src={photo.url || photo.path || ''}  // 👉 Используем Cloudinary URL (photo.path)
              alt={photo.filename || 'photo'}
              width="100"
              style={{ borderRadius: '6px', cursor: 'pointer' }}
              crossOrigin="anonymous"  // 👉 Для CORS
              onError={(e) => {
                e.target.style.opacity = '0.4';
                e.target.title = 'Ошибка загрузки изображения';
                console.error('Image load error:', e.target.src);  // 👉 Лог в консоль
              }}
            />
            <div>
              <button onClick={() => handleDelete(photo.id)} disabled={loading}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUploader;