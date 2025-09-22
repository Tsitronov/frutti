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
  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error);
  const currentPage = useSelector((state) => state.utenti.currentPage);

  const [lista, setLista] = useState([]);
  const [repartoSelezionato, setRepartoSelezionato] = useState(null);
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
  const [campoFiltro, setCampoFiltro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ campo: "", valore: "", cognomi: [] });
  const [cognomeRicerca, setCognomeRicerca] = useState("");
  const [utenteTrovato, setUtenteTrovato] = useState(null);
  const [mostraModalInfo, setMostraModalInfo] = useState(false);
  const [utentiVisibili, setUtentiVisibili] = useState([]);
  const [scrollStates, setScrollStates] = useState({});

  const testoRefs = useRef({});

  // ======================= LOAD DATA =======================
  useEffect(() => {
    dispatch(caricaUtentiLocalStorage()); // prima locale
    dispatch(fetchUtenti()).then(data => setLista(data));
  }, [dispatch]);

  // ======================= FILTRI =======================
  const utentiDelReparto = repartoSelezionato
    ? utenti.filter(u => u.reparto === repartoSelezionato)
    : utenti;

  const reparti = Array.isArray(utenti)
    ? [...new Set(utenti.map(u => u.reparto))].sort()
    : [];

  const valoriUnici = (campo) =>
    [...new Set(utentiDelReparto.map(u => u[campo]).filter(Boolean))];

  const cognomiUnici = [...new Set(utenti.map(u => u.cognome))].sort();

  // ======================= FORM =======================
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleUtentiForm = () => {
    const utentiForm = document.querySelector('.utentiForm');
    if (utentiForm) utentiForm.classList.toggle('utentiFormDisplayNone');
  };

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

  // ======================= MODAL =======================
  const apriModalFiltri = (campo, valore) => {
    const cognomi = utentiDelReparto
      .filter(u => u[campo] === valore)
      .map(u => u.cognome);

    setModalData({ campo, valore, cognomi });
    setShowModal(true);
  };

  const apriFinestraFiltro = (campo) => {
    const risultati = utentiDelReparto
      .filter(u => u[campo])
      .map(u => ({ cognome: u.cognome, valore: u[campo] }));

    setModalData({ campo, risultati });
    setShowModal(true);
  };

  const chiudiModal = () => {
    setShowModal(false);
    setCampoFiltro(null);
  };

  // ======================= COLORS =======================
  const getColorClass = (valore) => {
    if (!valore) return "";
    const v = valore.toLowerCase();
    if (v.includes("d") || v.includes("s")) return "rosso";
    if (v.includes("m")) return "verde";
    return "blue";
  };

  // ======================= REPARTO SELECTION =======================
  useEffect(() => {
    if (utenti.length > 0) {
      const ultimoReparto = localStorage.getItem("ultimoReparto");
      const repartiUnici = [...new Set(utenti.map(u => u.reparto))].sort();
      setRepartoSelezionato(
        ultimoReparto && repartiUnici.includes(ultimoReparto)
          ? ultimoReparto
          : repartiUnici[0]
      );
    }
  }, [utenti]);

  // ======================= PAGINATION =======================
  const itemsPerPage = 4;

  const utentiFiltrati = Array.isArray(utentiDelReparto)
    ? [...utentiDelReparto].sort((a, b) => Number(a.stanza) - Number(b.stanza))
    : [];

  useEffect(() => {
    const filtrati = Array.isArray(utentiDelReparto)
      ? [...utentiDelReparto].sort((a, b) => Number(a.stanza) - Number(b.stanza))
      : [];

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;

    setUtentiVisibili(filtrati.slice(indexOfFirst, indexOfLast));
  }, [utentiDelReparto, currentPage]);

  const cambiaPagina = (numero) => dispatch(setCurrentPage(numero));

  // ======================= SCROLL =======================
  const isLungo = (testo) => testo && testo.length > 7;

  const scrollToTop = (id) => {
    const div = testoRefs.current[id];
    if (div) div.scrollTop = 0;
  };

  const handleScroll = (id) => {
    const el = testoRefs.current[id];
    if (el) {
      setScrollStates(prev => ({ ...prev, [id]: el.scrollTop > 20 }));
    }
  };

  // ======================= RENDER =======================
  return (
    <div className="container">
      <Navbar />
      <div className="sidebar">
        <RicercaUtenteForm 
          cognomeRicerca={cognomeRicerca}
          setCognomeRicerca={setCognomeRicerca}
          cognomiUnici={cognomiUnici}
          utenti={utenti} 
          setUtenteTrovato={se
