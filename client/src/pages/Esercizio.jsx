import { useSelector, useDispatch } from "react-redux";
import {
  fetchFrutti,
  aggiungiFrutto,
  eliminaFrutto,
  modificaFrutto
} from "../redux/fruttiSlice";
import { useState, useEffect } from "react";

const Ezercizio = () => {
  const frutti = useSelector(state => state.frutti);
  const dispatch = useDispatch();

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
    dispatch(modificaFrutto({ id: modificaId, nome, categoria }));
    setNome("");
    setCategoria("");
    setModificaId(null);
  };

  return (
    <div>
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

      <ul>
        {frutti.map(item => (
          <li key={item.id}>
            {item.nome} - {item.categoria}{" "}
            <button onClick={() => handleModifica(item)}>✏️</button>
            <button onClick={() => dispatch(eliminaFrutto(item.id))}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ezercizio;
