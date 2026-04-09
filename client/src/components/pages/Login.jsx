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

    let attempts = 0;
    while (attempts < 3) {
      try {
        const response = await api.post('/api/login', data);

        if (response.data?.accessToken) {
          setTokens(response.data.accessToken);
          setIsAuth(true);
          setCategoria(response.data.categoria);
          navigate('/utenti');
          return;
        } else {
          setLocalError('Invalid server response');
          break;
        }
      } catch (err) {
        attempts++;
        if (err.response?.status === 401) {
          setLocalError(err.response?.data?.error || 'Invalid username or password');
          break;
        }
        if (err.response?.status === 429) {
          setLocalError('Too many attempts — please wait 15 minutes');
          break;
        }
        // Жди перед retry (2с, 4с, 6с)
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
      }
    }
    setLoading(false);
  };

  return ( 
    <div className="container-login"> 
      <div className="main-content-login"> 
        <div className="content-login">
         <h3 className="title-login">Sign In</h3>
         <div className="article-list-login">
          {loading && <div className="loading-spinner"></div>}
          {localError && <p className="error-login">{localError}</p>}

            <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="input-login"
                placeholder="Username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <p className="error-login">{errors.username.message}</p>
              )}
              <input
                type="password"
                className="input-login"
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="error-login">{errors.password.message}</p>
              )}
              <button type="submit" className="button-login" disabled={loading}>
                {loading ? 'Accesso...' : 'Accedi'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
