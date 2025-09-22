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

  // берём данные из Redux
  const utentiRedux = useSelector((state) => state.utenti.lista) || [];
  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error);
  const currentPage = useSelector((state) => state.utenti.currentPage);

  // локальный state для формы и видимых элементов
  const [lista, setLista] = useState([]);
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
  const [modificaId, setModificaId] = useState(null);
  const [repartoSelezionato, setRepartoSelezionato] = useState(null);
  const [utentiVisibili, setUtentiVisibili] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ campo: "", valore: "", cognomi: [] });
  const [cognomeRicerca, setCognomeRicerca] = useState("");
  const [utenteTrovato, setUtenteTrovato] = useState(null);
  const [mostraModalInfo, setMostraModalInfo] = useState(false);
  const [scrollStates, setScrollStates] = useState({});

  const testoRefs = useRef({});

  // Загружаем данные сначала из localStorage, потом с сервера
  useEffect(() => {
    dispatch(caricaUtentiLocalStorage()); // сначала локальные
    dispatch(fetchUtenti())
      .then((action) => {
        const data = action.payload;
        if (Array.isArray(data)) setLista(data);
      })
      .catch(() => {
        // если fetch не удался, оставляем локальные данные
        setLista(Array.isArray(utentiRedux) ? utentiRedux : []);
      });
  }, [dispatch, utentiRedux]);

  // Если utentiRedux изменился, используем его как основной источник
  const utenti = Array.isArray(utentiRedux) ? utentiRedux : [];

  // Reparti disponibili
  const reparti = Array.isArray(utenti) ? [...new Set(utenti.map(u => u.reparto))].sort() : [];

  // Utenti filtrati per reparto selezionato
  const utentiFiltrati = repartoSelezionato
    ? utenti.filter(u => u.reparto === repartoSelezionato).sort((a,b)=>Number(a.stanza)-Number(b.stanza))
    : utenti;

  // Aggiornamento utenti visibili per pagina
  const itemsPerPage = 4;
  useEffect(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    setUtentiVisibili(utentiFiltrati.slice(indexOfFirst, indexOfLast));
  }, [utentiFiltrati, currentPage]);

  // Imposta reparto selezionato iniziale
  useEffect(() => {
    if (utenti.length > 0) {
      const ultimoReparto = localStorage.getItem("ultimoReparto");
      const repartiUnici = [...new Set(utenti.map(u => u.reparto))].sort();
      setRepartoSelezionato(ultimoReparto && repartiUnici.includes(ultimoReparto) ? ultimoReparto : repartiUnici[0]);
    }
  }, [utenti]);

  // Funzioni form
  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  const toggleUtentiForm = () => document.querySelector(".utentiForm")?.classList.toggle("utentiFormDisplayNone");
  const resetForm = () => { 
    setForm({
      reparto: "", stanza: "", cognome: "", bagno: "", barba: "",
      autonomia: "", vestiti: "", alimentazione: "", accessori: "", altro: ""
    });
    setModificaId(null);
    toggleUtentiForm();
  };

  const handleAggiungi = () => {
    if (form.stanza && form.cognome) {
      dispatch(aggiungiUtente({...form, id: crypto.randomUUID()}));
      resetForm();
    }
  };

  const handleModifica = (utente) => { setForm(structuredClone(utente)); setModificaId(utente.id); };
  const handleSalva = () => { if (modificaId) { dispatch(modificaUtente({...form, id: modificaId})); resetForm(); } };

  const cambiaPagina = (numero) => dispatch(setCurrentPage(numero));

  const apriFinestraFiltro = (campo) => {
    const risultati = utentiFiltrati.filter(u => u[campo]).map(u => ({cognome: u.cognome, valore: u[campo]}));
    setModalData({campo, risultati});
    setShowModal(true);
  };

  const getColorClass = (valore) => {
    if (!valore) return "";
    const v = valore.toLowerCase();
    if (v.includes("d") || v.includes("s")) return "rosso";
    if (v.includes("m")) return "verde";
    return "blue";
  };

  const isLungo = (testo) => testo && testo.length > 7;
  const scrollToTop = (id) => { const el = testoRefs.current[id]; if (el) el.scrollTop = 0; };
  const handleScroll = (id) => { const el = testoRefs.current[id]; if (el) setScrollStates(prev => ({...prev, [id]: el.scrollTop>20})); };

  const cognomiUnici = [...new Set(utenti.map(u => u.cognome))].sort();

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
      </div>

      <div className="main-content">
        <div className="content">
          {isLoading && <span className="carico-dati">⏳ Carico dati... locale se offline</span>}
          {error && <span className="carico-dati">{error}</span>}

          <div className="article-list">
            {utentiVisibili.map(item => (
              <div key={item.id} className="article-item-wrapper item-lungo-container">
                <div className="article-item item-info" style={{cursor:"pointer"}}>
                  <div ref={el => testoRefs.current[item.id]=el} onScroll={()=>handleScroll(item.id)} className={isLungo(item.altro)?"testo-lungo":""}>
                    <div className="item-title">
                      <strong>stanza - {item.stanza}</strong>
                      <strong className="blue"> – {item.cognome} </strong>
                    </div>
                    <div className="item-info">
                      <div><strong>alimentazione:</strong> <strong className={getColorClass(item.alimentazione)}> {item.alimentazione} </strong></div>
                      <div><strong>autonomia:</strong> <strong className={getColorClass(item.autonomia)}> {item.autonomia} </strong></div>
                      <div><strong>bagno:</strong> {item.bagno}</div>
                      <div><strong>barba:</strong> {item.barba}</div>
                      <div><strong>vestiti:</strong> {item.vestiti}</div>
                      <div><strong>accessori:</strong> {item.accessori}</div>
                      <div><strong>altro:</strong> {item.altro}</div>
                    </div>
                  </div>

                  {isLungo(item.altro) && scrollStates[item.id] && <button className="freccia-scroll" onClick={()=>scrollToTop(item.id)}>↑</button>}
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
      </div>

      {showModal && <ModalUtente modalData={modalData} getColorClass={getColorClass} setShowModal={setShowModal}/>}
      {mostraModalInfo && <ModalUtenteCercato utenteTrovato={utenteTrovato} getColorClass={getColorClass(utenteTrovato?.alimentazione)} setMostraModalInfo={setMostraModalInfo}/>}
    </div>
  );
};

export default Utenti;
