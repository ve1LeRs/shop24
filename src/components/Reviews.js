import React from 'react';
import './Reviews.css';

const Reviews = ({ products }) => {
  return (
    <div className="reviews">
      <h2>Отзывы о товарах</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Здесь будут отображаться отзывы о товарах...</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
