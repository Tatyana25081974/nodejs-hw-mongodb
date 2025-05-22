// src/services/contacts.js
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { Contact } from '../models/contactModel.js';

// Повертає всі документи
export const fetchAllContacts = async ({ page, perPage }) => {
  const limit = perPage; //кількість контактів на сторінці 
  const skip = (page - 1) * perPage;//кількість контактів які потрібно пропустити 

  // Створюємо базовий запит
  const contactsQuery = Contact.find();

  // Підраховуємо кількість, використовуючи merge з тим же запитом
  const totalItems = await Contact.find()
    .merge(contactsQuery) //використовуємо попередній запит 
    .countDocuments();//підраховуємо кількість документів

  // Отримуємо тільки ті контакти, які потрібні на цій сторінці
  const contacts = await contactsQuery.skip(skip).limit(limit).exec();

  // Обраховуємо додаткові поля для відповіді
  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
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
