import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import { useContext } from 'react';
import { AuthContext } from '../../context';

import {
  fetchArticoli,
  aggiungiArticolo,
  eliminaArticolo,
  modificaArticolo,
  setCurrentPage
} from "../../redux/articoliSlice";

import Navbar from '../UI/navbar/Navbar';
import Pagination from "../UI/pagination/Pagination.jsx";
import ModaleArticoli from "../UI/modal/ModaleArticoli";
import ArticoliForm from "../UI/forms/ArticoliForm";

const Articoli = () => {
  const { isAuth, categoria } = useContext(AuthContext);
  const dispatch = useDispatch();
  const articoli = useSelector(state => state.articoli.lista) || [];
  const currentPage = useSelector((state) => state.articoli.currentPage);

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  const isLoading = useSelector((state) => state.articoli.isLoading);
  const error = useSelector((state) => state.articoli.error);

  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    descrizione: "",
    categoria: ""
  });
  const [scrollStates, setScrollStates] = useState({});
  const testoRefs = useRef({});

  const itemsPerPage = 1;

  // 📌 Ottimizzazione: categorieUniche
  const categorieUniche = useMemo(() => {
    return [...new Set(articoli.map(f => f.categoria))];
  }, [articoli]);

  // 📌 Ottimizzazione: articoliFiltrati
  const articoliFiltrati = useMemo(() => {
    return categoriaSelezionata
      ? articoli.filter(f => f.categoria === categoriaSelezionata)
      : articoli;
  }, [articoli, categoriaSelezionata]);

  // 📌 Ottimizzazione: articoliVisibili
  const articoliVisibili = useMemo(() => {
    const lista = categoriaSelezionata
      ? articoli.filter(f => f.categoria === categoriaSelezionata)
      : articoli;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return lista.slice(indexOfFirst, indexOfLast);
  }, [articoli, categoriaSelezionata, currentPage, itemsPerPage]);

  // 📌 Ottimizzazione: funzioni per ArticoliForm
  const handleAggiungiArticolo = useCallback(() => {
    if (form.descrizione) {
      dispatch(aggiungiArticolo({
        nome: form.nome || "articolo",
        descrizione: form.descrizione,
        categoria: form.categoria || "oss"
      }));
      setForm({
        id: null,
        nome: "",
        descrizione: "",
        categoria: ""
      });
      toggleArticoliForm();
    }
  }, [form, dispatch]);

  const handleModifica = useCallback((item) => {
    setForm({
      id: item.id,
      nome: item.nome || "",
      descrizione: item.descrizione || "",
      categoria: item.categoria || ""
    });
    toggleArticoliForm();
  }, []);

  const handleSalva = useCallback(() => {
    if (form.nome && form.descrizione && form.categoria && form.id !== null) {
      dispatch(modificaArticolo({
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
      toggleArticoliForm();
    }
  }, [form, dispatch]);

  const toggleArticoliForm = () => {
    const articoliForm = document.querySelector('.articoliForm');
    articoliForm.classList.toggle('articoliFormDisplayNone');
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

      <div className="sidebar-articoli">

      {isAuth && Number(categoria) >= 2 &&
        <div className="toggleLink" onClick={toggleArticoliForm}>Aggiungi 🙂</div>
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

      <div className="main-content" style={{paddingTop:"6rem"}}>
        <div className="content">
          <div className="carico-dati-container">
            {error && <span className="carico-dati">{error}</span>}
          </div>

          <ArticoliForm
            form={form}
            setForm={setForm}
            categorieUniche={categorieUniche}
            handleSalva={handleSalva}
            handleAggiungiArticolo={handleAggiungiArticolo}
            toggleArticoliForm={toggleArticoliForm}
            isLoading = {isLoading}
          />

          <div className="article-list-articoli">
            {articoliVisibili.map(item => (
              <div key={item.id} className="article-wrapper-articoli">
                <div className="article-item-articoli">
                  <div className="item-info" style={{ fontWeight: "bold" }}>
                    <p> {item.nome} <small> ({item.categoria})</small></p>
                  </div>
                  <div className="item-lungo-container">
                    <p
                      ref={(el) => (testoRefs.current[item.id] = el)}
                      onScroll={() => handleScroll(item.id)}
                      className={isLungo(item.descrizione) ? 'testo-lungo-articoli' : 'testo-lungo-normale'}
                      style={{whiteSpace: 'pre-line'}}
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

                  {isAuth && Number(categoria) >= 2 &&
                    <div className="actions">
                      <button type="button" className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                      <button type="button" className="btn-azione btn-delete" onClick={() => window.confirm("Sicuro che delete?") && dispatch(eliminaArticolo(item.id))}>❌</button>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>

          <Pagination
            totalItems={articoliFiltrati.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />
        </div>
      </div>

      {categoriaSelezionata && (
        <ModaleArticoli
          categoriaSelezionata={categoriaSelezionata}
          setCategoriaSelezionata={setCategoriaSelezionata}
          articoliFiltrati={articoliFiltrati}
        />
      )}
    </div>
  );
};

export default Articoli;