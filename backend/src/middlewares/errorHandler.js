const errorHandler = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Something went wrong",
  });
};

export default errorHandler;
