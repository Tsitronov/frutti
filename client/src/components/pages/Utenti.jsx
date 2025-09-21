import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";

import {
  fetchUtenti,
  aggiungiUtente,
  eliminaUtente,
  modificaUtente,
  setCurrentPage,
  caricaUtentiLocalStorage
} from "../../redux/utentiSlice";

import Navbar from "../UI/navbar/Navbar";
import Pagination from "../UI/pagination/Pagination";
import ModalUtenteCercato from "../UI/modal/ModalUtenteCercato";
import ModalUtente from "../UI/modal/ModalUtente";

import RicercaUtenteForm from "../UI/forms/RicercaUtenteForm";

const Utenti = () => {
  const dispatch = useDispatch();

  const utenti = useSelector((state) => state.utenti.lista) || [];
  const [lista, setLista] = useState([]);

  useEffect(() => {
    dispatch(caricaUtentiLocalStorage()); // 👈 Prima mostra i vecchi
    dispatch(fetchUtenti()).then(data => setLista(data));
  }, [dispatch]);
  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error);


  const currentPage = useSelector((state) => state.utenti.currentPage);

  const reparti = Array.isArray(utenti)
    ? [...new Set(utenti.map((u) => u.reparto))].sort()
    : [];

  const [repartoSelezionato, setRepartoSelezionato] = useState(null);
  const utentiDelReparto = repartoSelezionato
    ? utenti.filter((u) => u.reparto === repartoSelezionato)
    : utenti;

  const valoriUnici = (campo) =>
    [...new Set(utentiDelReparto.map((u) => u[campo]).filter(Boolean))];


  const toggleUtentiForm = () => {
    const utentiForm = document.querySelector('.utentiForm');
    utentiForm.classList.toggle('utentiFormDisplayNone');
  };


  const [form, setForm] = useState({
    reparto: "",
    stanza: "",
    cognome: "",
    bagno: "",
    barba: "",
    autonomia: "",
    vestiti: "",
    alimentazione: "",
    accessori: "",
    altro: "",
  });

  const resetForm = () => {
  setForm({
    reparto: "",
    stanza: "",
    cognome: "",
    bagno: "",
    barba: "",
    autonomia: "",
    vestiti: "",
    alimentazione: "",
    accessori: "",
    altro: "",
  });
  setModificaId(null);
  toggleUtentiForm();
};


  const [modificaId, setModificaId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAggiungi = () => {
    if (form.stanza && form.cognome) {
      const nuovoUtente = { ...form, id: crypto.randomUUID() };
      dispatch(aggiungiUtente(nuovoUtente));
      resetForm();
    }
  };

  const handleModifica = (utente) => {
    setForm(structuredClone(utente));
    setModificaId(utente.id);
  };

  const handleSalva = () => {
    if (modificaId) {
      dispatch(modificaUtente({ ...form, id: modificaId }));
      resetForm();
    }
  };


  const [campoFiltro, setCampoFiltro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ campo: "", valore: "", cognomi: [] });

  const apriModalFiltri = (campo, valore) => {
    const cognomi = utentiDelReparto
      .filter((u) => u[campo] === valore)
      .map((u) => u.cognome);

    setModalData({ campo, valore, cognomi });
    setShowModal(true);
  };

  const [cognomeRicerca, setCognomeRicerca] = useState("");
  const [utenteTrovato, setUtenteTrovato] = useState(null);
  const [mostraModalInfo, setMostraModalInfo] = useState(false);

  const apriFinestraFiltro = (campo) => {
    const risultati = utentiDelReparto
      .filter((u) => u[campo])
      .map((u) => ({
        cognome: u.cognome,
        valore: u[campo],
      }));

    setModalData({ campo, risultati });
    setShowModal(true);
  };

  const getColorClass = (valore) => {
    if (!valore) return "";
    const v = valore.toLowerCase();
    if (v.includes("d")) return "rosso";
    if (v.includes("s")) return "rosso";
    if (v.includes("m")) return "verde";
    return "blue";
  };

  const chiudiModal = () => {
    setShowModal(false);
    setCampoFiltro(null);
  };

  useEffect(() => {
    if (utenti.length > 0) {
      const repartiUnici = [...new Set(utenti.map((u) => u.reparto))].sort();
      const ultimoReparto = localStorage.getItem("ultimoReparto");
      if (ultimoReparto && repartiUnici.includes(ultimoReparto)) {
        setRepartoSelezionato(ultimoReparto);
      } else {
        setRepartoSelezionato(repartiUnici[0]);
      }
    }
  }, [utenti]);


  const itemsPerPage = 4;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const utentiFiltrati = repartoSelezionato
    ? utenti.filter((u) => u.reparto === repartoSelezionato).sort((a, b) => Number(a.stanza) - Number(b.stanza))
    : utenti;

  const cognomiUnici = [...new Set(utenti.map((u) => u.cognome))].sort();

  const [utentiVisibili, setUtentiVisibili] = useState([]);

  useEffect(() => {
    const filtrati = repartoSelezionato
      ? utenti.filter((u) => u.reparto === repartoSelezionato).sort((a, b) => Number(a.stanza) - Number(b.stanza))
      : utenti;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    setUtentiVisibili(filtrati.slice(indexOfFirst, indexOfLast));
  }, [utenti, currentPage, repartoSelezionato]);


  const cambiaPagina = (numero) => {
    dispatch(setCurrentPage(numero));
  };

  const testoRefs = useRef({});
  const isLungo = (testo) => testo && testo.length > 7;

  const scrollToTop = (id) => {
    const div = testoRefs.current[id];
    if (div) {
      div.scrollTop = 0;
    }
  };

  const [scrollStates, setScrollStates] = useState({});
  const handleScroll = (id) => {
    const el = testoRefs.current[id];
    if (el) {
      const isScrolled = el.scrollTop > 20;
      setScrollStates((prev) => ({ ...prev, [id]: isScrolled }));
    }
  };


  return (
    <div className="container">
      
      <Navbar />

      <div className="sidebar">

        <RicercaUtenteForm 
          cognomeRicerca={cognomeRicerca}
          setCognomeRicerca={setCognomeRicerca}
          cognomiUnici={cognomiUnici}
          utenti={utenti} 
          setUtenteTrovato={setUtenteTrovato}
          setMostraModalInfo={setMostraModalInfo}
        />
        <div className="categories">
          {repartoSelezionato && (
            <>
              <h4> reparto {repartoSelezionato}</h4>
              {["bagno", "barba", "alimentazione", "accessori", "autonomia", "vestiti"].map((campo) => (
                <div key={campo}>
                  <a href="#" onClick={(e) => { e.preventDefault(); apriFinestraFiltro(campo); }} style={{ textTransform: "capitalize" }}>{campo}</a>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="content">
        {isLoading && <span className = "carico-dati"> ⏳ Carico dati... locale se offline </span>}
        {error && <span className = "carico-dati">{error}</span>}

          <div className="reparti">
            <ul className="repartoNome"> Reparti - 
              {reparti.map((reparto, i) => (
                <li key={i}>
                  <a href="#" onClick={() => {
                    setRepartoSelezionato(reparto);
                    localStorage.setItem("ultimoReparto", reparto);
                  }} style={{ color: reparto === repartoSelezionato ? "#0606ff" : "#777", fontWeight: reparto === repartoSelezionato ? "700" : "300" }}>{reparto}</a>
                </li>
              ))}
            </ul>

          { localStorage.getItem('userCategoria') !== '1' &&
            <div className="toggleLink" onClick={toggleUtentiForm}>Add new &nbsp;&nbsp;<p>+</p></div>
          }

          </div>

          <div className="utentiForm utentiFormDisplayNone">
            <div className="modal">
              <div className="modal-content">
              {["reparto", "stanza", "cognome", "bagno", "barba", "autonomia", "vestiti", "alimentazione", "accessori"].map((campo) => (
                <input
                  key={campo}
                  name={campo}
                  placeholder={campo === "cognome" ? "nome" : campo}
                  value={form[campo]}
                  onChange={handleChange}
                />
              ))}
                <textarea
                  name="altro"
                  placeholder="altro"
                  value={form.altro}
                  onChange={handleChange}
                  rows={4}
                />
              {modificaId ? (
                <>
                  <button type="button" className="btn-modifica" onClick={handleSalva}>💾 Cambia</button>
                  <button type="button" className="btn-salva" onClick={handleAggiungi}>➕ Inserisci</button>
                  <button type="button" className="btn-elimina" onClick={resetForm}>❌ Annulla</button>
                </>
              ) : (
                <>
                  <button type="button" className="btn-salva" onClick={handleAggiungi}>➕ Aggiungi</button>
                  <button type="button" className="btn-elimina" onClick={resetForm}>❌ Annulla</button>
                </>
              )}
              </div>
            </div>
          </div>


          <div className="article-list">
            {utentiVisibili.map((item) => (
              <div  key={item.id} className="article-item-wrapper item-lungo-container">

                <div className="article-item item-info" style={{ cursor: "pointer" }}>
                  <div  ref={(el) => testoRefs.current[item.id] = el}
                      onScroll={() => handleScroll(item.id)}
                      className={isLungo(item.altro) ? 'testo-lungo' : ''}>
                 
                    <div className="item-title">
                      <strong> stanza - {item.stanza}</strong>
                      <strong className="blue"> – {item.cognome} </strong>
                    </div>
                    <div className="item-info">
                      <div> <strong> alimentazione: </strong>  
                        <strong className={getColorClass(item.alimentazione)}> {item.alimentazione} </strong>
                      </div>
                      <div> <strong> autonomia:</strong> 
                        <strong className={getColorClass(item.autonomia)}> {item.autonomia} </strong>
                      </div>
                      <div><strong> bagno: </strong> {item.bagno} </div>
                      <div><strong> barba: </strong> {item.barba} </div>
                      <div><strong> vestiti: </strong> {item.vestiti} </div>
                      <div><strong> accessori: </strong> {item.accessori} </div>
                      <div> <strong> altro: </strong> {item.altro} </div>
                    </div>
                  </div>


                    {isLungo(item.altro) && scrollStates[item.id] && (
                      <button className="freccia-scroll" onClick={() => scrollToTop(item.id)}>↑</button>
                    )}

                { localStorage.getItem('userCategoria') !== '1' &&
                  <div className="actions">
                    <button type="button" className="btn-azione btn-update" onClick={(e) => { e.stopPropagation(); handleModifica(item); toggleUtentiForm()}}>✏️</button>
                    <button type="button" className="btn-azione btn-delete" onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Sicuro che delete?")) {
                        dispatch(eliminaUtente(item.id));
                      }
                    }}>❌</button>
                  </div>
                }

                </div>

              </div>
            ))}
          </div>

        </div>
          <Pagination
            totalItems={utentiFiltrati.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />
      </div>

      {showModal && (
        <ModalUtente 
          modalData={modalData}
          getColorClass={getColorClass}
          setShowModal={setShowModal} 
        />
      )}

      {mostraModalInfo && (
        <ModalUtenteCercato 
          utenteTrovato={utenteTrovato} 
          getColorClass={getColorClass(utenteTrovato.alimentazione)}
          setMostraModalInfo = {setMostraModalInfo}
        />
      )}
    </div>
  );
};

export default Utenti;
