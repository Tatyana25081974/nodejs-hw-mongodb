// 1. Імпортуємо бібліотеки
import express from 'express';       // Express — фреймворк для створення сервера
import cors from 'cors';             // CORS — дозволяє іншим сайтам надсилати запити
import pinoHttp from 'pino-http';    // Pino — виводить лог кожного запиту в консоль

// 2. Створюємо функцію setupServer
export const setupServer = () => {
  const app = express(); // створення екземпляру сервера

  // 3. Підключення middleware
  app.use(cors());        // Дозволяє запити з будь-якого джерела
  app.use(pinoHttp());    // Лог кожного запиту 
  // 4. Обробка невідомих маршрутів
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });  // Якщо немає такого шляху — повертаємо 404
  });

  // 5. Отримуємо порт зі змінної оточення або 3000
  const PORT = process.env.PORT || 3000;

  // 6. Запускаємо сервер
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
