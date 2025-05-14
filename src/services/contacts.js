// src/services/contacts.js

import { Contact } from '../models/contactModel.js';

// Повертає всі документи
export const fetchAllContacts = async () => {
  return await Contact.find();
};

// Повертає об'єкт контакту по ID або null
export const fetchContactById = async (id) => {
  return await Contact.findById(id);
};

// Створює новий контакт 
export const createContact = async (payload) => { //payload — це тіло запиту, яке прийде з Postman або фронтенду:
  const contact = await Contact.create(payload); //створюємо новий контакт  і повертаємо його
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,           // повертає оновлений документ
      runValidators: true // перевіряє дані згідно з contactSchema
    }
  );

  return updatedContact; // якщо null → контролер згенерує 404
};

export const deleteContact = async (id) => {
  const deleted = await Contact.findByIdAndDelete(id);
  return deleted;
};
