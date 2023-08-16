import { AppError } from "../../utils/error/appError.js";
import jwt from "jsonwebtoken";

export const validation = (schema) => {
  return (req, res, next) => {
    const requestData = {};
    if (Object.keys(req.body).length) {
      Object.assign(requestData, req.body);
    }
    if (req.headers.token) {
      const decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
      requestData.loggedInUser = decoded.id;
      requestData.token = req.headers.token;
    }

    if (Object.keys(req.params).length) {
      Object.assign(requestData, req.params);
    }

    const { error } = schema.validate(requestData, { abortEarly: false });

    error && next(new AppError(error.message, 403));

    next();
  };
};
