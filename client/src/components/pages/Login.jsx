import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context';

const Login = () => {
  const { setIsAuth, setUserCategoria } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);   // ✅ локальный loading
  const [localError, setLocalError] = useState(''); // ✅ локальная ошибка

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/loginDemo`,
        data
      );

      if (response.data.message === 'Login riuscito') {
        setIsAuth(true);
        localStorage.setItem('auth', 'true');

        const categoria = response.data.categoria || '0';
        setUserCategoria(categoria);
        localStorage.setItem('userCategoria', categoria);

        // ✅ Сохраняем токен
        const token = response.data.token;
        if (token) {
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        setLocalError('');
        navigate('/utentiDemo');
      } else {
        setLocalError('Неожиданный ответ от сервера');
      }
    } catch (err) {
      console.error('Error:', err.response?.data, err.message);
      setLocalError(err.response?.data?.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-login">
      <div className="main-content-login">
        <div className="content-login">
          <h3 className="title-login">Страница входа</h3>
          <div className="article-list-login">
            {loading && <div className="loading-spinner"></div>}
            {localError && <p className="error-login">{localError}</p>}

            <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="input-login"
                placeholder="Введите логин"
                {...register('username', { required: 'Требуется логин' })}
              />
              {errors.username && (
                <p className="error-login">{errors.username.message}</p>
              )}

              <input
                type="password"
                className="input-login"
                placeholder="Введите пароль"
                {...register('password', {
                  required: 'Пароль обязателен',
                })}
              />
              {errors.password && (
                <p className="error-login">{errors.password.message}</p>
              )}

              <button className="button-login">Войти</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;