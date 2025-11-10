import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context';
import { setTokens } from '../../api.js';
import api from '../../api.js';

const Login = () => {
  const { setIsAuth, setCategoria } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLocalError('');
    setLoading(true);

    try {
      const response = await api.post('/api/login', data);

      if (response.data?.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        setIsAuth(true);
        setCategoria(response.data.categoria);
        navigate('/utenti');
      } else {
        setLocalError('Risposta del server non valida');
      }
    } catch (err) {
      console.error('Errore di accesso:', err);
      setLocalError(err.response?.data?.error || 'Accesso o password non validi');
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div className="container-login"> 
      <div className="main-content-login"> 
        <div className="content-login">
         <h3 className="title-login">Pagina di accesso</h3> 
         <div className="article-list-login">
          {loading && <div className="loading-spinner"></div>}
          {localError && <p className="error-login">{localError}</p>}

            <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="input-login"
                placeholder="login"
                {...register('username', { required: 'Accesso richiesto' })}
              />
              {errors.username && (
                <p className="error-login">{errors.username.message}</p>
              )}
              <input
                type="password"
                className="input-login"
                placeholder="password"
                {...register('password', { required: 'Password richiesta' })}
              />
              {errors.password && (
                <p className="error-login">{errors.password.message}</p>
              )}
              <button type="submit" className="button-login" disabled={loading}>
                {loading ? 'in corso...' : 'Accedi'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
