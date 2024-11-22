import React from 'react';
import './ProductCard.css'; // Оставляем стиль, который был в первой версии
import { Link } from 'react-router-dom'; // Добавляем Link из второй версии

const ProductCard = ({ product, addToCart, addToWishlist }) => {
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    addToWishlist(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img className="product-image" src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price" style={{ fontWeight: 'bold', color: '#ff5722', fontSize: '1.5rem' }}>
          {product.price} ₽
        </p>
      </Link>
      <div className="buttons">
        <button onClick={handleAddToCart}>Добавить в корзину</button>
        {addToWishlist && (
          <button onClick={handleAddToWishlist}>Добавить в избранное</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
