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
      dispatch(fetchPhotos());
    }
  };

  // Удаление фото
  const handleDelete = async (photoId) => {
    await dispatch(deletePhoto(photoId));
    dispatch(fetchPhotos());
  };

  // 👉 Очистка ошибки
  const handleClearError = () => dispatch(clearError());

  return (
    <div className="photo-uploader">
      {loading && <div className="loading-spinner"></div>}
      <h4 className="uploader-title">Управление фото (макс. 5)</h4>
      <p className="uploader-count">Текущие: {photos.length}/5</p>

      {photos.length < 5 && (
        <div className="uploader-controls">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            disabled={loading}
            className="file-input"
          />
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || loading}
            className="upload-button"
          >
            Загрузить ({selectedFiles.length})
          </button>
        </div>
      )}

      {error && (
        <div className="uploader-error">
          <p className="error-text">Ошибка фото: {error}</p>
          <button onClick={handleClearError} className="clear-error-button">
            Очистить
          </button>
          <button onClick={() => dispatch(fetchPhotos())} className="retry-button">
            Повторить
          </button>
        </div>
      )}

      <div className="uploader-photo-grid">
        {photos.map((photo, index) => (
          <div key={photo.id || index} className="uploader-photo-item">
            <img
              src={photo.url || photo.path || ''}
              alt={photo.filename || `фото ${photo.id || index}`}
              width="100"
              crossOrigin="anonymous"
              className="uploader-photo-image"
              onError={(e) => {
                e.target.style.opacity = '0.4';
                e.target.title = 'Ошибка загрузки изображения';
                console.error('Image load error:', e.target.src);
              }}
            />
            <div className="uploader-photo-actions">
              <button onClick={() => handleDelete(photo.id)} disabled={loading} className="delete-button">
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