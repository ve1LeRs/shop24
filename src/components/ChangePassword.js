import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (oldPassword === 'password123') {  // Заглушка, проверка старого пароля
      const updatedProfile = { ...userProfile, password: newPassword };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));  // Сохраняем новый пароль
      navigate('/profile');  // Перенаправляем обратно в профиль
    } else {
      setErrorMessage('Неверный старый пароль');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Сменить пароль</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Старый пароль:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Новый пароль:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Обновить пароль</button>
      </form>
    </div>
  );
};

export default ChangePassword;
