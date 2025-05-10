// src/index.js
import dotenv from 'dotenv';
dotenv.config(); //зчитує .env файл  і додає всі змінні, що в ньому, до process.env

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

async function bootstrap() {
  await initMongoConnection();
  setupServer(); 
}

bootstrap();
