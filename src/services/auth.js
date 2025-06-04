import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
// Імпортуємо бібліотеку для роботи з JWT-токенами (JSON Web Token)
import jwt from 'jsonwebtoken';

// Імпортуємо обʼєкт із назвами змінних для SMTP (наприклад, SMTP_FROM)
import { SMTP } from '../constants/index.js';

// Імпортуємо функцію, яка дозволяє безпечно отримувати значення змінних із .env
import { getEnvVar } from '../utils/getEnvVar.js';

// Імпортуємо функцію надсилання листа
import { sendEmail } from '../utils/sendMail.js';
// Імпортуємо шаблонізатор Handlebars
import handlebars from 'handlebars';

// Імпортуємо модуль для роботи з шляхами
import path from 'node:path';

// Імпортуємо модуль для асинхронної роботи з файловою системою
import fs from 'node:fs/promises';
// Імпортуємо константу для базової директорії шаблонів
import { TEMPLATES_DIR } from '../constants/index.js';





export const registerUser = async (payload) => {
    //Перевіряємо , чи є в базі користувач з таким емейл
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

//хешуємо пароль 
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    //  Створюємо нового користувача
  
    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};
export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });//знаходимо користувача
    if (!user) {
      throw createHttpError(404, 'User not found');
    } 
    const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів
  
    if (!isEqual) {
      throw createHttpError(401, 'Unauthorized');
    }
    await SessionsCollection.deleteOne({ userId: user._id });
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
  
    return await SessionsCollection.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};
export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => { //Це функція-шаблон для генерації сесії
    const accessToken = randomBytes(30).toString('base64');//randomBytes(30) — генерує випадкові токени,.toString('base64') — перетворює їх у зручний для зберігання рядок
    const refreshToken = randomBytes(30).toString('base64');
  
    return {
      accessToken,//токен для доступу
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), 
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
  };
  
  export const refreshUsersSession = async ({ sessionId, refreshToken }) => { //приймає sessionId та refreshToken із cookies або запиту.
    const session = await SessionsCollection.findOne({ //шукаємо сесію з конкретним ID та вірним токеном
      _id: sessionId,
      refreshToken,
    });
  // якщо сесія не знайдена 
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }
  // перевіряємо чи токен вже недійсний 
    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil); //Якщо теперішній час більше → токен вже недійсний
  
    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }
    //Створюємо нову сесію
    const newSession = createSession(); //Генеруємо новий access/refresh токени з новими датами
    // Видаляємо стару сесію
    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  // Зберігаємо нову сесію
    return await SessionsCollection.create({
      userId: session.userId,
      ...newSession,
    });
};

// Надсилання токена для скидання пароля
export const requestResetToken = async (email) => {
  // // Шукаємо користувача за email в базі даних
  const user = await UsersCollection.findOne({ email });
  // Якщо користувача не знайдено — кидаємо помилку 404
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  //Генеруємо JWT-токен
  const token = jwt.sign(
    {
      sub: user._id,   // sub (subject) — ідентифікатор користувача
      email,           // додатково додаємо email у токен
    },
    getEnvVar('JWT_SECRET'), // секретний ключ (з .env)
    {
      expiresIn: '5m', // токен дійсний 5 хвилин
    },
  );
  // Формуємо абсолютний шлях до HTML-шаблону листа
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR, // базова директорія шаблонів
    'reset-password-email.html', // назва конкретного шаблону
  );

  // Зчитуємо вміст шаблону з HTML-файлу у вигляді тексту
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString(); // перетворюємо Buffer у текст (HTML)

  // Компілюємо HTML-шаблон у функцію, яка приймає динамічні дані
  const template = handlebars.compile(templateSource);

  // Викликаємо шаблон, підставляючи змінні name та link
  const html = template({
    name: user.name, // привітання в листі
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`, // посилання з токеном
  });

  console.log('📨 Email preview:');
console.log({
  from: getEnvVar(SMTP.SMTP_FROM),
  to: email,
  subject: 'Reset your password',
  html,
});

 // Відправляємо email з відновленням паролю
 await sendEmail({
  from: getEnvVar(SMTP.SMTP_FROM), // від кого (з .env)
  to: email,                       // кому
  subject: 'Reset your password', // тема листа
  html,                           // html-тіло, згенероване шаблонізатором
});
};


//зміни пароля після переходу за email-посиланням
export const resetPassword = async (payload) => {
  let entries;

  try {
    // Перевіряємо токен на валідність та розшифровуємо його
    // Витягуємо з нього email і sub (user._id)
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    // Якщо токен недійсний або прострочений — повертаємо помилку 401
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  // Шукаємо користувача за email та ID, витягнутими з токена
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  // Якщо користувача не знайдено — повертаємо помилку 404
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Хешуємо новий пароль
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // Оновлюємо пароль користувача в базі даних
  await UsersCollection.updateOne(
    { _id: user._id }, // Знаходимо користувача за ID
    { password: encryptedPassword }, // Оновлюємо його пароль
  );
};



  
  
  //refreshUsersSession обробляє запит на оновлення сесії користувача, перевіряє наявність і термін дії існуючої сесії, генерує нову сесію та зберігає її в базі даних.