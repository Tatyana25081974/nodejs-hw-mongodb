// src/controllers/contactsController.js
import createError from 'http-errors'; // для формування помилок
import { fetchAllContacts, fetchContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';



export const getAllContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await fetchAllContacts({
    page,
    perPage,
    sortBy,
  sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await fetchContactById(contactId);

  if (!contact) {
    // Якщо не знайдено — кидаємо помилку, яка піде в errorHandler
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
export const createContactController = async (req, res) => {
  const contact = await createContact(req.body); 

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};


export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;

  //  Перевірка: чи щось передано для оновлення
  if (Object.keys(req.body).length === 0) {
    throw createError(400, 'No data provided for update');
  }

  // 🔄 Оновлюємо контакт
  const updatedContact = await updateContact(contactId, req.body);

  //  Якщо не знайдено
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  //  Відповідь у разі успіху
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params; 

  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send(); // No Content
};

