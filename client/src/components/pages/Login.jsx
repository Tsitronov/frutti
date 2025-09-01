import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context';
import Navbar from '../UI/navbar/Navbar';

const Login = () => {
  const { setIsAuth, setUserCategoria } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, data);

      if (response.data.message === 'Login riuscito') {
        setIsAuth(true);
        localStorage.setItem('auth', 'true');
        const categoria = response.data.categoria || '0';
        setUserCategoria(categoria);
        localStorage.setItem('userCategoria', categoria);
        setError('');
        navigate('/generale');
      } else {
        setError('Неожиданный ответ от сервера');
      }
    } catch (err) {
      console.error('Error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="main-content">
        <div className="content">
          <h3>Страница для логина</h3>
          <div className="article-list">
            <form className="forma-login" onSubmit={handleSubmit(onSubmit)}>
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
    </div>
  );
};

export default Login;