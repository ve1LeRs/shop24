import React from 'react';

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
};

export default Notification;
