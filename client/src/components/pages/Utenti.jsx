import { useSelector, useDispatch } from "react-redux";
import {
  fetchUtenti,
  aggiungiUtente,
  eliminaUtente,
  modificaUtente,
  setCurrentPage,
  caricaUtentiLocalStorage
} from "../../redux/utentiSlice";
import { useState, useEffect, useRef } from "react";

import Navbar from "../UI/navbar/Navbar";
import Pagination from "../UI/pagination/Pagination";
import ModalUtenteCercato from "../UI/modal/ModalUtenteCercato";
import ModalUtente from "../UI/modal/ModalUtente";

const Utenti = () => {
  const dispatch = useDispatch();
  const utenti = useSelector((state) => state.utenti.lista);
  const [lista, setLista] = useState([]);
  useEffect(() => {
    dispatch(caricaUtentiLocalStorage()); // 👈 Prima mostra i vecchi
    dispatch(fetchUtenti()).then(data => setLista(data));
  }, [dispatch]);
  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error);

  const currentPage = useSelector((state) => state.utenti.currentPage);

  const reparti = [...new Set(utenti.map((u) => u.reparto))].sort();

  const [repartoSelezionato, setRepartoSelezionato] = useState(null);
  const utentiDelReparto = repartoSelezionato
    ? utenti.filter((u) => u.reparto === repartoSelezionato)
    : utenti;

  const valoriUnici = (campo) =>
    [...new Set(utentiDelReparto.map((u) => u[campo]).filter(Boolean))];

  const [form, setForm] = useState({
    reparto: "",
    stanza: "",
    cognome: "",
    bagno: "",
    barba: "",
    autonomia: "",
    malattia: "",
    alimentazione: "",
    dentiera: "",
    altro: "",
  });

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

  const resetForm = () => {
    setForm({
      reparto: "",
      stanza: "",
      cognome: "",
      bagno: "",
      barba: "",
      autonomia: "",
      malattia: "",
      alimentazione: "",
      dentiera: "",
      altro: "",
    });
    setModificaId(null);
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
    if (v.includes("disfagia")) return "rosso";
    if (v.includes("morbido")) return "verde";
    if (v.includes("mattina")) return "verde";
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

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('sidebarDisplayNone');
  };


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
  const isLungo = (testo) => testo && testo.length > 300;

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
      <div className="sidebar">
        <div className="categories">
          {repartoSelezionato && (
            <div>
              <h4> reparto {repartoSelezionato}</h4>
              {["bagno", "barba", "alimentazione", "dentiera", "autonomia", "malattia"].map((campo) => (
                <div key={campo}>
                  <a href="#" onClick={(e) => { e.preventDefault(); apriFinestraFiltro(campo); }} style={{ textTransform: "capitalize" }}>{campo}</a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="forma-ricerca">
          <input
            type="text"
            list="cognomi-lista"
            placeholder="Cerca per cognome"
            value={cognomeRicerca}
            onChange={(e) => setCognomeRicerca(e.target.value)}
            style={{ margin: "10px", padding: "5px", width: "80%" }}
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
      </div>

      <div className="main-content">
        <Navbar />

        <div id="poloski" title="visible Menu" onClick={toggleSidebar}>categorie</div>

        <h2>👥 Utenti</h2>
        
      {isLoading && (
        <p style={{ color: "orange" }}>
          ⏳ Caricamento dati dal server... (ora vedi dati locali)
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          ⚠️ Errore: {error}
        </p>
      )}

        <ul>
          {reparti.map((reparto, i) => (
            <li key={i}>
              <a href="#" onClick={() => {
                setRepartoSelezionato(reparto);
                localStorage.setItem("ultimoReparto", reparto);
              }} style={{ fontWeight: reparto === repartoSelezionato ? "bold" : "normal" }}>{reparto}</a>
            </li>
          ))}
        </ul>

        {["reparto", "stanza", "cognome", "bagno", "barba", "autonomia", "malattia", "alimentazione", "dentiera", "altro"].map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo}
            value={form[campo]}
            onChange={handleChange}
          />
        ))}

        {modificaId ? (
          <>
            <button type="button" onClick={handleSalva}>💾 Cambia</button>
            <button type="button" onClick={handleAggiungi}>➕ Inserisci</button>
            <button type="button" onClick={resetForm}>❌ Annulla</button>
          </>
        ) : (
          <button type="button" onClick={handleAggiungi}>➕ Aggiungi</button>
        )}

        <div className="article-list">
          {utentiVisibili.map((item) => (
            <div className="article-item" key={item.id} style={{ cursor: "pointer" }}>
              <div className="item-info">
                <strong> stanza - {item.stanza}</strong>
                <strong className="blue"> – {item.cognome} </strong>
                <div className={getColorClass(item.alimentazione)}>{item.alimentazione}</div>
                <div>{item.autonomia}</div>
                <div>{item.malattia}</div>
                <div>{item.dentiera}</div>
                <div><strong>Bagno:</strong> {item.bagno}</div>
                <div><strong>Barba:</strong> {item.barba}</div>
              </div>
              <div className="item-lungo-container">
                <div ref={(el) => testoRefs.current[item.id] = el}
                  onScroll={() => handleScroll(item.id)}
                  className={isLungo(item.altro) ? 'testo-lungo' : ''}>
                  {item.altro}
                </div>
                {isLungo(item.altro) && scrollStates[item.id] && (
                  <button className="freccia-scroll" onClick={() => scrollToTop(item.id)}>↑</button>
                )}
              </div>
              <div className="actions">
                <button type="button" className="btn-azione btn-update" onClick={(e) => { e.stopPropagation(); handleModifica(item); }}>✏️</button>
                <button type="button" className="btn-azione btn-delete" onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Sicuro che delete?")) {
                    dispatch(eliminaUtente(item.id));
                  }
                }}>❌</button>
              </div>
            </div>
          ))}
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
