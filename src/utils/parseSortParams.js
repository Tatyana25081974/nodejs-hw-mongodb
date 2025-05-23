import { SORT_ORDER } from '../constants/index.js';



const parseSortOrder = (sortOrder) => {
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
    if (isKnownOrder) return sortOrder;//Перевіряємо: чи значення входить до дозволених (asc, desc)
    return SORT_ORDER.ASC; 
  };
  
  // Перевірка, чи поле для сортування дозволене
  const parseSortBy = (sortBy) => {
    const allowedKeys = ['_id', 'name', 'phoneNumber', 'email', 'contactType', 'createdAt', 'updatedAt'];
  
    if (allowedKeys.includes(sortBy)) {
      return sortBy;
    }
  
    return '_id'; // якщо невідоме поле — сортуємо за _id
  };
  
  // Основна функція
  export const parseSortParams = (query) => {
    const { sortOrder, sortBy } = query;
  
    const parsedSortOrder = parseSortOrder(sortOrder);
    const parsedSortBy = parseSortBy(sortBy);
  
    return {
      sortOrder: parsedSortOrder,
      sortBy: parsedSortBy,
    };
  };