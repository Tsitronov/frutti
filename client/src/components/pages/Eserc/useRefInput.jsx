import {useRef, useEffect, useState} from 'react';

const Eserc =()=>{
	const inputRef = useRef(null);     // 🔹 1. создаём ссылку на input -> creato oggect {current: null}
	const [count, setCount] = useState(0); // 🔹 2. создаём состояние count
	const handleChange = (e) => {setCount(e.target.value)};
	useEffect(()=>{
		inputRef.current.focus();          // 🔹 3. при первом рендере фокус на input
	}, []);


	
	const [form, setForm] = useState({
		nome: '',
		email: ''
	});
	const handleChangeDue = (e) => {
		const {name, value} = e.target;
		setForm((prevForm) => ({
			...prevForm,
			[name]:value
		})) 

	}

	const handleSubmit = (e) => {
	e.preventDefault();                        // предотвращает перезагрузку

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
		<><p> {count}</p>

			<input 
				ref={inputRef}            // 🔹 4. прикрепляем ref к input solo una
				value={count} 
				onChange={handleChange} 
			/>


			<button type='button' onClick={() => setCount(count+1)}> aumenta </button>

			<form>
		      <input
		        type="text"
		        name="nome"
		        value={form.nome}
		        onChange={handleChangeDue}
		      />
		      <input
		        type="email"
		        name="email"
		        value={form.email}
		        onChange={handleChangeDue}
		      />
		      <button type="submit" onClick ={handleSubmit} >Invia</button>
		    </form>
				
		</>

		);
}

export default Eserc;
