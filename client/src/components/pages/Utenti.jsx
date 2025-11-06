import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import {
  fetchUtenti,
  aggiungiUtente,
  eliminaUtente,
  modificaUtente,
  setCurrentPage
} from "../../redux/utentiSlice";

import Navbar from "../UI/navbar/Navbar";
import Pagination from "../UI/pagination/Pagination";
import ModalUtenteCercato from "../UI/modal/ModalUtenteCercato";
import ModalUtente from "../UI/modal/ModalUtente";
import RicercaUtenteForm from "../UI/forms/RicercaUtenteForm";
import SidebarCategories from "../UI/sidebar/SidebarCategories"; // Assuming path

const Utenti = () => {
  const dispatch = useDispatch();
  const utenti = useSelector((state) => state.utenti.lista) || [];
  const [lista, setLista] = useState([]);

  const isLoading = useSelector((state) => state.utenti.isLoading);
  const error = useSelector((state) => state.utenti.error);
  const currentPage = useSelector((state) => state.utenti.currentPage);

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
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ campo: "", valore: "", cognomi: [] });
  const [cognomeRicerca, setCognomeRicerca] = useState("");
  const [utenteTrovato, setUtenteTrovato] = useState(null);
  const [mostraModalInfo, setMostraModalInfo] = useState(false);
  const [scrollStates, setScrollStates] = useState({});
  const testoRefs = useRef({});


  const itemsPerPage = 4;

  // Маппинг для русских названий категорий (для отображения)
  const categoryLabels = useMemo(() => ({
    reparto: 'Отдел',
    stanza: 'Комната',
    cognome: 'Фамилия',
    bagno: 'Ванна',
    barba: 'Борода',
    autonomia: 'Автономия',
    vestiti: 'Одежда',
    alimentazione: 'Питание',
    accessori: 'Аксессуары',
    altro: 'Другое',
  }), []);

  // 📥 Carica utenti
  useEffect(() => {
    dispatch(fetchUtenti()).then(data => setLista(data));
  }, [dispatch]);

  // ✅ Aggiorna reparto selezionato
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


  // 📌 Ottimizzazione: reparti
  const reparti = useMemo(() => {
    return Array.isArray(utenti)
      ? [...new Set(utenti.map((u) => u.reparto))].sort()
      : [];
  }, [utenti]);

  // 📌 Ottimizzazione: cognomiUnici
  const cognomiUnici = useMemo(() => {
    return [...new Set(utenti.map((u) => u.cognome))].sort();
  }, [utenti]);

  // 📌 Ottimizzazione: utentiDelReparto
  const utentiDelReparto = useMemo(() => {
    return repartoSelezionato
      ? utenti.filter((u) => u.reparto === repartoSelezionato)
      : utenti;
  }, [utenti, repartoSelezionato]);

  // 📌 Ottimizzazione: utentiVisibili
  const utentiVisibili = useMemo(() => {
    const filtrati = repartoSelezionato
      ? utenti
          .filter((u) => u.reparto === repartoSelezionato)
          .sort((a, b) => Number(a.stanza) - Number(b.stanza))
      : utenti;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filtrati.slice(indexOfFirst, indexOfLast);
  }, [utenti, repartoSelezionato, currentPage, itemsPerPage]);

  // 📌 Ottimizzazione: getColorClass
  const getColorClass = useCallback((valore) => {
    if (!valore) return "";
    const v = valore.toLowerCase();
    if (v.includes("d") || v.includes("s")) return "rosso";
    if (v.includes("m")) return "verde";
    return "blue";
  }, []);

  const toggleUtentiForm = () => {
    const utentiForm = document.querySelector('.utentiForm');
    utentiForm.classList.toggle('utentiFormDisplayNone');
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
    toggleUtentiForm();
  };

  const handleSalva = () => {
    if (modificaId) {
      dispatch(modificaUtente({ ...form, id: modificaId }));
      resetForm();
    }
  };

  const apriFinestraFiltro = (campo) => {
    const label = categoryLabels[campo] || campo; // Используем русский лейбл
    const risultati = utentiDelReparto
      .filter((u) => u[campo])
      .map((u) => ({ cognome: u.cognome, valore: u[campo] }));
    setModalData({ campo, label, risultati }); // Передаем label для модала
    setShowModal(true);
  };

  const scrollToTop = (id) => {
    const div = testoRefs.current[id];
    if (div) div.scrollTop = 0;
  };

  const handleScroll = (id) => {
    const el = testoRefs.current[id];
    if (el) setScrollStates(prev => ({ ...prev, [id]: el.scrollTop > 20 }));
  };

  const cambiaPagina = (numero) => {
    dispatch(setCurrentPage(numero));
  };


  return (
    <div className="container">
      <Navbar />

      <div className="main-content" style={{paddingTop:"3rem"}}>
        <div className="content">

          <div className="carico-dati-container">
            {error && <span className="carico-dati">{error}</span>}
          </div>

          <div className={"sidebar"}>
            <RicercaUtenteForm
              cognomeRicerca={cognomeRicerca}
              setCognomeRicerca={setCognomeRicerca}
              cognomiUnici={cognomiUnici}
              utenti={utenti}
              setUtenteTrovato={setUtenteTrovato}
              setMostraModalInfo={setMostraModalInfo}
            />

            <div className="sidebar-reparti"> Отдел 
              <ul className="repartoNome reparti-list">
                {reparti.map((reparto, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setRepartoSelezionato(reparto);
                        localStorage.setItem("ultimoReparto", reparto);
                      }}
                      style={{ 
                        color: reparto === repartoSelezionato ? "#0606ff" : "#777", 
                      }}
                    >
                      {reparto}
                    </a>
                  </li>
                ))}
              </ul>

              {localStorage.getItem('categoria') !== '1' &&
                <div className="toggleLink" onClick={toggleUtentiForm}> Добавить 🙂 </div>
              }
            </div>


            <SidebarCategories
              repartoSelezionato={repartoSelezionato}
              categories={["bagno", "barba", "alimentazione", "accessori", "autonomia", "vestiti"]}
              categoryLabels={categoryLabels} // Передаем маппинг лейблов
              apriFinestraFiltro={apriFinestraFiltro}
            />

          </div>

          <div className="utentiForm utentiFormDisplayNone">
            <div className="modal">
              <div className="modal-content">
                {["reparto", "stanza", "cognome", "bagno", "barba", "autonomia", "vestiti", "alimentazione", "accessori"].map((campo) => (
                  <input
                    key={campo}
                    name={campo}
                    placeholder={categoryLabels[campo] || campo}
                    value={form[campo]}
                    onChange={handleChange}
                  />
                ))}
                <textarea
                  name="altro"
                  placeholder={categoryLabels.altro}
                  value={form.altro}
                  onChange={handleChange}
                  rows={4}
                />
                {modificaId ? (
                  <>
                    <button
                      type="button"
                      className="btn-salva"
                      onClick={handleSalva}
                      disabled={isLoading}
                    >
                      {isLoading ? <span className="spinner"></span> : '💾 Сохранить'}
                    </button>
                    <button
                      type="button"
                      className="btn-elimina"
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      ❌ Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-salva"
                      onClick={handleAggiungi}
                      disabled={isLoading}
                    >
                      {isLoading ? <span className="spinner"></span> : '➕ Добавить'}
                    </button>
                    <button
                      type="button"
                      className="btn-elimina"
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      ❌ Отмена
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="article-list">
            {utentiVisibili.map((item) => {
              // Расширенное условие: скролл если altro >7 ИЛИ суммарная длина >60 (адаптировано для лучшей активации)
              const haLungoContenuto = (item.altro?.length || 0) > 7 || 
                Object.values({ alimentazione: item.alimentazione, autonomia: item.autonomia, bagno: item.bagno, barba: item.barba, vestiti: item.vestiti, accessori: item.accessori })
                  .reduce((sum, val) => sum + (val?.length || 0), 0) > 10;

              return (
                <div key={item.id} className="article-item-wrapper">
                  <div className="article-item item-info" style={{ cursor: "pointer" }}>
                    <div
                      ref={(el) => testoRefs.current[item.id] = el}
                      onScroll={() => handleScroll(item.id)}
                      className={haLungoContenuto ? 'testo-lungo' : 'testo-normale'}
                    >
                      <div className="item-info">
                        <div key="stanza"> {item.stanza} </div>
                        <div key="cognome"> <strong> {item.cognome} </strong>  </div>
                        <div key="alimentazione" title={categoryLabels.alimentazione} className={getColorClass(item.alimentazione)}><strong> 🍽️ </strong> {item.alimentazione} </div>
                        <div key="autonomia" title={categoryLabels.autonomia} className={getColorClass(item.autonomia)}><strong> 🦽 </strong> {item.autonomia} </div>
                        <div key="bagno" title={categoryLabels.bagno}><strong> 🚿 </strong> {item.bagno}</div>
                        <div key="barba" title={categoryLabels.barba}><strong> 🪒 </strong> {item.barba}</div>
                        <div key="vestiti" title={categoryLabels.vestiti}><strong> 👕 </strong> {item.vestiti}</div>
                        <div key="accessori" title={categoryLabels.accessori}><strong> 🕶 </strong> {item.accessori}</div>
                        <div key="altro" title={categoryLabels.altro}><strong> ℹ️ </strong> {item.altro}</div> 
                      </div>
                    </div>
                    {haLungoContenuto && scrollStates[item.id] && (
                      <button 
                        className="freccia-scroll" 
                        onClick={(e) => { e.stopPropagation(); scrollToTop(item.id); }}
                      >
                        ↑
                      </button>
                    )}

                    {localStorage.getItem('categoria') !== '1' && (
                      <div className="actions" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                        <button 
                          type="button" 
                          className="btn-azione btn-delete" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (window.confirm("Вы уверены, что хотите удалить?")) {
                              dispatch(eliminaUtente(item.id));
                            }
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            totalItems={utentiDelReparto.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />
          
        </div>
      </div>

      {showModal && (
        <ModalUtente
          modalData={modalData}
          getColorClass={getColorClass}
          categoryLabels={categoryLabels} // Передаем маппинг для модала
          setShowModal={setShowModal}
        />
      )}

      {mostraModalInfo && utenteTrovato && (
        <ModalUtenteCercato
          utenteTrovato={utenteTrovato}
          getColorClass={getColorClass}
          categoryLabels={categoryLabels} // Передаем для модала
          setMostraModalInfo={setMostraModalInfo}
        />
      )}
    </div>
  );
};

export default Utenti;