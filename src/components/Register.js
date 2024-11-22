import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Стейт для отслеживания загрузки
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
    setError(''); // Сброс ошибки перед новым запросом
    setLoading(true); // Включаем индикатор загрузки

    // Проверка на пустые поля
    if (!formData.name || !formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/login'); // После успешной регистрации переходим на страницу логина
      } else {
        setError(result.message); // Ошибка при регистрации
      }
    } catch (error) {
      setError('Ошибка при подключении к серверу');
      console.error(error);
    } finally {
      setLoading(false); // Останавливаем индикатор загрузки
    }
  };

  return (
    <div className="register-form">
      <h2>Регистрация</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ваше имя"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Пароль"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default Register;
