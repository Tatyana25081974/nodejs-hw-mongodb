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
