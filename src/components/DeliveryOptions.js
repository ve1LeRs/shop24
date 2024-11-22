import React from 'react';
import './DeliveryOptions.css'; // Не забудьте подключить стили

const DeliveryOptions = () => {
  return (
    <div className="delivery-options">
      <h2>Способы доставки</h2>
      <ul>
        <li>Курьерская доставка — 300 ₽</li>
        <li>Самовывоз — бесплатно</li>
        <li>Доставка почтой — 500 ₽</li>
      </ul>
    </div>
  );
};

export default DeliveryOptions;
