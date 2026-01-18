const ModalePhoto = ({ photoSelezionato, setPhotoSelezionato }) => {
  const src =
    photoSelezionato.url ||
    (photoSelezionato.filename ? `/team-photos/${photoSelezionato.filename}` : '/placeholder.png');

  return (
    <div className="modal">
      <div className="modal-content modal-photo-scroll">
        <div key={photoSelezionato.id} className="photo-item">
          <img
            src={src}
            alt={photoSelezionato.filename || `photo ${photoSelezionato.id}`}
            loading="lazy"
            crossOrigin="anonymous"
            className="photoSelezionato"
            onError={(e) => {
              e.target.src = "/placeholder.png";
              e.target.style.opacity = "0.6";
              e.target.title = "Immagine non trovata";
            }}
          />
        </div>
        <button type="button" onClick={() => setPhotoSelezionato(null)}>❌ Chiudi</button>
      </div>
    </div>
  );
}

export default ModalePhoto;