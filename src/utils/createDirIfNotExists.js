// src/utils/createDirIfNotExists.js

import fs from 'node:fs/promises';

// Функція для створення директорії  якщо її ще не існує.
export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url); //перевіряє, чи існує директорія (або файл) за вказаним шляхом url.
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(url); // створюємо її.
    }
  }
};
