const ModalUtente = ({ modalData, getColorClass, categoryLabels, setShowModal }) => {
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3><em>{modalData.label || categoryLabels[modalData.campo] || modalData.campo}</em></h3>
        <ul>
          {modalData.risultati.map((item, i) => (
            <li key={i}>
              {item.cognome} — <strong className={getColorClass(item.valore) || ''}>{item.valore}</strong>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setShowModal(false)}>Закрыть</button>
      </div>
    </div>
  );
};
export default ModalUtente;