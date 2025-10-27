const ModalUtenteCercato = ({ utenteTrovato, getColorClass, setMostraModalInfo }) => {
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>🧾 Info utente</h3>
        {utenteTrovato ? (
          <ul>
            <li key="reparto"><strong>Reparto:</strong> {utenteTrovato.reparto}</li>
            <li key="stanza"><strong>Stanza:</strong> {utenteTrovato.stanza}</li>
            <li key="cognome" className="blue">{utenteTrovato.cognome}</li>
            <li key="bagno" className="verde"><strong>bagno:</strong> {utenteTrovato.bagno}</li>
            <li key="barba" className="verde"><strong>Barba:</strong> {utenteTrovato.barba}</li>
            <li key="autonomia"><strong>Autonomia:</strong> {utenteTrovato.autonomia}</li>
            <li key="vestiti"><strong>vestiti:</strong> {utenteTrovato.vestiti}</li>
            <li key="alimentazione">
              <strong className={getColorClass(utenteTrovato.alimentazione) || ''}>Alimentazione:</strong> {utenteTrovato.alimentazione} {/* 🔥 ФИКС: Передал аргумент + fallback */}
            </li>
            <li key="accessori"><strong>accessori:</strong> {utenteTrovato.accessori}</li>
            <li key="altro"><strong>Altro:</strong> {utenteTrovato.altro}</li>
          </ul>
        ) : (
          <p>⚠️ Utente non trovato.</p>
        )}
        <button type="button" onClick={() => setMostraModalInfo(false)}>❌ Chiudi</button>
      </div>
    </div>
  );
};
export default ModalUtenteCercato;