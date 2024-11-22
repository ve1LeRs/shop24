import React, { useEffect } from 'react';
import './Cart.css';

const Cart = ({
  cartItems,
  setCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  showNotification,
  userProfile,
  onOrderComplete,
}) => {
  useEffect(() => {
    // Проверка профиля пользователя в localStorage и вывод в консоль
    const storedUserProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      console.log('Профиль пользователя загружен:', userProfile);
    } else if (storedUserProfile) {
      console.log('Профиль пользователя найден в localStorage:', storedUserProfile);
    } else {
      console.log('Профиль пользователя не найден');
    }
  }, [userProfile]);

  const calculateTotal = () => {
    // Рассчитываем общую стоимость товаров в корзине
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    // Если корзина пуста, выводим уведомление
    if (cartItems.length === 0) {
      showNotification('Ваша корзина пуста!');
      return;
    }

    const storedUserProfile = localStorage.getItem('userProfile');
    const storedToken = localStorage.getItem('token');

    if (!storedUserProfile || !storedToken) {
      showNotification('Вы должны войти в систему для оформления заказа!');
      return;
    }

    const userProfileObj = JSON.parse(storedUserProfile);

    if (!userProfileObj || !userProfileObj._id) {
      showNotification('Профиль пользователя некорректен');
      return;
    }

    const newOrder = {
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: calculateTotal(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        const error = await response.json();
        showNotification(error.message || 'Ошибка при оформлении заказа');
        return;
      }

      const data = await response.json();

      if (typeof onOrderComplete === 'function') {
        onOrderComplete(data.order);
      } else {
        console.error('onOrderComplete не является функцией');
      }

      clearCart();
      showNotification('Заказ успешно оформлен!');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error.message);
      showNotification(error.message || 'Ошибка при оформлении заказа');
    }
  };

  return (
    <div className="cart-details">
      <h3>Содержимое корзины</h3>
      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={`${item.id}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} width="50" />
              <div className="item-details">
                <span>
                  {item.name} — {item.price} ₽, размер: {item.size}
                </span>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateCartItemQuantity(item.id, -1)}  // Уменьшаем количество товара
                    className="quantity-button"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateCartItemQuantity(item.id, 1)}  // Увеличиваем количество товара
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}  // Удаляем товар из корзины
                className="remove-button"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <div className="total">
          <h4>Итоговая стоимость: {calculateTotal()} ₽</h4>
          <button onClick={handleCheckout} className="checkout-button">
            Оформить заказ
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
