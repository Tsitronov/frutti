const ModalUtenteCercato = ({ utenteTrovato, getColorClass, categoryLabels, setMostraModalInfo }) => {
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>🧾 Информация о пользователе</h3>
        {utenteTrovato ? (
          <ul>
            <li key="reparto"><strong>{categoryLabels.reparto}:</strong> {utenteTrovato.reparto}</li>
            <li key="stanza"><strong>{categoryLabels.stanza}:</strong> {utenteTrovato.stanza}</li>
            <li key="cognome" className="blue">{utenteTrovato.cognome}</li>
            <li key="bagno" className="verde"><strong>{categoryLabels.bagno}:</strong> {utenteTrovato.bagno}</li>
            <li key="barba" className="verde"><strong>{categoryLabels.barba}:</strong> {utenteTrovato.barba}</li>
            <li key="autonomia"><strong>{categoryLabels.autonomia}:</strong> {utenteTrovato.autonomia}</li>
            <li key="vestiti"><strong>{categoryLabels.vestiti}:</strong> {utenteTrovato.vestiti}</li>
            <li key="alimentazione">
              <strong className={getColorClass(utenteTrovato.alimentazione) || ''}>{categoryLabels.alimentazione}:</strong> {utenteTrovato.alimentazione}
            </li>
            <li key="accessori"><strong>{categoryLabels.accessori}:</strong> {utenteTrovato.accessori}</li>
            <li key="altro"><strong>{categoryLabels.altro}:</strong> {utenteTrovato.altro}</li>
          </ul>
        ) : (
          <p>⚠️ Пользователь не найден.</p>
        )}
        <button type="button" onClick={() => setMostraModalInfo(false)}>❌ Закрыть</button>
      </div>
    </div>
  );
};
export default ModalUtenteCercato;