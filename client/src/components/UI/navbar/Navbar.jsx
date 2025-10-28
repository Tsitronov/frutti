import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context';
import { useDispatch, useSelector } from 'react-redux';

import { toggleTheme } from "../../../redux/themeSlice";

const Navbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu on outside click — с фиксом для hamburger
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-hamburger, .mobile-menu-overlay')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Sync theme to body class
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
  }
  }, [theme]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('auth');
    localStorage.removeItem('userCategoria');
    navigate('/login', { replace: true });
    closeMobileMenu();
  };

  const categoria = localStorage.getItem('userCategoria');

  const toggleThemeLocal = () => {
    dispatch(toggleTheme());
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Common NavLink component for reuse
  const NavItem = ({ to, children, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
    >
      {children}
    </NavLink>
  );

  return (
    <nav className={`top-nav navbar ${theme}`}>
      {/* Hamburger Button - Solo su mobile */}
      {isMobile && (
        <button 
          className={`mobile-hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Mobile Overlay Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-menu-overlay open">
          <NavItem to="/appuntiDemo" onClick={closeMobileMenu}>Заметки</NavItem>
          <NavItem to="/generaleDemo" onClick={closeMobileMenu}>Общее</NavItem>
          <NavItem to="/utentiDemo" onClick={closeMobileMenu}>Пользователи</NavItem>
          {(categoria === '2' || categoria === '3') && (
            <NavItem to="/utentiTable" onClick={closeMobileMenu}>Таблица пользователей</NavItem>
          )}
          {categoria === '3' && (
            <NavItem to="/adminDemo" onClick={closeMobileMenu}>Админ</NavItem>
          )}
          {(categoria === '2' || categoria === '3') && (
            <NavItem to="/team-photos" onClick={closeMobileMenu}>Фото команды</NavItem>
          )}
          {isAuth ? (
            <button className="nav-link logout" onClick={logout}>Выход</button>
          ) : (
            <NavItem to="/loginDemo" onClick={closeMobileMenu}>Вход</NavItem>
          )}
          <button 
            className="theme-toggle-mobile" 
            onClick={(e) => { e.stopPropagation(); toggleThemeLocal(); closeMobileMenu(); }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      )}

      {/* Desktop Nav Links - Nascondi su mobile */}
      {!isMobile && (
        <ul className="top-nav-links">
          <li><NavItem to="/appuntiDemo">Заметки</NavItem></li>
          <li><NavItem to="/generaleDemo">Общее</NavItem></li>
          <li><NavItem to="/utentiDemo">Пользователи</NavItem></li>
          {(categoria === '2' || categoria === '3') && <li><NavItem to="/utentiTable">Таблица пользователей</NavItem></li>}
          {categoria === '3' && <li><NavItem to="/adminDemo">Админ</NavItem></li>}
          {(categoria === '2' || categoria === '3') && <li><NavItem to="/team-photos">Фото команды</NavItem></li>}
          {isAuth ? (
            <li>
              <span className="nav-link logout" onClick={logout}> Выход </span>
            </li>
          ) : (
            <li><NavItem to="/loginDemo">Вход</NavItem></li>
          )}
        </ul>
      )}

      {/* Theme Toggle - Sempre visibile, ma position fixed su desktop */}
      <button 
        className="theme-toggle-mobile" 
        onClick={(e) => { 
          e.stopPropagation(); 
          toggleThemeLocal(); 
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </nav>
  );
};

export default Navbar;