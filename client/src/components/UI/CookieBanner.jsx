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
        This site uses essential cookies required for authentication and theme preferences.
        No tracking or advertising cookies are used.{' '}
        <NavLink to="/privacy" className="cookie-link">Privacy Policy</NavLink>
      </p>
      <div className="cookie-banner-actions">
        <button className="btn-salva" onClick={accept}>Accept</button>
        <button className="btn-elimina" onClick={reject}>Decline</button>
      </div>
    </div>
  );
};

export default CookieBanner;
