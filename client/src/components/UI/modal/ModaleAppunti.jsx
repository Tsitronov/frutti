const ModaleAppunti = ({categoriaSelezionata, setCategoriaSelezionata, appuntiFiltrati}) => {
    return(
        <div className="modal">
        <div className="modal-content">
          <h2 className="verde">{categoriaSelezionata}</h2>
            {appuntiFiltrati.map(f => (
              <ul key={f.id} >
                <li className="blue">
                  {f.nome}
                </li><br />
                  
                <li>
                  {f.descrizione
                    .split('.')
                    .filter(r => r.trim() !== '')
                    .map((riga, index) => (
                      <span key={index}>
                        {riga.trim()}.<br /><br />
                      </span>
                    ))}
                </li>
              </ul>

            ))}
          
          <button type="button" onClick={() => setCategoriaSelezionata(null)}>❌ Chiudi </button>
        </div>
    </div>
    );
}
export default ModaleAppunti;