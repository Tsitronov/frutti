const ModaleGenerale = ({categoriaSelezionata, setCategoriaSelezionata, fruttiFiltrati}) => {
	return(
		<div className="modal">
        <div className="modal-content">
          <h2 className="verde">Categoria: {categoriaSelezionata}</h2>
            {fruttiFiltrati.map(f => (
              <ul>
                <li key={f.id}>
                  <p className="blue">{f.nome}</p> 
                  
                </li>
                  
                <li>
                  <pre> {f.descrizione} </pre>
                </li>
              </ul>

            ))}
          
          <button type="button" onClick={() => setCategoriaSelezionata(null)}>❌ Chiudi</button>
        </div>
    </div>
    );
}
export default ModaleGenerale;