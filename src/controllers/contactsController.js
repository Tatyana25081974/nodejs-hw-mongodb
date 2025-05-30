// src/controllers/contactsController.js
import createError from 'http-errors'; // для формування помилок
import { fetchAllContacts, fetchContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';




export const getAllContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await fetchAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; // витягуємо userId з токена

  const contact = await fetchContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contactData = {
    ...req.body,
    userId: req.user._id,
  }; //обʼєднання даних з форми + userId з токена, яке ми надсилаємо в базу.

  const contact = await createContact(contactData); 

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const updateContactController = async (req, res, next) => {
  //Отримуємо ID контакта з параметрів запиту
  const { contactId } = req.params;

  // Перевірка: чи передано хоча б одне поле для оновлення
  if (Object.keys(req.body).length === 0) {
    throw createError(400, 'No data provided for update'); //  Якщо тіло порожнє, кидаємо помилку
  }

  //  Видаляємо поле userId, якщо воно раптом прийшло в тілі запиту.захист: користувач не може вплинути на userId
  if ('userId' in req.body) {
    delete req.body.userId;
  }

  //  Отримуємо userId із токена (автентифікації) через middleware authenticate
  const userId = req.user._id;

  //  Оновлюємо контакт через сервісну функцію.
  // Передаємо ID контакта, userId (для перевірки приналежності), і самі оновлення
  const updatedContact = await updateContact(contactId, req.body, userId);

  //  Якщо контакт не знайдено або він не належить цьому користувачу
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  // ✅ Якщо оновлення успішне — повертаємо відповідь
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};
export const deleteContactController = async (req, res) => {
  //  Отримуємо contactId з параметрів маршруту
  const { contactId } = req.params;

  // Отримуємо userId з req.user, який middleware authenticate додав з access-токена
  const userId = req.user._id;

  // Видаляємо лише той контакт, який належить цьому користувачу
  const deletedContact = await deleteContact(contactId, userId);

  // Якщо контакт не знайдено або він чужий
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  // Успішно видалено — повертаємо 204 No Content (без тіла відповіді)
  res.status(204).send();
};
