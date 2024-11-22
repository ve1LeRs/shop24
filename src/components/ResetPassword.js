import React, { useState } from 'react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        alert('Инструкция по сбросу пароля отправлена на ваш email');
      })
      .catch(error => {
        console.error('Ошибка:', error);
        alert('Ошибка при сбросе пароля');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email для сброса пароля" required />
      <button type="submit">Сбросить пароль</button>
    </form>
  );
};

export default ResetPassword;
