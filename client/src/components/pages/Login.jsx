import { useContext, useState } from 'react';
import { useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context';

const Login = () => {
  const { isLoading, error } = useSelector((state) => state.users);
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/loginDemo`, data);

      if (response.data.message === 'Login riuscito') {
        setIsAuth(true);
        localStorage.setItem('auth', 'true');

        const categoria = response.data.categoria || '0';
        setUserCategoria(categoria);
        localStorage.setItem('userCategoria', categoria);

        setError('');
        navigate('/generaleDemo');
      } else {
        setError('Неожиданный ответ от сервера');
      }
    } catch (err) {
      console.error('Error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    }
  };

  return (
    <div className="container-login">
      <div className="main-content-login">
        <div className="content-login">
          <h3 className="title-login">Pagina di accesso</h3>
          <div className="article-list-login">
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="input-login"
                placeholder="Inserisci il login"
                {...register('username', { required: 'È richiesto l`accesso' })}
              />
              {errors.username && <p className="error-login">{errors.username.message}</p>}

              <input
                type="password"
                className="input-login"
                placeholder="Inserisci la password"
                {...register('password', { required: 'La password è obbligatoria' })}
              />
              {errors.password && <p className="error-login">{errors.password.message}</p>}

              <button className="button-login">entrare</button>
            </form>

            {error && <p className="error-login">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
