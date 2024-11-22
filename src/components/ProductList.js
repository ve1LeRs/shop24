import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Получаем данные из products.json, расположенного в папке public
  useEffect(() => {
    fetch('/products.json')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          addToCart={addToCart} 
          addToWishlist={addToWishlist} 
        />
      ))}
    </div>
  );
};

export default ProductList;
