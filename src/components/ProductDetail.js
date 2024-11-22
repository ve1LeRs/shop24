import React from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ products, addToCart }) => {
  const { id } = useParams(); // Получаем id из параметров маршрута
  const product = products.find(prod => prod.id === Number(id)); // Находим продукт по id

  if (!product) {
    return <p>Товар не найден</p>; // Обработка случая, когда продукт не найден
  }

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">Цена: {product.price} ₽</p>
      <div className="add-to-cart">
        <button onClick={() => addToCart(product)}>Добавить в корзину</button>
      </div>
    </div>
  );
};

export default ProductDetail;
