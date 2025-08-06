const RicercaUtenteForm = ({cognomeRicerca, setCognomeRicerca, cognomiUnici, utenti, setUtenteTrovato, setMostraModalInfo}) => {
    return(
      <div className="forma-ricerca">
        <input
          type="text"
          list="cognomi-lista"
          placeholder="Cerca per cognome"
          value={cognomeRicerca}
          onChange={(e) => setCognomeRicerca(e.target.value)}
        />

        <datalist id="cognomi-lista">
          {cognomiUnici.map((cognome, index) => (
            <option key={index} value={cognome} />
          ))}
        </datalist>

        <button type="button" onClick={() => {
          const trovato = utenti.find((u) => u.cognome.toLowerCase() === cognomeRicerca.toLowerCase());
          setUtenteTrovato(trovato || null);
          setMostraModalInfo(true);
        }}>ℹ️ Info</button>
      </div>
      );
}
export default RicercaUtenteForm;