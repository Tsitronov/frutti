const RicercaUtenteForm = ({cognomeRicerca, setCognomeRicerca, cognomiUnici, utenti, setUtenteTrovato, setMostraModalInfo}) => {
    return(
      <div className="forma-ricerca">
        <input
          type="text"
          list="cognomi-lista"
          placeholder="Поиск по фамилии"
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
        disabled={!cognomeRicerca.trim()} 
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
          </svg>
        </button>
        </div>
      );
};
export default RicercaUtenteForm;