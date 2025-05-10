// src/controllers/contactsController.js

import { fetchAllContacts, fetchContactById } from '../services/contacts.js'; // Імпортуємо функцію, яка читає з БД

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await fetchAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params; // отримаємо contactId з URL
    const contact = await fetchContactById(contactId); // шукаємо в базі

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
};
