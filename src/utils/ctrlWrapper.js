export const ctrlWrapper = (controller) => {
    return async (req, res, next) => {
      try {
        await controller(req, res);
      } catch (err) {
        next(err); // передаємо помилку далі
      }
    };
};
  
// Якщо в контролері виникла помилка — вона потрапить в catch, і вона передається далі

// А Express вже передасть її у  errorHandler.