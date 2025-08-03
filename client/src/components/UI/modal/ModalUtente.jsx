const ModalUtente = ({modalData, getColorClass, setShowModal}) => {
  return(
    <div className="modal">
      <div className="modal-content">
        <h3><em>{modalData.campo}</em></h3>
        <ul>
          {modalData.risultati.map((item, i) => (
            <li key={i}>
              {item.cognome} — <strong className={getColorClass(item.valore)}>{item.valore}</strong>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setShowModal(false)}>Chiudi</button>
      </div>
    </div>
    );
}
export default ModalUtente;    
