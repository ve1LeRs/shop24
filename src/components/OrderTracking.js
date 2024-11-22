import React from 'react';
import './OrderTracking.css';

const OrderTracking = ({ orderHistory }) => {
  return (
    <div className="order-tracking">
      <h2>История заказов</h2>
      {orderHistory.length > 0 ? (
        <ul className="order-list">
          {orderHistory.map(order => (
            <li key={order.id}>
              <p>Заказ #{order.id}</p>
              <p>Дата: {order.date}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>{item.name} — {item.quantity} шт.</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет заказов.</p>
      )}
    </div>
  );
};

export default OrderTracking;
