// utils/userUtils.js
export const addOrderToUserHistory = (order) => {
  const storedUserProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

  // Обновляем историю заказов
  const updatedOrders = storedUserProfile.orders ? [...storedUserProfile.orders, order] : [order];

  // Обновляем профиль пользователя с добавленным заказом
  const updatedProfile = {
    ...storedUserProfile,
    orders: updatedOrders,
  };

  // Сохраняем обновленный профиль в localStorage
  localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
};
