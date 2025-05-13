export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
  
    res.status(status).json({
      status,
      message: 'Something went wrong',
      data: err.message,
    });
  };
  
  
  //універсальний обробник помилок. Викликається, коли в next(err) передано помилку.