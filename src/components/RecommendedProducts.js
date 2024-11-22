import React from 'react';
import './RecommendedProducts.css';

const RecommendedProducts = ({ products }) => {
  return (
    <div className="recommended-products">
      <h2>Рекомендуемые товары</h2>
      <div className="recommended-grid">
        {products.slice(0, 3).map(product => (
          <div key={product.id} className="recommended-item">
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p>Цена: {product.price} ₽</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
