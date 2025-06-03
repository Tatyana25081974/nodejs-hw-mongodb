// Імпортуємо бібліотеку Nodemailer — для надсилання електронної пошти
import nodemailer from 'nodemailer';

// Імпортуємо обʼєкт SMTP, де зберігаються назви змінних середовища (ключі)
import { SMTP } from '../constants/index.js';

// Імпортуємо утиліту для безпечного доступу до змінних середовища (.env)
import { getEnvVar } from '../utils/getEnvVar.js';

//Налаштування SMTP-транспорту:

const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST), // адреса SMTP-сервера (наприклад, smtp-relay.brevo.com)
    port: Number(getEnvVar(SMTP.SMTP_PORT)), // порт (465 або 587)
    auth: {
      user: getEnvVar(SMTP.SMTP_USER), // логін (часто = email)
      pass: getEnvVar(SMTP.SMTP_PASSWORD), // пароль або API-ключ
    },
});
  
export const sendEmail = async (options) => {
    return await transporter.sendMail(options);
  };
  