import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    fetch('http://localhost:5000/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => history.push('/login'));
  }, [history]);

  return user ? (
    <div>
      <h1>Добро пожаловать, {user.email}</h1>
    </div>
  ) : (
    <p>Загрузка...</p>
  );
};

export default ProfilePage;
