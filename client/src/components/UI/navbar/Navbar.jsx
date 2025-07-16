import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context';

const Navbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('auth');
  };

  return (
    <nav className="top-nav">
      <ul className="top-nav-links">
        <li>
          <NavLink
            to="/esercizio"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Esercizio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/utenti"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Utenti
          </NavLink>
        </li>

        {isAuth ? (
          <li>
            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={logout}>
              Logout
            </span>
          </li>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;