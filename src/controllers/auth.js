import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { logoutUser } from '../services/auth.js';
import { refreshUsersSession } from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import createHttpError from 'http-errors'; // Імпортуємо createHttpError — для створення HTTP-помилок зі статусом 

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
export const loginUserController = async (req, res) => { 
    const session = await loginUser(req.body); //викликає функцію loginUser, передаючи їй тіло запиту (req.body)
  
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    }); // встановлює кукі
  
    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
};
export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }
  
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
  
    res.status(204).send();
};
const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
  };
  
  export const refreshUserSessionController = async (req, res) => {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });
  
    setupSession(res, session);
  
    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
};

// Контролер для POST /auth/request-reset-email
export const requestResetEmailController = async (req, res) => {
  // 1️⃣ Отримуємо email користувача з тіла запиту
  const { email } = req.body;

  try {
    // 2️⃣ Викликаємо сервіс, який:
    //    - перевіряє, чи існує користувач із цим email
    //    - створює JWT-токен зі строком життя 5 хв
    //    - надсилає email з посиланням на скидання паролю
    await requestResetToken(email);

    // 3️⃣ Якщо все пройшло успішно — повертаємо відповідь 200
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {}, // Тіло відповіді порожнє, як вимагається у ТЗ
    });

  } catch (error) {
    // 4️⃣ Якщо помилка — користувача не знайдено (requestResetToken кидає 404)
    if (error.status === 404) throw error; // Прокидаємо далі — обробить ctrlWrapper

    // 5️⃣ Якщо сталася будь-яка інша помилка (наприклад, не вдалося надіслати листа)
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

