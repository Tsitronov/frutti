const GeneraleForm = ({form, setForm, categorieUniche, handleSalva, handleAggiungiFrutto, toggleFruttiForm, isLoading }) => {
    return(
    <div className="generaleForm">
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
          >
          </textarea>


        {form.id !== null ? (
          <>
            <button type="button" onClick={handleSalva} disabled={isLoading} >
             {isLoading ? <span className="spinner"></span> : '💾 Update'}
            </button>
            <button type="button" className="btn-elimina" onClick={toggleFruttiForm} disabled={isLoading} >
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleAggiungiFrutto} disabled={isLoading} >
              {isLoading ? <span className="spinner"></span> : '➕ Add'}
            </button>
            <button type="button" className="btn-elimina" onClick={toggleFruttiForm} disabled={isLoading} >
              ❌ Cancel
            </button>
          </>
        )}
        </div>
      </div>
    </div>
    );
}
export default GeneraleForm;