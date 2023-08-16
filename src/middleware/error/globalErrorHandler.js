export const globalErrorHandler = () => {
  return (error, req, res, next) => {
    const status = error.statusCode || 500;

    res.status(status).json({
      status: "failed",
      message: error.message,
      error,
    });
  };
};
