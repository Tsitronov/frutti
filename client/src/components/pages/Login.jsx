import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/';

import Navbar from '../UI/navbar/Navbar';

const Login = () => {
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, data);

      if (response.data.message === 'Login riuscito') {
        setIsAuth(true);
        localStorage.setItem('auth', 'true');
        setError('');
        navigate('/generale');
      }
    } catch (err) {
      console.error(err);
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <Navbar />
        <h3>Страница для логина</h3>
        <div className="article-list">

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Введите логин"
              {...register('username', { required: 'Логин обязателен' })}
            />
            {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

            <input
              type="password"
              placeholder="Введите пароль"
              {...register('password', { required: 'Пароль обязателен' })}
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

            <button>Войти</button>
          </form>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;