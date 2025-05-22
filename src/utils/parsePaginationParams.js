const parseNumber = (number, defaultValue) => {
    const isString = typeof number === 'string';
    if (!isString) return defaultValue;
  
    const parsedNumber = parseInt(number); //перетворюємо рядок в число
    if (Number.isNaN(parsedNumber)) { //якщо не число → повертаємо запасне значення.


      return defaultValue;
    }
  
    return parsedNumber;
};
  
export const parsePaginationParams = (query) => {
    const { page, perPage } = query;
  
    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(perPage, 10);
  
    return {
      page: parsedPage,
      perPage: parsedPerPage,
    };
  };