import { useRef, useState, useEffect } from "react";

const ModaleArticoli = ({
  categoriaSelezionata,
  setCategoriaSelezionata,
  articoliFiltrati
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

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="verde">{categoriaSelezionata}</h2>

        <div className="modal-body" ref={contentRef}>
          {articoliFiltrati.map(f => (
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
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default ModaleArticoli;
