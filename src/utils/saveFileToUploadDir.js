import path from 'node:path'; //path — модуль для роботи з файлами й шляхами у файловій системі (склеює шляхи без помилок).
import fs from 'node:fs/promises';//fs/promises — модуль для роботи з файлами через async/await (наприклад, читати, писати, переміщати файли).
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';//функція, яка читає значення з .env

//Експортується функція, яка приймає об'єкт file (файл, який передав multer).
// src/utils/saveFileToUploadDir.js



export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};

  

//Приймає файл із multer

//Переміщує файл у потрібну папку

//Повертає готову URL-адресу, яку можна зберегти в базу або віддати клієнту

