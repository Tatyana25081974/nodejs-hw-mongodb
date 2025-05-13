// 1. Імпортуємо бібліотеки
import express from 'express';       // Express — фреймворк для створення сервера
import cors from 'cors';             // CORS — дозволяє іншим сайтам надсилати запити
import pinoHttp from 'pino-http';    // Pino — виводить лог кожного запиту в консоль
import contactsRoutes from './routes/contactsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';


// 2. Створюємо функцію setupServer
export const setupServer = () => {
  const app = express(); // створення екземпляру сервера

  // 3. Підключення middleware
  app.use(cors());        // Дозволяє запити з будь-якого джерела
  app.use(pinoHttp());    // Лог кожного запиту
  app.use(express.json()); //парсінг тіла запиту
  
  app.use('/contacts', contactsRoutes);//маршрути контактів
//4. підключення обробників помилок
  
  // 4. Підключення обробників помилок
app.use(notFoundHandler);  // ловить 404
app.use(errorHandler);     // ловить все інше


  // 5. Отримуємо порт зі змінної оточення або 3000
  const PORT = process.env.PORT || 3000;

  // 6. Запускаємо сервер
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
