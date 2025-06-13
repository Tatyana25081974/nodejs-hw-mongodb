// 1. Імпортуємо бібліотеки
import express from 'express';           // Express — фреймворк для створення сервера
import cors from 'cors';                 // CORS — дозволяє крос-доменно робити запити
import pinoHttp from 'pino-http';        // Pino — для логування запитів у консоль
import cookieParser from 'cookie-parser';// Для роботи з куками

import router from './routers/index.js'; // Основний роутер (він підключає всі маршрути)
import { errorHandler } from './middlewares/errorHandler.js';       // Обробка помилок
import { notFoundHandler } from './middlewares/notFoundHandler.js'; // Обробка 404
import { UPLOAD_DIR } from './constants/index.js';                  // Шлях до папки /uploads
import { swaggerDocs } from './middlewares/swaggerDocs.js';

// 2. Створюємо та запускаємо сервер
export const setupServer = () => {
  const app = express(); // Створюємо екземпляр додатку Express

  // 3. Middleware
  app.use(cors()); // Дозволяє запити з будь-якого джерела
  app.use(pinoHttp()); // Логи всіх запитів
  app.use(express.json()); // Парсинг JSON з тіла запиту
  app.use(cookieParser()); // Куки зчитуються і зберігаються в req.cookies

  // Додаємо можливість роздавати статичні файли з папки uploads
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('/api-docs', swaggerDocs()); //підключаємо сваггер 

  // 4. Підключаємо роутер (всі маршрути, наприклад /contacts)
  app.use(router);
  

  // 5. Обробники помилок
  app.use(notFoundHandler); // 404 — якщо маршрут не знайдено
  app.use(errorHandler);    // 500 — якщо сталася помилка у коді
  
  

  // 6. Порт із .env або 3000
  const PORT = process.env.PORT || 3000;

  // 7. Запуск сервера
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
};
