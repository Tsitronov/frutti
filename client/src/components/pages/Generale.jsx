import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useContext } from 'react';
import { AuthContext } from '../../context';

import {
  fetchFrutti,
  aggiungiFrutto,
  eliminaFrutto,
  modificaFrutto,
  setCurrentPage
} from "../../redux/fruttiSlice";

import Navbar from '../UI/navbar/Navbar';
import Pagination from "../UI/pagination/Pagination.jsx";
import ModaleGenerale from "../UI/modal/ModaleGenerale";
import GeneraleForm from "../UI/forms/GeneraleForm";

const Generale = () => {
  const { isAuth, categoria } = useContext(AuthContext);
  const dispatch = useDispatch();
  const frutti = useSelector(state => state.frutti.lista) || [];
  const currentPage = useSelector((state) => state.frutti.currentPage);

  useEffect(() => {
    dispatch(fetchFrutti());
  }, [dispatch]);

  const isLoading = useSelector((state) => state.frutti.isLoading);
  const error = useSelector((state) => state.frutti.error);

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


  const categorieUniche = useMemo(() => {
    return [...new Set(frutti.map(f => f.categoria))];
  }, [frutti]);


  const fruttiFiltrati = useMemo(() => {
    return categoriaSelezionata
      ? frutti.filter(f => f.categoria === categoriaSelezionata)
      : frutti;
  }, [frutti, categoriaSelezionata]);


  const fruttiVisibili = useMemo(() => {
    const lista = categoriaSelezionata
      ? frutti.filter(f => f.categoria === categoriaSelezionata)
      : frutti;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return lista.slice(indexOfFirst, indexOfLast);
  }, [frutti, categoriaSelezionata, currentPage, itemsPerPage]);


  const handleAggiungiFrutto = useCallback(() => {
    if (form.nome && form.descrizione && form.categoria) {
      dispatch(aggiungiFrutto({
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
      toggleFruttiForm();
    }
  }, [form, dispatch]);

  const handleModifica = useCallback((item) => {
    setForm({
      id: item.id,
      nome: item.nome || "",
      descrizione: item.descrizione || "",
      categoria: item.categoria || ""
    });
    toggleFruttiForm();
  }, []);

  const handleSalva = useCallback(() => {
    if (form.nome && form.descrizione && form.categoria && form.id !== null) {
      dispatch(modificaFrutto({
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
      toggleFruttiForm();
    }
  }, [form, dispatch]);

  const toggleFruttiForm = () => {
    const fruttiForm = document.querySelector('.generaleForm');
    fruttiForm.classList.toggle('fruttiFormDisplayNone');
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

      <div className="sidebar-appunti">
        {isAuth && Number(categoria) >= 2 &&
          <div className="toggleLink" onClick={toggleFruttiForm}>Aggiungi 🙂</div>
        }
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

          <GeneraleForm
            form={form}
            setForm={setForm}
            categorieUniche={categorieUniche}
            handleSalva={handleSalva}
            handleAggiungiFrutto={handleAggiungiFrutto}
            toggleFruttiForm={toggleFruttiForm}
            isLoading = {isLoading}
          />

          <div className="article-list">
            {fruttiVisibili.map(item => (
              <div key={item.id} className="article-item-wrapper">
                <div className="article-item">
                  <div className="item-info">
                    <p> {item.categoria}</p>  <p> {item.nome}</p> 
                  </div>
                  <div className="item-lungo-container">
                    <p
                      ref={(el) => (testoRefs.current[item.id] = el)}
                      onScroll={() => handleScroll(item.id)}
                      className={isLungo(item.descrizione) ? 'testo-lungo testo-lungo-generale' : 'testo-normale testo-normale-generale'}
                    >
                      {item.descrizione
                      .split('.')
                      .filter(r => r.trim() !== '')
                      .map((riga, index) => (
                        <span key={index}>
                          {riga.trim()}.<br />
                        </span>
                      ))}
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

                  {isAuth && Number(categoria) >= 2 &&
                    <div className="actions">
                      <button type="button" className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                      <button type="button" className="btn-azione btn-delete" onClick={() => window.confirm("Sei sicuro di voler eliminare?") && dispatch(eliminaFrutto(item.id))}>❌</button>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>

          <Pagination
            totalItems={fruttiFiltrati.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />
        </div>
      </div>

      {categoriaSelezionata && (
        <ModaleGenerale
          categoriaSelezionata={categoriaSelezionata}
          setCategoriaSelezionata={setCategoriaSelezionata}
          fruttiFiltrati={fruttiFiltrati}
        />
      )}
    </div>
  );
};

export default Generale;