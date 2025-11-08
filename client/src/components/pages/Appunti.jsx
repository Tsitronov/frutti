import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useContext } from 'react';
import { AuthContext } from '../../context';

import {
  fetchAppunti,
  aggiungiAppunto,
  eliminaAppunto,
  modificaAppunto,
  setCurrentPage
} from "../../redux/appuntiSlice";

import Navbar from '../UI/navbar/Navbar';
import Pagination from "../UI/pagination/Pagination.jsx";
import ModaleAppunti from "../UI/modal/ModaleAppunti";
import AppuntiForm from "../UI/forms/AppuntiForm";

const Appunti = () => {
  const { isAuth, categoria } = useContext(AuthContext);
  const dispatch = useDispatch();
  const appunti = useSelector(state => state.appunti.lista) || [];
  const currentPage = useSelector((state) => state.appunti.currentPage);

  useEffect(() => {
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

  const itemsPerPage = 7;


  const categorieUniche = useMemo(() => {
    return [...new Set(appunti.map(f => f.categoria))];
  }, [appunti]);


  const appuntiFiltrati = useMemo(() => {
    return categoriaSelezionata
      ? appunti.filter(f => f.categoria === categoriaSelezionata)
      : appunti;
  }, [appunti, categoriaSelezionata]);


  const appuntiVisibili = useMemo(() => {
    const lista = categoriaSelezionata
      ? appunti.filter(f => f.categoria === categoriaSelezionata)
      : appunti;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return lista.slice(indexOfFirst, indexOfLast);
  }, [appunti, categoriaSelezionata, currentPage, itemsPerPage]);


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

      <div className="sidebar-appunti">

      {isAuth && categoria !== '1' &&
        <div className="toggleLink" onClick={toggleAppuntiForm}> Добавить 🙂 </div>
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

          <AppuntiForm
            form={form}
            setForm={setForm}
            categorieUniche={categorieUniche}
            handleSalva={handleSalva}
            handleAggiungiAppunto={handleAggiungiAppunto}
            toggleAppuntiForm={toggleAppuntiForm}
            isLoading = {isLoading}
          />

          <div className="article-list-appunti">
            {appuntiVisibili.map(item => (
              <div key={item.id} className="article-wrapper-appunti">
                <div className="article-item-appunti">
                  <div className="item-info" style={{ fontWeight: "bold" }}>
                    <p> {item.nome} <small> ({item.categoria})</small></p>
                  </div>
                  <div className="item-lungo-container">
                    <p
                      ref={(el) => (testoRefs.current[item.id] = el)}
                      onScroll={() => handleScroll(item.id)}
                      className={isLungo(item.descrizione) ? 'testo-lungo-appunti' : 'testo-lungo-normale'}
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

                  {isAuth && categoria !== '1' &&
                    <div className="actions">
                      <button type="button" className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                      <button type="button" className="btn-azione btn-delete" onClick={() => window.confirm("Вы уверены, что хотите удалить?") && dispatch(eliminaAppunto(item.id))}>❌</button>
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