import jwt from "jsonwebtoken";

export const generateAuthToken = (userId, name) => {
  return jwt.sign({ id: userId, name }, process.env.SECRET_KEY);
};
