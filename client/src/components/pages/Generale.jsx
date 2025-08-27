import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";

import {
  fetchFrutti,
  aggiungiFrutto,
  eliminaFrutto,
  modificaFrutto,
  setCurrentPage,
  caricaFruttiLocalStorage
} from "../../redux/fruttiSlice";

import Navbar from '../UI/navbar/Navbar';
import Pagination from "../UI/pagination/Pagination.jsx";
import ModaleGenerale from "../UI/modal/ModaleGenerale";
import GeneraleForm from "../UI/forms/GeneraleForm";
import Loader from "../UI/Loader";
 


const Generale = () => {
  const dispatch = useDispatch();
  const frutti = useSelector(state => state.frutti.lista);
  const currentPage = useSelector((state) => state.frutti.currentPage);

  useEffect(() => {
    dispatch(caricaFruttiLocalStorage()); // 👈 Prima mostra i vecchi
    dispatch(fetchFrutti()).then(frutti);
  }, [dispatch]);

  const isLoading = useSelector((state) => state.frutti.isLoading);
  const error = useSelector((state) => state.frutti.error);

  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [categoria, setCategoria] = useState("");


  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);


  // Prendi solo categorie uniche
  const categorieUniche = [...new Set(frutti.map(f => f.categoria))];

  // Filtra i frutti per la categoria selezionata
  const fruttiFiltrati = frutti.filter(f => f.categoria === categoriaSelezionata);


  const toggleFruttiForm = () => {
    const fruttiForm = document.querySelector('.generaleForm');
    fruttiForm.classList.toggle('fruttiFormDisplayNone');
  };

  const [form, setForm] = useState({
    id: null,
    nome: "",
    descrizione: "",
    categoria: ""
  });


  const handleAggiungiFrutto = () => {
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
    }
    toggleFruttiForm();
  };

  const handleModifica = (item) => {
    setForm({
      id: item.id,
      nome: item.nome || "",
      descrizione: item.descrizione || "",
      categoria: item.categoria || ""
    });
    toggleFruttiForm();
  };
  
  const handleSalva = () => {
    if (form.nome && form.descrizione && form.categoria && form.id !== null) {
      dispatch(modificaFrutto({
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
    toggleFruttiForm();
  };

  const itemsPerPage = 4;

    // 🧮 Calcola gli elementi da mostrare
  const listaDaMostrare = categoriaSelezionata
    ? frutti.filter(f => f.categoria === categoriaSelezionata)
    : frutti;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const fruttiVisibili = listaDaMostrare.slice(indexOfFirst, indexOfLast);

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
            <Loader isLoading={isLoading} error={error} />

            <div className="toggleLink" onClick={toggleFruttiForm}> Add new &nbsp;&nbsp;<p>+</p></div>

            <GeneraleForm
              form={form} 
              setForm={setForm} 
              categorieUniche={categorieUniche}
              handleSalva={handleSalva}
              handleAggiungiFrutto={handleAggiungiFrutto}
              toggleFruttiForm={toggleFruttiForm}
            />
              
            <div className="article-list">
              {fruttiVisibili.map(item => (
                <div  key={item.id} className="article-item-wrapper">

                <div className="article-item" style={{ cursor: "pointer" }}>
                  <div className="item-info">
                    {item.nome}  –  {item.categoria}
                     
                  </div>
                  <div className="item-lungo-container">
                    <pre
                      ref={(el) => (testoRefs.current[item.id] = el)}
                      onScroll={() => handleScroll(item.id)}
                      className={isLungo(item.descrizione) ? 'testo-lungo' : ''}
                    >
                      {item.descrizione}
                    </pre>

                    {isLungo(item.descrizione)  && scrollStates[item.id] && (
                      <button
                        className="freccia-scroll"
                        onClick={() => scrollToTop(item.id)}
                      >
                        ↑
                      </button>
                    )}
                    </div>

                    <div className="actions">
                      <button type="button" className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                      <button type="button" className="btn-azione btn-delete" onClick={() => window.confirm("Sicuro che delete?") && dispatch(eliminaFrutto(item.id))}>❌</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            totalItems={frutti.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />    
        </div>
      {categoriaSelezionata && (
        <ModaleGenerale 
          categoriaSelezionata={categoriaSelezionata}
          setCategoriaSelezionata= {setCategoriaSelezionata}
          fruttiFiltrati = {fruttiFiltrati}
        />
      )}
      </div>
    </>
  );
};

export default Generale;