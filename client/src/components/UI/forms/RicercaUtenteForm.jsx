const RicercaUtenteForm = ({cognomeRicerca, setCognomeRicerca, cognomiUnici, utenti, setUtenteTrovato, setMostraModalInfo}) => {
    return(
      <div className="forma-ricerca">
        <input
          type="text"
          list="cognomi-lista"
          placeholder="Cerca per nome"
          value={cognomeRicerca}
          onChange={(e) => setCognomeRicerca(e.target.value)}
        />

        <datalist id="cognomi-lista">
          {cognomiUnici.map((cognome, index) => (
            <option key={index} value={cognome} />
          ))}
        </datalist>

        <button type="button" onClick={() => {
          const normalize = (str) =>
            str
              ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
              : "";

          const trovato = utenti.find(
            (u) => normalize(u.cognome) === normalize(cognomeRicerca)
          );
          setUtenteTrovato(trovato || null);
          setMostraModalInfo(true);
          setCognomeRicerca("");
        }}
        disabled={!cognomeRicerca.trim()}>
        🔎
        </button>
        </div>
      );
};
export default RicercaUtenteForm;