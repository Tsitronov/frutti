import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from "../../../redux/themeSlice";
import api, { setTokens } from '../../../api.js';

const Navbar = () => {
  const { isAuth, setIsAuth, categoria: contextCategoria, setCategoria } = useContext(AuthContext);


  const cat = contextCategoria ? Number(contextCategoria) : 0;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-hamburger, .mobile-menu-overlay')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    } finally {
      setIsAuth(false);
      setCategoria(null);
      setTokens(null);
      navigate('/login', { replace: true });
    }
  };

  const toggleThemeLocal = () => {
    dispatch(toggleTheme());
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen(prev => !prev);
  };

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
      {isMobile && (
        <button 
          className={`mobile-hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      )}

      {isMobile && isMobileMenuOpen && (
        <div className="mobile-menu-overlay open">
          <NavItem to="/appunti" onClick={closeMobileMenu}>Заметки</NavItem>
          <NavItem to="/generale" onClick={closeMobileMenu}>Общее</NavItem>
          <NavItem to="/utenti" onClick={closeMobileMenu}>Пользователи</NavItem>
          
          {/* ← ИСПРАВЛЕНО: теперь cat, а не categoria */}
          {(cat === 2 || cat === 3) && <NavItem to="/utentiTable" onClick={closeMobileMenu}>Таблица</NavItem>}
          {cat === 3 && <NavItem to="/admin" onClick={closeMobileMenu}>Админ</NavItem>}
          {(cat === 2 || cat === 3) && <NavItem to="/team-photos" onClick={closeMobileMenu}>Фото команды</NavItem>}
          
          {isAuth ? (
            <button className="nav-link logout" onClick={logout}>Выход</button>
          ) : (
            <NavItem to="/login" onClick={closeMobileMenu}>Login</NavItem>
          )}
          <button className="theme-toggle-mobile" onClick={(e) => { e.stopPropagation(); toggleThemeLocal(); closeMobileMenu(); }}>
            {theme === "light" ? "Месяц" : "Солнце"}
          </button>
        </div>
      )}

      {!isMobile && (
        <ul className="top-nav-links">
          <li><NavItem to="/appunti">Заметки</NavItem></li>
          <li><NavItem to="/generale">Общее</NavItem></li>
          <li><NavItem to="/utenti">Пользователи</NavItem></li>
          
          {(cat === 2 || cat === 3) && <li><NavItem to="/utentiTable">Таблица</NavItem></li>}
          {cat === 3 && <li><NavItem to="/admin">Админ</NavItem></li>}
          {(cat === 2 || cat === 3) && <li><NavItem to="/team-photos">Фото</NavItem></li>}
          
          {isAuth ? (
            <li><span className="nav-link logout" onClick={logout}>Выход</span></li>
          ) : (
            <li><NavItem to="/login">Login</NavItem></li>
          )}
        </ul>
      )}

      <button className="theme-toggle-mobile" onClick={(e) => { e.stopPropagation(); toggleThemeLocal(); }}>
         {theme === "light" ? "🌙" : "☀️"}
      </button>
    </nav>
  );
};

export default Navbar;