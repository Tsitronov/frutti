import {useState, useEffect} from 'react';

const Form = () =>{
	const [form, setForm] = useState({
		nome: '',
		email: ''
	});

	const handleChange = (e) => {
		const {name, value} = e.target;
		setForm((prevForm) => ({
			...prevForm,
			[name]:value
		})) 

	}

	  const handleSubmit = (e) => {
	    e.preventDefault();                        // предотвращает перезагрузку

	                                                        // ✅ Validazione: blocca se uno dei campi è vuoto
	    if (!form.nome.trim() || !form.email.trim()) {
	      alert('Per favore, compila tutti i campi.');
	      return;
	    }

	    alert(form.nome + ' ' + form.email);
	    setForm({
	    	nome: '',
			email: ''
	    })
	  };

	  useEffect(() => {
	  	console.log(form.nome + ' ' + form.email);
	  }, [form]);


	return(
		<form>
	      <input
	        type="text"
	        name="nome"
	        value={form.nome}
	        onChange={handleChange}
	      />
	      <input
	        type="email"
	        name="email"
	        value={form.email}
	        onChange={handleChange}
	      />
	      <button type="submit" onClick ={handleSubmit} >Invia</button>
	    </form>
		);
}
export default Form;