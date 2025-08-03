const ModalUtenteCercato = ({utenteTrovato, getColorClass, setMostraModalInfo}) =>{
	return(
		<div className="modal">
          <div className="modal-content">
            <h3>🧾 Info utente</h3>
            {utenteTrovato ? (
              <ul>
                <li><strong>Reparto:</strong> {utenteTrovato.reparto}</li>
                <li><strong>Stanza:</strong> {utenteTrovato.stanza}</li>
                <li className="blue"> {utenteTrovato.cognome}</li>
                <li className="verde"><strong>bagno:</strong> {utenteTrovato.bagno}</li>
                <li className="verde"><strong>Barba:</strong> {utenteTrovato.barba}</li>
                <li><strong>Autonomia:</strong> {utenteTrovato.autonomia}</li>
                <li><strong>malattia:</strong> {utenteTrovato.malattia}</li>
                <li><strong className={getColorClass}> Alimentazione: </strong> {utenteTrovato.alimentazione}</li>
                <li><strong>Dentiera:</strong> {utenteTrovato.dentiera}</li>
                <li><strong>Altro:</strong> {utenteTrovato.altro}</li>
              </ul>
            ) : (
              <p>⚠️ Utente non trovato.</p>
            )}
            <button type="button" onClick={() => setMostraModalInfo(false)}>❌ Chiudi</button>
          </div>
        </div>
		);
}
export default ModalUtenteCercato;