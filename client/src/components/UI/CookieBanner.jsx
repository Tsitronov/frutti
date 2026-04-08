import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <p className="cookie-banner-text">
        Questo sito utilizza cookie tecnici necessari per il funzionamento (autenticazione, preferenze tema).
        Nessun cookie di tracciamento o profilazione. &nbsp;
        <NavLink to="/privacy" className="cookie-link">Privacy Policy</NavLink>
      </p>
      <div className="cookie-banner-actions">
        <button className="btn-salva" onClick={accept}>Accetta</button>
        <button className="btn-elimina" onClick={reject}>Rifiuta</button>
      </div>
    </div>
  );
};

export default CookieBanner;
