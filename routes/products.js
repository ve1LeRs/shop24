const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const router = express.Router();

// Получение всех товаров
router.get('/', async (req, res) => {
  try {
    console.log('Запрос на получение всех товаров');
    const products = await Product.find();
    console.log('Товары получены:', products);
    res.json(products);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error.message);
    res.status(500).json({ message: 'Ошибка при получении товаров' });
  }
});

// Добавление нового товара
router.post('/', async (req, res) => {
  try {
    console.log('Запрос на добавление товара с данными:', req.body);
    const { name, description, price, image, category, size, stock } = req.body;

    // Проверка обязательных полей
    if (!name || !description || !price || !image || !category) {
      console.warn('Некорректные данные для добавления товара');
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
    }

    const newProduct = new Product({ name, description, price, image, category, size, stock });
    const savedProduct = await newProduct.save();
    console.log('Товар добавлен успешно:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Ошибка при добавлении товара:', error.message);
    res.status(400).json({ message: 'Ошибка при добавлении товара' });
  }
});

// Редактирование товара
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Запрос на редактирование товара с ID:', id);

    // Проверка, является ли ID допустимым
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn('Некорректный ID для редактирования:', id);
      return res.status(400).json({ message: 'Некорректный ID' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      console.warn('Товар с указанным ID не найден:', id);
      return res.status(404).json({ message: 'Товар не найден' });
    }

    console.log('Товар успешно обновлён:', updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Ошибка при редактировании товара:', error.message);
    res.status(400).json({ message: 'Ошибка при редактировании товара' });
  }
});

// Удаление товара
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Запрос на удаление товара с ID:', id);

    // Проверка, является ли ID допустимым
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn('Некорректный ID для удаления:', id);
      return res.status(400).json({ message: 'Некорректный ID' });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      console.warn('Товар с указанным ID не найден для удаления:', id);
      return res.status(404).json({ message: 'Товар не найден' });
    }

    console.log('Товар успешно удалён:', deletedProduct);
    res.json({ message: 'Товар успешно удалён', deletedProduct });
  } catch (error) {
    console.error('Ошибка при удалении товара:', error.message);
    res.status(400).json({ message: 'Ошибка при удалении товара' });
  }
});

module.exports = router;
