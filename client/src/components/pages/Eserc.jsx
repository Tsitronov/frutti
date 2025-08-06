import {useRef, useEffect, useState} from 'react';

const Eserc =()=>{
	const inputRef = useRef(null);     // 🔹 1. создаём ссылку на input -> creato oggect {current: null}
	const [count, setCount] = useState(0); // 🔹 2. создаём состояние count

	useEffect(()=>{
		inputRef.current.focus();          // 🔹 3. при первом рендере фокус на input
	}, []);


	const handleChange = (e) => {setCount(e.target.value)};


	return(
		<>
			<input 
				ref={inputRef}            // 🔹 4. прикрепляем ref к input
				value={count} 
				onChange={handleChange} 
			/>

			<button type='button' onClick={() => setCount(count+1)}> aumenta </button>
		</>

		);
}

export default Eserc;
