import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context';

const Navbar = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('auth');
    localStorage.removeItem('userCategoria');
    navigate('/loginDemo', { replace: true });
  };

  return (
    <nav className="top-nav">
      <ul className="top-nav-links">
        <li>
          <NavLink
            to="/appuntiDemo"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Appunti
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/generaleDemo"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Generale
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/utentiDemo"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Utenti
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/reportDemo"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Report
          </NavLink>
        </li>
        { localStorage.getItem('userCategoria') === '3' &&
        <li>
          <NavLink
            to="/adminDemo"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Admin
          </NavLink>
        </li>
        }

        {isAuth ? (
           
            <span 
              className='nav-link logout '
              onClick={logout}>
              Logout
            </span>
           
        ) : (
          <li>
            <NavLink
              to="/loginDemo"
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