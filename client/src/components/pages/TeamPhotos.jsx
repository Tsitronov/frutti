import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotos } from '../../redux/photosSlice';
import Navbar from "../UI/navbar/Navbar";

const TeamPhotos = () => {
  const dispatch = useDispatch();
  const { photos = [], loading, error } = useSelector((state) => state.photos);

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  if (loading) return <div>Загрузка фото...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="container">
      <Navbar />

      <div className="main-content">
        <div className="content">
          <h2>Командные фото</h2>
          <p>Всего: {photos.length}/5</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ margin: '10px', textAlign: 'center' }}>
                <img 
                  src={photo.url}  // 👉 Используем Cloudinary URL (photo.path)
                  alt={photo.filename || `Фото ${photo.id}`} 
                  loading="lazy" 
                  sizes="(max-width: 300px) 100vw, 50vw"
                  width="300"
                  height="200"
                  style={{ borderRadius: '8px'}}
                  crossOrigin="anonymous"  // 👉 Для CORS
                  onError={(e) => { 
                    e.target.style.display = 'none'; 
                    console.error('Ошибка загрузки фото:', e.target.src);  // 👉 Лог в консоль
                  }}
                />
                <p>{photo.filename}</p>
              </div>
            ))}
          </div>

          {photos.length === 0 && (
            <p>Фото пока нет. Добавьте их в панели админа (<b>/admin</b>).</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPhotos;