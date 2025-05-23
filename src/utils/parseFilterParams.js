const parseContactType = (type) => {
    const allowedTypes = ['home', 'work', 'personal'];
    const normalizedType = typeof type === 'string' ? type.toLowerCase() : '';
    return allowedTypes.includes(normalizedType) ? normalizedType : undefined;
  };
  
  const parseIsFavourite = (isFavourite) => {
    if (isFavourite === 'true') return true;
    if (isFavourite === 'false') return false;
    return undefined;
  };
  
  export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;
  
    const parsedType = parseContactType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);
  
    return {
      contactType: parsedType,
      isFavourite: parsedIsFavourite,
    };
  };
  