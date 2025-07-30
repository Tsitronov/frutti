import { useSelector, useDispatch } from "react-redux";
import {
  fetchFrutti,
  aggiungiFrutto,
  eliminaFrutto,
  modificaFrutto,
  setCurrentPage
} from "../../redux/fruttiSlice";
import { useState, useEffect } from "react";

import Navbar from '../UI/navbar/Navbar';
import Pagination from "../UI/pagination/Pagination.jsx";

import { useRef } from "react";

const Generale = () => {
  const dispatch = useDispatch();
  const frutti = useSelector(state => state.frutti.lista);
  const currentPage = useSelector((state) => state.frutti.currentPage);

  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [categoria, setCategoria] = useState("");


  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);


  // Prendi solo categorie uniche
  const categorieUniche = [...new Set(frutti.map(f => f.categoria))];

  // Filtra i frutti per la categoria selezionata
  const fruttiFiltrati = frutti.filter(f => f.categoria === categoriaSelezionata);


  // 📥 carica i dati al primo render
  useEffect(() => {
    dispatch(fetchFrutti());
  }, [dispatch]);

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
  };

  const [form, setForm] = useState({
    id: null,
    nome: "",
    descrizione: "",
    categoria: ""
  });

  const handleModifica = (item) => {
    setForm({
      id: item.id,
      nome: item.nome || "",
      descrizione: item.descrizione || "",
      categoria: item.categoria || ""
    });
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
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('sidebarDisplayNone');
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
        <div className="sidebar">
          <div className="categories">
            <ul>
            {categorieUniche.map((cat, index) => (
              <li key={index} onClick={() => setCategoriaSelezionata(cat)}>
                {cat}
              </li>
            ))}

            </ul>
          </div>
        </div>

        <div className="main-content wide-content">
          
          <Navbar />
 
          <div id="poloski" title="visible Menu" onClick={toggleSidebar}>
            naschondiSidebar
          </div>

          <h2>🍎 Lista </h2>

        <input
          value={form.nome || ""}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="nome"
        />

        <input
          value={form.descrizione || ""}
          onChange={(e) => {setForm({ ...form, descrizione: e.target.value })}}
          placeholder="Descrizione"
        />

        <input
          list="suggestions"
          value={form.categoria || ""}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          placeholder="Categoria"
        />
          <datalist id="suggestions">
            {categorieUniche.map((cat, i) => (
              <option key={i} value={cat} />
            ))}
          </datalist>

        {form.id !== null ? (
          <button type="button" onClick={handleSalva}> 💾 Salva </button>
        ) : (
          <button type="button" onClick={handleAggiungiFrutto}> ➕ Aggiungi </button>
        )}

          <div className="article-list">
            {fruttiVisibili.map(item => (
              <div className="article-item" key={item.id} style={{ cursor: "pointer" }}>
                <div className="item-info">
                  {item.nome}  –  {item.categoria}
                   
                </div>
                <div className="item-lungo-container">
                  <div
                    ref={(el) => (testoRefs.current[item.id] = el)}
                    onScroll={() => handleScroll(item.id)}
                    className={isLungo(item.descrizione) ? 'testo-lungo' : ''}
                  >
                    {item.descrizione}
                  </div>

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
            ))}
          </div>

          <Pagination
            totalItems={frutti.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />

        {categoriaSelezionata && (
          <div className="modal">
            <div className="modal-content">
              <h3>Categoria: {categoriaSelezionata}</h3>
              <ul>
                {fruttiFiltrati.map(f => (
                  <li key={f.id}>{f.nome} - {f.descrizione}</li>
                ))}
              </ul>
              <button type="button" type="button" onClick={() => setCategoriaSelezionata(null)}>❌ Chiudi</button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Generale;