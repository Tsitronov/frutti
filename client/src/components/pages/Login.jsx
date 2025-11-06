import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context';
import { setTokens } from '../../api.js';

const Login = () => {
  const { setIsAuth, setCategoria } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/loginDemo`,
        data
      );

      if (response.data.message === 'Login riuscito') {
        setIsAuth(true);

        // ✅ сохраняем роль пользователя в памяти
        const categoria = response.data.categoria || '0';
        setCategoria(categoria);

        // ✅ сохраняем токены через helper
        setTokens(response.data.accessToken, response.data.refreshToken);

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
  }

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