import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotos } from '../../redux/photosSlice';
import Navbar from "../UI/navbar/Navbar";
import PhotoUploader from './PhotoUploader';

const TeamPhotos = () => {
  const dispatch = useDispatch();
  const { photos = [], loading, error } = useSelector((state) => state.photos);

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  // Функция для исправления кириллицы
  function fixFilename(str) {
    if (!str) return "";
    try {
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str; // если не удаётся декодировать — возвращаем как есть
    }
  }


  return (
    <div className="container">
      <Navbar />
      {loading && <div className="loading-spinner"></div>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="main-content">
        <div className="content">

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {photos.map((photo) => {
              const filename = fixFilename(photo.filename);
              return (
                <div key={photo.id} style={{ margin: '10px', textAlign: 'center' }}>
                  <img 
                    src={photo.url}
                    alt={filename || `Фото ${photo.id}`}
                    loading="lazy"
                    sizes="(max-width: 600px) 100vw, 50vw"
                    width="400"
                    height="auto"
                    style={{ borderRadius: '8px', objectFit: 'contain' }}
                    crossOrigin="anonymous"
                    onError={(e) => { 
                      e.target.style.display = 'none'; 
                      console.error('Ошибка загрузки фото:', e.target.src);
                    }}
                  />
                  <p>{filename}</p>
              </div>
              );
            })}
          </div>
          {(!loading && photos.length === 0) && (
            <p>Фото пока нет. Добавьте их в панели админа (<b>/admin</b>).</p>
          )}

          {Number(localStorage.getItem('userCategoria')) > 1 && (
            <PhotoUploader />
          )}

        </div>
      </div>
    </div>
  );
};

export default TeamPhotos;