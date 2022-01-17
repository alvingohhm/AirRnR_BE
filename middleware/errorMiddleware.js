const errorMiddleware = {
  notFound: (req, res, next) => {
    const error = new Error(`${req.originalUrl} - Not Found`);
    res.status(404);
    next(error);
  },

  errorHandler: (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      status: "failed",
      msg: error.message,
      stack: process.env.NODE_ENV !== "production" ? error.stack : null,
    });
  },
};

module.exports = errorMiddleware;
