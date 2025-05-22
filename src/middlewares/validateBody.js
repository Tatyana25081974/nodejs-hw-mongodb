import createHttpError from 'http-errors';

export const validateBody = (schema) => {//  приймає схему а повертає міделвар
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body, {   //schema.validateAsync(...)	асинхронно перевіряє req.body
          abortEarly: false,  //показує всі помилки, а не першу
        });
        next(); // якщо валідація успішна  перейти до наступного етапу (зазвичай до контролера).
      } catch (err) {
        // створення помилки з деталями
        const error = createHttpError(400, 'Bad Request');
        error.details = err.details; // додаємо масив помилок у .details
        next(error); //передаємо помилку в error handler
      }
    };
};