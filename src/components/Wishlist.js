import React from 'react';
import './Wishlist.css'; // Импортируйте стили, если необходимо

const Wishlist = ({ wishlist, removeFromWishlist }) => {
  return (
    <div className="wishlist">
      <h2>Избранное</h2>
      {wishlist.length === 0 ? (
        <p>Ваш список избранного пуст.</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.map(product => (
            <div key={product.id} className="wishlist-item">
              <img src={product.image} alt={product.name} className="wishlist-item-image" />
              <div className="wishlist-item-details">
                <h3 className="wishlist-item-name">{product.name}</h3>
                <p className="wishlist-item-price">Цена: {product.price} ₽</p>
                <button 
                  onClick={() => removeFromWishlist(product.id, product.size)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
