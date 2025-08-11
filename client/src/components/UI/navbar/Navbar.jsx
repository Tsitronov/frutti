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
            to="/generale"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Generale
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
           
            <span 
              className='nav-link logout '
              onClick={logout}>
              Logout
            </span>
           
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