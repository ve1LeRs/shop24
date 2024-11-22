import React, { useState } from 'react';

const PromoCode = ({ onApply }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(code);
    setCode('');
  };

  return (
    <div className="promo-code">
      <h2>Промокод</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введите промокод"
        />
        <button type="submit">Применить</button>
      </form>
    </div>
  );
};

export default PromoCode;
