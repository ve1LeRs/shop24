import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import UserProfile from './components/UserProfile';
import ChangePassword from './components/ChangePassword';
import Wishlist from './components/Wishlist';
import Reviews from './components/Reviews';
import StoreInfo from './components/StoreInfo';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]); // Список товаров из базы данных
  const [selectedCategory, setSelectedCategory] = useState('Все'); // Выбранная категория
  const [cartItems, setCartItems] = useState([]); // Товары в корзине
  const [searchTerm, setSearchTerm] = useState(''); // Поисковый запрос
  const [wishlist, setWishlist] = useState([]); // Список избранного
  const [notification, setNotification] = useState(''); // Уведомления
  const [userProfile, setUserProfile] = useState(null); // Профиль пользователя

  // Функция для обработки успешного оформления заказа
  const handleOrderComplete = (order) => {
    console.log('Заказ успешно оформлен:', order);

    if (userProfile) {
      const updatedUserProfile = { ...userProfile, orders: [...userProfile.orders, order] };

      // Обновляем профиль пользователя в состоянии
      setUserProfile(updatedUserProfile);

      // Сохраняем обновленный профиль в localStorage
      localStorage.setItem('userProfile', JSON.stringify(updatedUserProfile));

      // Дополнительные действия после оформления заказа
      showNotification('Ваш заказ был успешно оформлен и добавлен в ваш профиль!');
    }
  };

  // Загрузка данных из API при старте приложения
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error.message);
      }
    };
    fetchProducts();

    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));

    const savedCartItems = localStorage.getItem('cartItems');
    const savedWishlist = localStorage.getItem('wishlist');

    setCartItems(savedCartItems ? JSON.parse(savedCartItems) : []);
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
  }, []);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [cartItems, wishlist, userProfile]);

  // Добавление товара в корзину
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    showNotification(`Товар "${product.name}" добавлен в корзину!`);
  };

  // Обновление количества товара в корзине
  const updateCartItemQuantity = (id, delta) => {
    setCartItems(prevCartItems =>
      prevCartItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) } // Обновление количества с минимальным значением 1
          : item
      )
    );
  };

  // Удаление товара из корзины
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    showNotification('Товар удалён из корзины.');
  };

  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
    showNotification('Корзина очищена.');
  };

  // Добавление товара в избранное
  const addToWishlist = (product) => {
    // Проверяем, есть ли уже такой товар в избранном с учетом всех уникальных характеристик, например, id и size
    if (!wishlist.find(item => item.id === product.id && item.size === product.size)) {
      setWishlist([...wishlist, product]);
      showNotification(`Товар "${product.name}" добавлен в избранное!`);
    } else {
      showNotification(`Товар "${product.name}" уже в избранном!`);
    }
  };

  // Удаление товара из избранного
  const removeFromWishlist = (id, size) => {
    setWishlist(wishlist.filter(item => item.id !== id || item.size !== size)); // Удаляем товар с учетом id и size
    showNotification('Товар удалён из избранного.');
  };

  // Показ уведомлений
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Скрыть уведомление через 3 секунды
  };

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  // Обработчик выхода из профиля
  const handleLogout = () => {
    // Удаляем профиль пользователя из состояния и localStorage
    setUserProfile(null);
    localStorage.removeItem('userProfile');
    showNotification('Вы успешно вышли из аккаунта.');
  };

  // Проверка, авторизован ли пользователь
  const isUserLoggedIn = !!userProfile;

  return (
    <Router>
      <div className="header">
        <h1 style={{ textAlign: 'center' }}>Магазин одежды и обуви</h1>
        <div className="navigation">
          <Link to="/">Главная</Link>
          <Link to="/cart">Корзина</Link>
          <Link to="/wishlist">Избранное</Link>
          <Link to="/store-info">Информация о магазине</Link>
          {isUserLoggedIn ? (
            <>
              <Link to="/profile">Профиль</Link>
              <button onClick={handleLogout} className="logout-button">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </div>
      {notification && (
        <Notification message={notification} onClose={() => setNotification('')} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Поиск по товарам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="category-buttons">
                <button onClick={() => setSelectedCategory('Все')}>Все</button>
                <button onClick={() => setSelectedCategory('Одежда')}>Одежда</button>
                <button onClick={() => setSelectedCategory('Обувь')}>Обувь</button>
              </div>
              <div className="container">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    addToWishlist={addToWishlist}
                  />
                ))}
              </div>
            </div>
          }
        />
        <Route
          path="/product/:id"
          element={<ProductDetail products={products} addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              showNotification={showNotification}
              onOrderComplete={handleOrderComplete} // Передаем функцию
              updateCartItemQuantity={updateCartItemQuantity} // Передаем функцию
            />
          }
        />
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} />}
        />
        <Route
          path="/store-info"
          element={<StoreInfo />}
        />
        <Route
          path="/profile"
          element={
            userProfile ? (
              <UserProfile userProfile={userProfile} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={<LoginForm setUserProfile={setUserProfile} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/admin"
          element={<AdminPanel />}
        />
      </Routes>
    </Router>
  );
};

export default App;
