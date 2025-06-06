// завантаження файлу у хмару Cloudinary
// Імпортуємо бібліотеку Cloudinary
import cloudinary from 'cloudinary';

// Імпортуємо модуль для роботи з файлами (щоб потім видалити тимчасовий файл)
import fs from 'node:fs/promises';

// Імпортуємо утиліту для отримання змінних з .env
import { getEnvVar } from './getEnvVar.js';

// Імпортуємо об’єкт з ключами cloud_name, api_key, api_secret
import { CLOUDINARY } from '../constants/index.js';

//Налаштування доступу до Cloudinary:

cloudinary.v2.config({
    secure: true, // Завантаження через HTTPS
    cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME), // наприклад 'my-cloud'
    api_key: getEnvVar(CLOUDINARY.API_KEY),       // твій публічний ключ
    api_secret: getEnvVar(CLOUDINARY.API_SECRET), // секретний ключ
  });
  
  export const saveFileToCloudinary = async (file) => {
    // Завантажуємо тимчасовий файл у Cloudinary
    const response = await cloudinary.v2.uploader.upload(file.path);
  
    // Видаляємо файл із диску 
    await fs.unlink(file.path);
  
    // Повертаємо посилання на зображення (https URL)
    return response.secure_url;
  };
  
