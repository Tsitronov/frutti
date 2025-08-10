import { useState, useEffect } from "react";

const Fetch = () => {

  const [form, setForm] = useState({ nome: "", email: "" });
  const [utenti, setUtenti] = useState([]);

  // GET
  async function resServ() {
    try {
      const respons = await fetch("http://localhost:3001/api/utenti");
      const data = await respons.json();
      setUtenti(data); // сохраним в state
    } catch (error) {
      console.log(error);
    }
  }

  // POST
  async function handleSubmit(e) {
    e.preventDefault(); // чтобы не перезагружалась страница
    try {
      const respons = await fetch("http://localhost:3001/api/utenti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await respons.json();
      console.log("Ответ сервера:", data);
      
      resServ(); // обновим список после отправки
      setForm({ nome: "", email: "" });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    resServ(); // загружаем список при первом рендере
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Nome"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />
        <button type="submit">Invia</button>
      </form>

      <ul>
        {utenti.map((u, i) => (
          <li key={i}>{u.reparto}</li>
        ))}
      </ul>
    </div>
  );
}
export default Fetch;