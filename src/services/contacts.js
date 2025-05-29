// src/services/contacts.js
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { Contact } from '../db/models/contactModel.js';
import { SORT_ORDER } from '../constants/index.js';

// Повертає всі документи
export const fetchAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {

  const limit = perPage; //кількість контактів на сторінці 
  const skip = page > 0 ? (page - 1) * perPage : 0;// кількість контактів,які треба пропустити 

  // Створюємо базовий запит
  const contactsQuery = Contact.find({ userId });
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  } //фільтруємо контакти за типом 
  
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  } //фільтруємо контакти за значенням isFavourite


  // Підраховуємо кількість, використовуючи merge з тим же запитом
  //const totalItems = await Contact.find()
   // .merge(contactsQuery) //використовуємо попередній запит 
    //.countDocuments();//підраховуємо кількість документів

  // Отримуємо тільки ті контакти, які потрібні на цій сторінці
  //const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
  
  const [totalItems, contacts] = await Promise.all([
    Contact.find({ userId }).merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);
  

  // Обраховуємо додаткові поля для відповіді
  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};


// Повертає об'єкт контакту по ID або null
export const fetchContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

// Створює новий контакт 
export const createContact = async (payload) => { //payload — це тіло запиту, яке прийде з Postman або фронтенду:
  const contact = await Contact.create(payload); //створюємо новий контакт  і повертаємо його
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId }, // умова: тільки контакт, що належить користувачу
    payload,
    {
      new: true,           // повертає оновлений документ
      runValidators: true // перевіряє дані згідно з contactSchema
    }
  );

  return updatedContact; // якщо null → контролер згенерує 404
};

export const deleteContact = async (id, userId) => {
  const deleted = await Contact.findOneAndDelete({ _id: id, userId });
  return deleted;
};

