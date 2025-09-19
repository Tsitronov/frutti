import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";

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
  const appunti = useSelector(state => state.appunti.lista);
  const currentPage = useSelector((state) => state.appunti.currentPage);

  useEffect(() => {
    dispatch(caricaAppuntiLocalStorage()); // 👈 Prima mostra i vecchi
    dispatch(fetchAppunti()).then(appunti);
  }, [dispatch]);

  const isLoading = useSelector((state) => state.appunti.isLoading);
  const error = useSelector((state) => state.appunti.error);

  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [categoria, setCategoria] = useState("");


  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);


  // Prendi solo categorie uniche
  const categorieUniche = [...new Set(appunti.map(f => f.categoria))];

  // Filtra i appunti per la categoria selezionata
  const appuntiFiltrati = appunti.filter(f => f.categoria === categoriaSelezionata);


  const toggleAppuntiForm = () => {
    const appuntiForm = document.querySelector('.appuntiForm');
    appuntiForm.classList.toggle('appuntiFormDisplayNone');
  };

  const [form, setForm] = useState({
    id: null,
    nome: "",
    descrizione: "",
    categoria: ""
  });


  const handleAggiungiAppunto = () => {
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
    }
    toggleAppuntiForm();
  };

  const handleModifica = (item) => {
    setForm({
      id: item.id,
      nome: item.nome || "",
      descrizione: item.descrizione || "",
      categoria: item.categoria || ""
    });
    toggleAppuntiForm();
  };
  
  const handleSalva = () => {
    if (form.nome && form.descrizione && form.categoria && form.id !== null) {
      dispatch(modificaAppunto({
        id: form.id,
        nome: form.nome,
        descrizione: form.descrizione,
        categoria: form.categoria
      }));

      // Reset del form
      setForm({
        id: null,
        nome: "",
        descrizione: "",
        categoria: ""
      });
    }
    toggleAppuntiForm();
  };

  const itemsPerPage = 4;

    // 🧮 Calcola gli elementi da mostrare
  const listaDaMostrare = categoriaSelezionata
    ? appunti.filter(f => f.categoria === categoriaSelezionata)
    : appunti;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const appuntiVisibili = listaDaMostrare.slice(indexOfFirst, indexOfLast);

  // 🔘 Gestione cambio pagina
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
    <>
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
        {isLoading && <span className = "carico-dati"> ⏳ Carico dati... locale se offline </span>}
        {error && <span className = "carico-dati">{error} </span>}

          { localStorage.getItem('userCategoria') !== '1' &&
            <div className="toggleLink" onClick={toggleAppuntiForm}> Add new &nbsp;&nbsp;<p>+</p></div>
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
                <div  key={item.id} className="article-item-wrapper">

                <div className="article-item">
                  <div className="item-info" style={{fontWeight:"bold"}}>
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

                    {isLungo(item.descrizione)  && scrollStates[item.id] && (
                      <button
                        className="freccia-scroll"
                        onClick={() => scrollToTop(item.id)}
                      >
                        ↑
                      </button>
                    )}
                    </div>

                  { localStorage.getItem('userCategoria') !== '1' &&
                    <div className="actions">
                      <button type="button" className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                      <button type="button" className="btn-azione btn-delete" onClick={() => window.confirm("Sicuro che delete?") && dispatch(eliminaAppunto(item.id))}>❌</button>
                    </div>
                  }
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            totalItems={appunti.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />    
        </div>
      {categoriaSelezionata && (
        <ModaleAppunti 
          categoriaSelezionata={categoriaSelezionata}
          setCategoriaSelezionata= {setCategoriaSelezionata}
          appuntiFiltrati = {appuntiFiltrati}
        />
      )}
      </div>
    </>
  );
};

export default Appunti;