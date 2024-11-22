import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Вы вышли из системы');
  };

  return <button onClick={handleLogout}>Выйти</button>;
};

export default LogoutButton;
