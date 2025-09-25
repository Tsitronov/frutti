import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import {
  fetchAppunti,
  aggiungiAppunto,
  eliminaAppunto,
  modificaAppunto,
  setCurrentPage,
  caricaAppuntiLocalStorage
} from "../../redux/appuntiSlice";

import Navbar from '../UI/navbar/Navbar';
import Pagination from "../UI/pagination/Pagination.jsx";
import ModaleAppunti from "../UI/modal/ModaleAppunti";
import AppuntiForm from "../UI/forms/AppuntiForm";

const Appunti = () => {
  const dispatch = useDispatch();
  const appunti = useSelector(state => state.appunti.lista) || [];
  const currentPage = useSelector((state) => state.appunti.currentPage);

  useEffect(() => {
    dispatch(caricaAppuntiLocalStorage()); // Prima i dati locali
    dispatch(fetchAppunti());
  }, [dispatch]);

  const isLoading = useSelector((state) => state.appunti.isLoading);
  const error = useSelector((state) => state.appunti.error);

  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    descrizione: "",
    categoria: ""
  });
  const [scrollStates, setScrollStates] = useState({});
  const testoRefs = useRef({});

  const itemsPerPage = 4;

  // 📌 Ottimizzazione: categorieUniche
  const categorieUniche = useMemo(() => {
    return [...new Set(appunti.map(f => f.categoria))];
  }, [appunti]);

  // 📌 Ottimizzazione: appuntiFiltrati
  const appuntiFiltrati = useMemo(() => {
    return categoriaSelezionata
      ? appunti.filter(f => f.categoria === categoriaSelezionata)
      : appunti;
  }, [appunti, categoriaSelezionata]);

  // 📌 Ottimizzazione: appuntiVisibili
  const appuntiVisibili = useMemo(() => {
    const lista = categoriaSelezionata
      ? appunti.filter(f => f.categoria === categoriaSelezionata)
      : appunti;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return lista.slice(indexOfFirst, indexOfLast);
  }, [appunti, categoriaSelezionata, currentPage, itemsPerPage]);

  // 📌 Ottimizzazione: funzioni per AppuntiForm
  const handleAggiungiAppunto = useCallback(() => {
    if (form.descrizione) {
      dispatch(aggiungiAppunto({
        nome: form.nome || "appunto",
        descrizione: form.descrizione,
        categoria: form.categoria || "oss"
      }));
      setForm({
        id: null,
        nome: "",
        descrizione: "",
        categoria: ""
      });
      toggleAppuntiForm();
    }
  }, [form, dispatch]);

  const handleModifica = useCallback((item) => {
    setForm({
      id: item.id,
      nome: item.nome || "",
      descrizione: item.descrizione || "",
      categoria: item.categoria || ""
    });
    toggleAppuntiForm();
  }, []);

  const handleSalva = useCallback(() => {
    if (form.nome && form.descrizione && form.categoria && form.id !== null) {
      dispatch(modificaAppunto({
        id: form.id,
        nome: form.nome,
        descrizione: form.descrizione,
        categoria: form.categoria
      }));
      setForm({
        id: null,
        nome: "",
        descrizione: "",
        categoria: ""
      });
      toggleAppuntiForm();
    }
  }, [form, dispatch]);

  const toggleAppuntiForm = () => {
    const appuntiForm = document.querySelector('.appuntiForm');
    appuntiForm.classList.toggle('appuntiFormDisplayNone');
  };

  const cambiaPagina = (numero) => {
    dispatch(setCurrentPage(numero));
  };

  const isLungo = (testo) => testo && testo.length > 300;

  const scrollToTop = (id) => {
    const div = testoRefs.current[id];
    if (div) div.scrollTop = 0;
  };

  const handleScroll = (id) => {
    const el = testoRefs.current[id];
    if (el) setScrollStates((prev) => ({ ...prev, [id]: el.scrollTop > 20 }));
  };

  return (
    <div className="container">
      <Navbar />

      <div className="sidebar">
        <div className="categories">
          {categorieUniche.map((cat, index) => (
            <div key={index}>
              <a onClick={() => setCategoriaSelezionata(cat)}>
                {cat}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="content">
          <div className="carico-dati-container">
            {isLoading && <div className="loading-spinner"></div>}
            {error && <span className="carico-dati">{error}</span>}
          </div>

          {localStorage.getItem('userCategoria') !== '1' &&
            <div className="toggleLink" onClick={toggleAppuntiForm}>Add new &nbsp;&nbsp;<p>+</p></div>
          }

          <AppuntiForm
            form={form}
            setForm={setForm}
            categorieUniche={categorieUniche}
            handleSalva={handleSalva}
            handleAggiungiAppunto={handleAggiungiAppunto}
            toggleAppuntiForm={toggleAppuntiForm}
          />

          <div className="article-list">
            {appuntiVisibili.map(item => (
              <div key={item.id} className="article-item-wrapper">
                <div className="article-item">
                  <div className="item-info" style={{ fontWeight: "bold" }}>
                    {item.categoria} - {item.nome}
                  </div>
                  <div className="item-lungo-container">
                    <p
                      ref={(el) => (testoRefs.current[item.id] = el)}
                      onScroll={() => handleScroll(item.id)}
                      className={isLungo(item.descrizione) ? 'testo-lungo' : ''}
                    >
                      {item.descrizione}
                    </p>

                    {isLungo(item.descrizione) && scrollStates[item.id] && (
                      <button
                        className="freccia-scroll"
                        onClick={() => scrollToTop(item.id)}
                      >
                        ↑
                      </button>
                    )}
                  </div>

                  {localStorage.getItem('userCategoria') !== '1' &&
                    <div className="actions">
                      <button type="button" className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                      <button type="button" className="btn-azione btn-delete" onClick={() => window.confirm("Sicuro che delete?") && dispatch(eliminaAppunto(item.id))}>❌</button>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>

          <Pagination
            totalItems={appuntiFiltrati.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />
        </div>
      </div>

      {categoriaSelezionata && (
        <ModaleAppunti
          categoriaSelezionata={categoriaSelezionata}
          setCategoriaSelezionata={setCategoriaSelezionata}
          appuntiFiltrati={appuntiFiltrati}
        />
      )}
    </div>
  );
};

export default Appunti;