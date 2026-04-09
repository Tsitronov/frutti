const ArticoliForm = ({form, setForm, categorieUniche, handleSalva, handleAggiungiArticolo, toggleArticoliForm, isLoading}) => {
	return(
    <div className="articoliForm">
		  <div className="modal">
        <div className="modal-content">
          <input
            value={form.nome || ""}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Name"
          />
          <input
            list="suggestions"
            value={form.categoria || ""}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            placeholder="Category"
          />
          <datalist id="suggestions">
            {categorieUniche.map((cat, i) => (
              <option key={i} value={cat} />
            ))}
          </datalist>

          <textarea
            value={form.descrizione || ""}
            onChange={(e) => {setForm({ ...form, descrizione: e.target.value })}}
            placeholder="Description"
          ></textarea>


        {form.id !== null ? (
          <>
            <button type="button" onClick={handleSalva} disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : '💾 Salva'}
            </button>
            <button type="button" className="btn-elimina" onClick={toggleArticoliForm} disabled={isLoading}>
              ❌ Annulla
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleAggiungiArticolo} disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : '➕ Aggiungi'}
            </button>
            <button type="button" className="btn-elimina" onClick={toggleArticoliForm} disabled={isLoading}>
              ❌ Annulla
            </button>
          </>
        )}
        </div>
      </div>
    </div>
	);
}
export default ArticoliForm;