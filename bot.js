const TelegramBot = require('node-telegram-bot-api');

// Токен твоего бота
const token = '7792467368:AAHYounzAxjP5JQ4x-PD8XoebWZ_0Njzo_c';
const bot = new TelegramBot(token, { polling: true });

// URL твоего мини-приложения
const siteUrl = 'http://localhost:3000/'; // Замени на актуальный URL

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Отправляем приветственное сообщение с Web App кнопкой в меню
  bot.sendMessage(chatId, 'Нажми на кнопку ниже, чтобы открыть магазин:', {
    reply_markup: {
      keyboard: [
        [{
          text: 'Открыть магазин',  // Текст кнопки
          web_app: { url: siteUrl }  // Web App кнопка с URL сайта
        }]
      ],
      resize_keyboard: true, // Изменяем размер клавиатуры
      one_time_keyboard: true // Показываем кнопку только один раз
    }
  });
});
