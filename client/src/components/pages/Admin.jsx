import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser
} from "../../redux/usersSlice";

import Navbar from "../UI/navbar/Navbar";

const Admin = () => {
  const dispatch = useDispatch();
  const { lista, isLoading, error } = useSelector((state) => state.users);

  const [formAdmin, setFormAdmin] = useState({ username: "", password: "", categoria: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const toggleAdminForm = () => setShowForm(prev => !prev);

  const handleChangeAdmin = (e) => {
    setFormAdmin({ ...formAdmin, [e.target.name]: e.target.value });
  };

  const resetFormAdmin = () => {
    setFormAdmin({ username: "", password: "", categoria: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmitAdmin = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateUser({ id: editId, user: formAdmin }));
    } else {
      dispatch(addUser(formAdmin));
    }
    resetFormAdmin();
  };

  const handleEditAdmin = (user) => {
    setFormAdmin({ username: user.username, password: "", categoria: user.categoria });
    setEditId(user.id);
    setShowForm(true);
  };

  const handleDeleteAdmin = (id) => {
    if (window.confirm("Sicuro che delete?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="main-content" style={{margin:"0 auto"}}>
        <div className="content content-table-admin">

          <div className="admin-sibedar">
            <div className="toggleLink" onClick={toggleAdminForm}>
              {showForm ? "Chiudi form" : "Aggiungi 🙂"}
            </div>
            <NavLink className="toggleLink" to="/importExcel">Excel</NavLink>
            <NavLink className="toggleLink" to="/sulSito">Descrizione</NavLink>
          </div>

          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <form className="adminForm" onSubmit={handleSubmitAdmin}>
                  <input
                    name="username"
                    placeholder="Username"
                    value={formAdmin.username}
                    onChange={handleChangeAdmin}
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formAdmin.password}
                    onChange={handleChangeAdmin}
                    required={!editId}
                  />
                  <input
                    name="categoria"
                    placeholder="Categoria"
                    value={formAdmin.categoria}
                    onChange={handleChangeAdmin}
                  />
                  <div className="modal-buttons">
                    <button type="submit" className="btn-salva">{editId ? "Aggiorna" : "Aggiungi"}</button>
                    <button type="button" className="btn-elimina" onClick={resetFormAdmin}>❌ Annulla</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isLoading && <div className="loading-spinner"></div>}
          {error && <p className="error-login">{error}</p>}

          <div className="table-wrapper-admin">
            <table>
              <tbody>
                {lista.map((item) => (
                  <tr key={item.id}>
                    <td>{item.username}</td>
                    <td>{item.categoria}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-azione btn-modifica"
                        onClick={() => handleEditAdmin(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="btn-azione btn-elimina"
                        onClick={() => handleDeleteAdmin(item.id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lista.length === 0 && !isLoading && <p className="carico-dati">Nessun utente trovato.</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin;