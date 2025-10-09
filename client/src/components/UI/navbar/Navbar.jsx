import { NavLink, useNavigate  } from 'react-router-dom';
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

  const categoria = localStorage.getItem('userCategoria');

  return (
    <nav className="top-nav">
      <ul className="top-nav-links">
        <li>
          <NavLink
            to="/sulsito"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Descrizione
          </NavLink>
        </li>
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
        {(categoria === '2' || categoria === '3') && (
        <li>
          <NavLink
            to="/importExcel"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Excel
          </NavLink>
        </li>
        )}
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
        {(categoria === '2' || categoria === '3') && (
        <li>
          <NavLink
            to="/utentiTable"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            UtentiTable
          </NavLink>
        </li>
        )}
        {(categoria === '2' || categoria === '3') && (
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
        )}
        { (categoria === '3') && (
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
        )}

        {(categoria === '2' || categoria === '3') && (
        <li>
          <NavLink
            to="/team-photos"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Team Photos
          </NavLink>
        </li>
        )}


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