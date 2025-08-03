const ModaleGenerale = ({categoriaSelezionata, setCategoriaSelezionata, fruttiFiltrati}) => {
	return(
		<div className="modal">
            <div className="modal-content">
              <h3>Categoria: {categoriaSelezionata}</h3>
              <ul>
                {fruttiFiltrati.map(f => (
                  <li key={f.id}>{f.nome} - {f.descrizione}</li>
                ))}
              </ul>
              <button type="button" type="button" onClick={() => setCategoriaSelezionata(null)}>❌ Chiudi</button>
            </div>
          </div>
          );
}
export default ModaleGenerale;