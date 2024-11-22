import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    size: '',
    stock: '',
  });
  const [editingProductId, setEditingProductId] = useState(null); // ID редактируемого товара

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Загрузка товаров...');
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Ошибка загрузки товаров');
        }
        const data = await response.json();
        console.log('Получены товары:', data);
        setProducts(data);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      console.log('Сохранение товара...');
      let response;
      if (editingProductId) {
        // Редактирование товара
        response = await fetch(`http://localhost:5000/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productForm),
        });
      } else {
        // Добавление нового товара
        response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productForm),
        });
      }

      if (!response.ok) {
        throw new Error('Ошибка при сохранении товара');
      }

      const savedProduct = await response.json();
      console.log('Сохранённый товар:', savedProduct);

      if (editingProductId) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === savedProduct._id ? savedProduct : product
          )
        );
      } else {
        setProducts((prevProducts) => [...prevProducts, savedProduct]);
      }

      setProductForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        size: '',
        stock: '',
      });
      setEditingProductId(null);
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error.message);
    }
  };

  const handleEdit = (product) => {
    console.log('Редактирование товара:', product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      size: product.size,
      stock: product.stock,
    });
    setEditingProductId(product._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      console.log('Удаление товара с ID:', id);
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      console.log('Товар успешно удалён');
    } catch (error) {
      console.error('Ошибка при удалении товара:', error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название товара</label>
          <input
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea
            name="description"
            value={productForm.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Цена</label>
          <input
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Изображение</label>
          <input
            type="text"
            name="image"
            value={productForm.image}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Категория</label>
          <input
            type="text"
            name="category"
            value={productForm.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Размер</label>
          <input
            type="text"
            name="size"
            value={productForm.size}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Количество</label>
          <input
            type="number"
            name="stock"
            value={productForm.stock}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">
          {editingProductId ? 'Сохранить изменения' : 'Добавить товар'}
        </button>
      </form>

      <h3>Список товаров</h3>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.price} ₽
            <button onClick={() => handleEdit(product)}>Редактировать</button>
            <button onClick={() => handleDelete(product._id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
