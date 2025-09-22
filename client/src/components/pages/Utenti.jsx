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

  const utentiRedux = useSelector((state) => state.utenti.lista) || [];
  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error);
  const currentPage = useSelector((state) => state.utenti.currentPage);

  const [utentiVisibili, setUtentiVisibili] = useState([]);
  const [repartoSelezionato, setRepartoSelezionato] = useState(null);
  const [form, setForm] = useState({
    reparto: "", stanza: "", cognome: "", bagno: "", barba: "",
    autonomia: "", vestiti: "", alimentazione: "", accessori: "", altro: ""
  });
  const [modificaId, setModificaId] = useState(null);
  const [scrollStates, setScrollStates] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ campo: "", valore: "", cognomi: [] });
  const [cognomeRicerca, setCognomeRicerca] = useState("");
  const [utenteTrovato, setUtenteTrovato] = useState(null);
  const [mostraModalInfo, setMostraModalInfo] = useState(false);

  const testoRefs = useRef({});
  const itemsPerPage = 4;

  // ------------------ FETCH / LOCALSTORAGE ------------------
  useEffect(() => {
    dispatch(caricaUtentiLocalStorage());
    dispatch(fetchUtenti());
  }, [dispatch]);

  // ------------------ REPARTO SELEZIONATO ------------------
  const reparti = Array.isArray(utentiRedux)
    ? [...new Set(utentiRedux.map(u => u.reparto))].sort()
    : [];

  useEffect(() => {
    if (utentiRedux.length > 0) {
      const ultimoReparto = localStorage.getItem("ultimoReparto");
      if (ultimoReparto && reparti.includes(ultimoReparto)) {
        setRepartoSelezionato(ultimoReparto);
      } else {
        setRepartoSelezionato(reparti[0] || null);
      }
    }
  }, [utentiRedux, reparti]);

  const utentiDelReparto = repartoSelezionato
    ? utentiRedux.filter(u => u.reparto === repartoSelezionato)
    : utentiRedux;

  const utentiFiltrati = Array.isArray(utentiDelReparto)
    ? utentiDelReparto.sort((a, b) => Number(a.stanza) - Number(b.stanza))
    : [];

  const cognomiUnici = Array.isArray(utentiRedux)
    ? [...new Set(utentiRedux.map(u => u.cognome))].sort()
    : [];

  // ------------------ UTENTI VISIBILI PAGINAZIONE ------------------
  useEffect(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    setUtentiVisibili(utentiFiltrati.slice(indexOfFirst, indexOfLast));
  }, [utentiFiltrati, currentPage]);

  const cambiaPagin
