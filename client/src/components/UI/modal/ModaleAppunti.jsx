import { useRef, useState, useEffect } from "react";

const ModaleAppunti = ({
  categoriaSelezionata,
  setCategoriaSelezionata,
  appuntiFiltrati
}) => {
  const contentRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = contentRef.current;

    const handleScroll = () => {
      setShowArrow(el.scrollTop > 200);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="verde">{categoriaSelezionata}</h2>

        <div className="modal-body" ref={contentRef}>
          {appuntiFiltrati.map(f => (
            <ul key={f.id}>
              <li className="blue">{f.nome}</li>
              <li style={{ whiteSpace: "pre-line" }}>
                {f.descrizione}
              </li>
            </ul>
          ))}
        </div>

        {showArrow && (
          <button className="scroll-top" onClick={scrollToTop}>
            ↑
          </button>
        )}

        <button
          type="button"
          onClick={() => setCategoriaSelezionata(null)}
        >
          ❌ Chiudi
        </button>
      </div>
    </div>
  );
};

export default ModaleAppunti;
