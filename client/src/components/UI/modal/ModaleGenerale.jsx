const ModaleGenerale = ({categoriaSelezionata, setCategoriaSelezionata, fruttiFiltrati}) => {
	return(
		<div className="modal">
        <div className="modal-content">
          <h2 className="verde">{categoriaSelezionata}</h2>
            {fruttiFiltrati.map(f => (
              <ul key={f.id} >
                <li className="blue">
                  {f.nome}
                </li>
                  
                <li>
                  {f.descrizione}
                </li>
              </ul>

            ))}
          
          <button type="button" onClick={() => setCategoriaSelezionata(null)}>❌ Закрыть</button>
        </div>
    </div>
    );
}
export default ModaleGenerale;