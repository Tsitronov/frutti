import { useRef, useState, useEffect } from "react";

const ModaleAppunti = ({
  categoriaSelezionata,
  setCategoriaSelezionata,
  appuntiFiltrati,
  handleModifica,
  onElimina,
  isAuth,
  categoria
}) => {
  const contentRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    const handleScroll = () => setShowArrow(el.scrollTop > 200);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canEdit = isAuth && Number(categoria) >= 2;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="verde">{categoriaSelezionata}</h2>

        <div className="modal-body" ref={contentRef}>
          {appuntiFiltrati.map(f => (
            <ul key={f.id}>
              <li className="blue">{f.nome}</li>
              <li style={{ whiteSpace: "pre-line" }}>{f.descrizione}</li>
              {canEdit && (
                <li className="modal-actions">
                  <button
                    type="button"
                    className="btn-azione btn-update"
                    onClick={() => { handleModifica(f); setCategoriaSelezionata(null); }}
                  >✏️</button>
                  <button
                    type="button"
                    className="btn-azione btn-delete"
                    onClick={() => window.confirm("Eliminare questo elemento?") && onElimina(f.id)}
                  >❌</button>
                </li>
              )}
            </ul>
          ))}
        </div>

        {showArrow && (
          <button className="scroll-top" onClick={scrollToTop}>↑</button>
        )}

        <button type="button" onClick={() => setCategoriaSelezionata(null)}>
          ❌ Chiudi
        </button>
      </div>
    </div>
  );
};

export default ModaleAppunti;
