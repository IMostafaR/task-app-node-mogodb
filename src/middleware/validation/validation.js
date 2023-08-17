import { AppError } from "../../utils/error/appError.js";
import jwt from "jsonwebtoken";

const httpHeaderFields = ["token"];

export const validation = (schema) => {
  return (req, res, next) => {
    const requestData = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    httpHeaderFields.forEach((field) => {
      if (req.headers.hasOwnProperty(field)) {
        if (field == "token") {
          const decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
          requestData.loggedInUser = decoded.id;
          requestData.token = req.headers.token;
        }
      }
    });

    const { error } = schema.validate(requestData, { abortEarly: false });

    error && next(new AppError(error.message, 400));

    next();
  };
};
