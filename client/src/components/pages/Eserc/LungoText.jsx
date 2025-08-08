import { useRef, useState } from "react";

const testi = [
  {
    id: 1,
    contenuto: "A A ".repeat(500),
  },
  {
    id: 2,
    contenuto: "B B ".repeat(100),
  },
  {
    id: 3,
    contenuto: "C C ".repeat(700),
  },
];

const LungoText = () => {
  const testoRefs = useRef({});
  const [scrollStates, setScrollStates] = useState({});

  const isLungo = (testo) => testo && testo.length > 300;

  const handleScroll = (id) => {
    const el = testoRefs.current[id];
    if (el) {
      const isScrolled = el.scrollTop > 20;
      setScrollStates((prev) => ({ ...prev, [id]: isScrolled }));
    }
  };

  const scrollToTop = (id) => {
    const el = testoRefs.current[id];
    if (el) {
      el.scrollTop = 0;
    }
    alert("qui top");
  };

  return (
    <div style={{ padding: "20px" }}>
      {testi.map(({ id, contenuto }) => {
        const isScrolled = scrollStates[id]; // ✅ serve per colorare

        return (
          <div key={id} style={{ marginBottom: "30px" }}>
            <textarea
              rows="20"
              cols="20"
              ref={(el) => (testoRefs.current[id] = el)}
              onScroll={() => handleScroll(id)}
              value={contenuto} // ✅ textarea usa `value`, non children
              readOnly
              style={{
                border: "1px solid gray",
                padding: "10px",
                width: "100px",
                height: "400px",
                overflowY: "auto",
                backgroundColor: isScrolled ? "lightyellow" : "#f9f9f9",
              }}
            />

            {isLungo(contenuto) && isScrolled && (
              <button onClick={() => scrollToTop(id)}>🔝 Torna su</button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LungoText;