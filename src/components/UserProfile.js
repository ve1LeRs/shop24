import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './UserProfile.css';

const UserProfile = ({ userProfile, updateUserProfile }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(userProfile); // Локальное состояние для профиля
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Для обработки ошибок

  useEffect(() => {
    if (!userProfile) {
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProfile(data);  // Обновляем локальное состояние профиля
            updateUserProfile(data);  // Обновляем профиль в родительском компоненте
          } else {
            setError('Ошибка при загрузке профиля');
            navigate('/login');
          }
        } catch (error) {
          setError('Ошибка при загрузке профиля');
          console.error('Ошибка при загрузке профиля:', error);
          navigate('/login');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userProfile, updateUserProfile, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    updateUserProfile(null);
    navigate('/login');
  };

  // Функция для форматирования даты с использованием Moment.js
  const formatDate = (dateString) => {
    console.log('Дата, полученная от сервера:', dateString); // Логирование для проверки формата
    const date = moment(dateString, 'DD.MM.YYYY', true); // Указание формата даты
    if (!date.isValid()) {
      console.error('Неверная дата:', dateString); // Логирование ошибки
      return 'Неверная дата';
    }
    return date.format('DD.MM.YYYY');
  };

  if (loading) {
    return <p>Загрузка профиля...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="user-profile-container">
      <h2>Ваш профиль</h2>
      <div className="profile-info">
        <p><strong>Имя:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>

      <div className="order-history">
        <h3>История заказов</h3>
        {profile.orders && profile.orders.length > 0 ? (
          <ul>
            {profile.orders.map((order) => (
              <li key={order.id} className="order-item">
                <p><strong>Заказ №{order.id}</strong></p>
                <p>Дата: {formatDate(order.date)}</p>
                <p>
                  Товары: {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                </p>
                <p>Общая сумма: {order.total} ₽</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас пока нет заказов.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
