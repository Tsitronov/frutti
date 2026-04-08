import { useEffect, useRef, useState } from "react";

const ModaleChatbot = ({ botResponse, setOpenModal }) => {
  const contentRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  const isDarkMode = document.body.classList.contains('dark');

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const handleScroll = () => {
      setShowArrow(element.scrollTop > 300);
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="modal">
      <div 
        className="modal-content"
        style={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          color: isDarkMode ? '#e0e0e0' : '#1a1a1a',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          padding: '1.5rem',
          maxWidth: '90vw',
          width: '500px'
        }}
      >
        <div
          ref={contentRef}
          className="modal-body"
          style={{
            lineHeight: "1.65",
            fontSize: "1.05rem",
            maxHeight: "65vh",
            overflowY: "auto",
            paddingRight: "0.5rem"
          }}
        >
          {(() => {
            const lines = botResponse.split('\n');
            const blocks = [];
            let current = [];
            lines.forEach((line) => {
              if (line.trim() && !line.startsWith('•') && current.length > 0) {
                blocks.push(current);
                current = [line];
              } else {
                current.push(line);
              }
            });
            if (current.length > 0) blocks.push(current);

            return blocks.map((block, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: idx < blocks.length - 1
                    ? `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                    : "none"
                }}
              >
                {block.map((line, lineIdx) => (
                  <div key={lineIdx} style={{ marginBottom: "0.2rem" }}>
                    {lineIdx === 0 ? (
                      <span style={{ color: "#a78bfa", fontWeight: "700", fontSize: "1.1rem" }}>{line}</span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            ));
          })()}
        </div>

        {showArrow && (
          <button 
            className="scroll-top" 
            onClick={scrollToTop}
            style={{
              backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
              color: isDarkMode ? '#fff' : '#333'
            }}
          >
            ⬆
          </button>
        )}

        <button 
          type="button" 
          onClick={() => setOpenModal(false)}
          style={{
            marginTop: "1rem",
            backgroundColor: isDarkMode ? '#444' : '#eee',
            color: isDarkMode ? '#fff' : '#333'
          }}
        >
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default ModaleChatbot;