import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ setUserProfile }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email || !formData.password) {
      setErrorMessage('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      // Отправляем запрос на авторизацию
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        setErrorMessage(result.message || 'Ошибка на сервере');
        return;
      }

      // Получаем токен
      const { token } = await response.json();

      // Логируем токен
      console.log('Получен токен:', token);

      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);

      // Запрашиваем профиль пользователя с использованием токена
      const profileResponse = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        const profileError = await profileResponse.json();
        setErrorMessage(profileError.message || 'Ошибка при загрузке профиля');
        return;
      }

      // Сохраняем профиль пользователя в localStorage
      const userProfile = await profileResponse.json();

      // Логируем профиль пользователя
      console.log('Получен профиль пользователя:', userProfile);

      localStorage.setItem('userProfile', JSON.stringify(userProfile));

      // Передаем профиль в родительский компонент
      setUserProfile(userProfile);

      // Перенаправляем на страницу профиля
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
      setErrorMessage('Ошибка при подключении к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Вход в профиль</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Введите ваш email"
            required
            autoFocus
          />
        </div>
        <div className="form-item">
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Введите ваш пароль"
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
