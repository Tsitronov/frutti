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

const Ezercizio = () => {
  const dispatch = useDispatch();
  const frutti = useSelector(state => state.frutti.lista);
  const currentPage = useSelector((state) => state.frutti.currentPage);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [modificaId, setModificaId] = useState(null);

  // 📥 carica i dati al primo render
  useEffect(() => {
    dispatch(fetchFrutti());
  }, [dispatch]);

  const handleAggiungi = () => {
    if (nome && categoria) {
      dispatch(aggiungiFrutto({ nome, categoria }));
      setNome("");
      setCategoria("");
    }
  };

  const handleModifica = (item) => {
    setNome(item.nome);
    setCategoria(item.categoria);
    setModificaId(item.id);
  };

  const handleSalva = () => {
    if (nome && categoria && modificaId) {
      dispatch(modificaFrutto({ id: modificaId, nome, categoria }));
      setNome("");
      setCategoria("");
      setModificaId(null);
    }
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('sidebarDisplayNone');
  };

  const itemsPerPage = 4;


  // 🧮 Calcola gli elementi da mostrare
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const fruttiVisibili = frutti.slice(indexOfFirst, indexOfLast);

  // 🔘 Gestione cambio pagina
  const cambiaPagina = (numero) => {
    dispatch(setCurrentPage(numero));
  };

  return (
    <>
      <div className="container">
        <div className="sidebar sidebarDisplayNone">
          <div className="categories">
            <ul>
              <li><a href="">все</a></li>
            </ul>
          </div>
        </div>

        <div className="main-content wide-content">
          <Navbar />
 
          <div id="poloski" title="visible Menu" onClick={toggleSidebar}>
            категории
          </div>

          <h2>🍎 Lista </h2>

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Categoria"
          />
          {modificaId ? (
            <button onClick={handleSalva}>💾 Salva</button>
          ) : (
            <button onClick={handleAggiungi}>➕ Aggiungi</button>
          )}

          <div className="article-list">
            {fruttiVisibili.map(item => (
              <div className="article-item" key={item.id}>
                <div className="item-info">
                  {item.nome} – {item.categoria}
                </div>

                <div className="actions">
                  <button className="btn-azione btn-update" onClick={() => handleModifica(item)}>✏️</button>
                  <button className="btn-azione btn-delete" onClick={() => dispatch(eliminaFrutto(item.id))}>❌</button>
                </div>

                <button className="toggle-btn">Читать далее</button>
              </div>
            ))}
          </div>

          <Pagination
            totalItaems={frutti.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={cambiaPagina}
          />

        </div>
      </div>
    </>
  );
};

export default Ezercizio;