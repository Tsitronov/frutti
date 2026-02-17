import { useEffect, useRef, useState } from "react";

const ModaleChatbot = ({ botResponse, setOpenModal }) => {
  const contentRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const element = contentRef.current;

    const handleScroll = () => {
      if (element.scrollTop > 300) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    element.addEventListener("scroll", handleScroll);

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    contentRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div
          ref={contentRef}
          className="modal-body"
        >
          <div style={{ whiteSpace: "pre-line" }}>
            {botResponse}
          </div>
        </div>

        {showArrow && (
          <button className="scroll-top" onClick={scrollToTop}>
            ⬆
          </button>
        )}

        <button type="button" onClick={() => setOpenModal(false)}>
          ❌ Chiudi
        </button>
      </div>
    </div>
  );
};

export default ModaleChatbot;
