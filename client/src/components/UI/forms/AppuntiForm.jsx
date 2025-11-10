const AppuntiForm = ({form, setForm, categorieUniche, handleSalva, handleAggiungiAppunto, toggleAppuntiForm, isLoading}) => {
    return(
    <div className="appuntiForm appuntiFormDisplayNone">
          <div className="modal">
        <div className="modal-content">
              <input
            value={form.nome || ""}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="nome"
          />
          <input
            list="suggestions"
            value={form.categoria || ""}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            placeholder="categoria"
          />
          <datalist id="suggestions">
            {categorieUniche.map((cat, i) => (
              <option key={i} value={cat} />
            ))}
          </datalist>

          <textarea
            value={form.descrizione || ""}
            onChange={(e) => {setForm({ ...form, descrizione: e.target.value })}}
            placeholder="descrizione"
          ></textarea>


        {form.id !== null ? (
          <>
            <button type="button" onClick={handleSalva} disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : '💾 Modifica'} 
            </button>
            <button type="button" className="btn-elimina" onClick={toggleAppuntiForm} disabled={isLoading}>
              ❌ Annulla
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleAggiungiAppunto} disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : '➕ Aggiungi'}
            </button>
            <button type="button" className="btn-elimina" onClick={toggleAppuntiForm} disabled={isLoading}>
              ❌ Annulla
            </button>
          </>
        )}
        </div>
      </div>
    </div>
    );
}
export default AppuntiForm;