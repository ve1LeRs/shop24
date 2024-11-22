const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const productRoutes = require('./routes/products'); // Импорт маршрутов для товаров

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе данных MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Подключение к базе данных успешно!'))
  .catch((err) => {
    console.error('Ошибка подключения к базе данных:', err);
    process.exit(1);
  });

// Схема пользователя
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  orders: [
    {
      id: Number,
      date: String,
      items: [
        { productId: String, name: String, price: Number, quantity: Number },
      ],
      total: Number,
    },
  ],
});

const User = mongoose.model('User', userSchema);

// Middleware для проверки токена
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('Запрос без токена');
    return res.status(401).json({ message: 'Нет токена, доступ запрещён' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Токен успешно декодирован:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Ошибка проверки токена:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Срок действия токена истёк' });
    }
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('Регистрация пользователя с email:', email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('Пользователь зарегистрирован:', newUser);
    res.status(201).json({ message: 'Пользователь зарегистрирован успешно' });
  } catch (error) {
    console.error('Ошибка при регистрации:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
});

// Вход в систему
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Попытка входа с email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Пользователь не найден:', email);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Неверный пароль для пользователя:', email);
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Пользователь успешно вошёл:', user._id);
    res.json({ token });
  } catch (error) {
    console.error('Ошибка при авторизации:', error.message);
    res.status(500).json({ message: 'Ошибка при авторизации' });
  }
});

// Обновление токена
app.post('/api/refresh-token', authMiddleware, (req, res) => {
  try {
    console.log('Обновление токена для пользователя:', req.user.userId);
    const newToken = jwt.sign(
      { userId: req.user.userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token: newToken });
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error.message);
    res.status(500).json({ message: 'Ошибка при обновлении токена' });
  }
});

// Получение профиля
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    console.log('Загрузка профиля для пользователя:', req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.log('Профиль не найден для пользователя:', req.user.userId);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error.message);
    res.status(500).json({ message: 'Ошибка при загрузке профиля' });
  }
});

// Создание заказа
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, total } = req.body;

  try {
    console.log('Создание заказа для пользователя:', req.user.userId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('Пользователь не найден при создании заказа:', req.user.userId);
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const newOrder = {
      id: user.orders.length + 1,
      date: new Date().toLocaleDateString(),
      items,
      total,
    };

    user.orders.push(newOrder);
    await user.save();
    console.log('Заказ успешно создан:', newOrder);
    res.status(201).json({ message: 'Заказ успешно создан', order: newOrder });
  } catch (error) {
    console.error('Ошибка при создании заказа:', error.message);
    res.status(500).json({ message: 'Ошибка при создании заказа' });
  }
});

// Подключение маршрутов для товаров
app.use('/api/products', (req, res, next) => {
  console.log('Обращение к маршруту /api/products');
  next();
}, productRoutes);

// Запуск сервера
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Сервер работает на http://localhost:${port}`));
