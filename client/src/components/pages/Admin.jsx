import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

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

      <div className="main-content">
        <div className="content">
          <div className="toggleLink" onClick={toggleAdminForm}>
            {showForm ? "Chiudi form" : "Add new +"}
          </div>

          {showForm && (
            <div className="adminForm">
              <div className="modal">
                <div className="modal-content">
                <form onSubmit={handleSubmitAdmin}>
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
                  <button type="submit" className="btn-salva" >{editId ? "Aggiorna" : "Aggiungi"}</button>
                  <button type="button" className="btn-elimina" onClick={resetFormAdmin}>❌ Annulla</button>
                </form>
                </div>
              </div>
            </div>
          )}

          <div className="article-list">

            {error && <p style={{ color: "red" }}>{error}</p>}

            {lista.map((item) => (
              <div key={item.id} className="article-wrapper-admin">
                <div className="article-item-admin">
                  <div>{item.username}</div>
                  <div>{item.categoria}</div>
                  <div className="actions">
                    <button type="button" className="btn-azione btn-update" onClick={() => handleEditAdmin(item)}>✏️ Edit</button>
                    <button type="button" className="btn-azione btn-delete" onClick={() => handleDeleteAdmin(item.id)}>❌ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;