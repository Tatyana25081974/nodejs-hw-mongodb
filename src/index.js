// src/index.js

// src/index.js
import dotenv from 'dotenv';
dotenv.config(); // Завантажує .env змінні в process.env

import { initMongoConnection } from './db/initMongoConnection.js'; // якщо саме така у тебе функція
import { setupServer } from './server.js'; // твоя назва

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

async function bootstrap() {
  await initMongoConnection(); // підключення до MongoDB
  await createDirIfNotExists(TEMP_UPLOAD_DIR); // створити тимчасову папку, якщо нема
  await createDirIfNotExists(UPLOAD_DIR); // створити постійну папку, якщо нема
  setupServer(); // запуск сервера
}

bootstrap();