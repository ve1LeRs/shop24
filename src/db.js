const mongoose = require('mongoose');

// Подключение к MongoDB Atlas
const uri = 'mongodb+srv://alekseydorokhin:<db_password>@shop1.3y4cd.mongodb.net/?retryWrites=true&w=majority&appName=shop1';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Подключение к базе данных успешно');
  })
  .catch((err) => {
    console.error('Ошибка подключения к базе данных', err);
  });
