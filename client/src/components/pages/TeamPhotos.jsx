import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotos } from '../../redux/photosSlice';
import Navbar from "../UI/navbar/Navbar";
import PhotoUploader from './PhotoUploader';
import { useContext } from 'react';
import { AuthContext } from '../../context';

const TeamPhotos = () => {
  const { isAuth, categoria } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { photos = [], loading, error } = useSelector((state) => state.photos);

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  function fixFilename(str) {
    if (!str) return "";
    try {
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str;
    }
  }


return (
  <div className="photo-gallery-container">
    <Navbar />
    {loading && <div className="loading-spinner"></div>}
    {error && <p className="error-message">{error}</p>}

    <div className="photo-gallery-main">
      <div className="photo-gallery-content">

        <div className="photo-grid">
          {photos.map((photo, index) => {
            const filename = fixFilename(photo.filename);
            const src = photo.url || (photo.filename ? `/team-photos/${photo.filename}` : '/placeholder.png');
            return (
              <div key={photo.id || index} className="photo-item">
                <img 
                  src={src}
                  alt={filename || `photo ${photo.id || index}`}
                  loading="lazy"
                  sizes="(max-width: 600px) 100vw, 50vw"
                  width="400"
                  crossOrigin="anonymous"
                  className="photo-image"
                  onError={(e) => { 
                    e.target.src = "/placeholder.png";
                    e.target.style.opacity = "0.6";
                    e.target.title = "Immagine non trovata";
                  }}
                />
                <p className="photo-filename">{filename}</p>
              </div>
            );
          })}
        </div>
        {(!loading && photos.length === 0) && (
          <p className="empty-state"> Al momento non ci sono foto. </p>
        )}

        {isAuth && categoria !== 1 && (
          <PhotoUploader />
        )}

      </div>
    </div>
  </div>
);
};

export default TeamPhotos;