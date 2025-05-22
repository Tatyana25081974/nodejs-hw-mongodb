import Joi from 'joi';



// Схема для створення контакту
export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Поле "name" має бути рядком',
    'string.empty': 'Поле "name" не може бути порожнім',
    'string.min': 'Поле "name" повинно містити щонайменше {#limit} символи',
    'string.max': 'Поле "name" повинно містити не більше ніж {#limit} символів',
    'any.required': 'Поле "name" є обов’язковим',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Поле "phoneNumber" має бути рядком',
    'string.empty': 'Поле "phoneNumber" не може бути порожнім',
    'string.min': 'Поле "phoneNumber" повинно містити щонайменше {#limit} символи',
    'string.max': 'Поле "phoneNumber" повинно містити не більше ніж {#limit} символів',
    'any.required': 'Поле "phoneNumber" є обов’язковим',
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.email': 'Поле "email" повинно містити валідну email-адресу',
    'string.min': 'Поле "email" повинно містити щонайменше {#limit} символи',
    'string.max': 'Поле "email" повинно містити не більше ніж {#limit} символів',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Поле "isFavourite" має бути булевим значенням',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
    'any.only': 'Поле "contactType" повинно бути одним з: work, home, personal',
    'any.required': 'Поле "contactType" є обов’язковим',
  }),
});

// Схема для оновлення контакту
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Поле "name" має бути рядком',
    'string.min': 'Поле "name" повинно містити щонайменше {#limit} символи',
    'string.max': 'Поле "name" повинно містити не більше ніж {#limit} символів',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Поле "phoneNumber" має бути рядком',
    'string.min': 'Поле "phoneNumber" повинно містити щонайменше {#limit} символи',
    'string.max': 'Поле "phoneNumber" повинно містити не більше ніж {#limit} символів',
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.email': 'Поле "email" повинно містити валідну email-адресу',
    'string.min': 'Поле "email" повинно містити щонайменше {#limit} символи',
    'string.max': 'Поле "email" повинно містити не більше ніж {#limit} символів',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Поле "isFavourite" має бути булевим значенням',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Поле "contactType" повинно бути одним з: work, home, personal',
  }),
}).min(1).messages({
  'object.min': 'Потрібно вказати хоча б одне поле для оновлення',
});


const dataToValidate = {
    name: 'A', 
    phoneNumber: '123',
    email: 'invalid-email',
    isFavourite: 'yes', // помилка — має бути boolean
    contactType: 'friend', // не з enum
  };
  
  // Перевірка за схемою
  const validationResult = createContactSchema.validate(dataToValidate, {
    abortEarly: false, // Показує всі помилки
  });
  
  // результат
  if (validationResult.error) {
    console.error('Validation errors:');
    validationResult.error.details.forEach((err) => {
      console.error(`→ ${err.message}`);
    });
  } else {
    console.log('✅ Data is valid!');
  }
  