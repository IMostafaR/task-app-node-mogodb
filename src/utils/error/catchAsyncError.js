export const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.json({
        status: "Failed",
        message: error.message,
        error,
        stack: error.stack,
      });
    });
  };
};
