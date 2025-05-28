import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';


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
  
  //refreshUsersSession обробляє запит на оновлення сесії користувача, перевіряє наявність і термін дії існуючої сесії, генерує нову сесію та зберігає її в базі даних.