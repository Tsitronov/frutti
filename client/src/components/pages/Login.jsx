import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context';

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLocalError('');
    setLoading(true);

    try {
      await handleLogin(data.username, data.password);
    } catch (err) {
      console.error('Ошибка логина:', err);
      setLocalError('Неверный логин или пароль');
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
                {...register('password', { required: 'Пароль обязателен' })}
              />
              {errors.password && (
                <p className="error-login">{errors.password.message}</p>
              )}

              <button className="button-login" disabled={loading}>
                {loading ? 'Загрузка...' : 'Войти'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
