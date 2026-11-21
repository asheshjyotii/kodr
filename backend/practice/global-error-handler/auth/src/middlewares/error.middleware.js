const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  let statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorMiddleware;
