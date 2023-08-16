import Joi from "joi";

export const userValidator = {
  signupSchema: Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^[A-Z][A-Za-z0-9]{7,15}$/)
      .required(),
    repeat_password: Joi.string().valid(Joi.ref("password")).required(),
    age: Joi.number().min(5).max(100),
    gender: Joi.string().valid("male", "female").required(),
    phone: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .required(),
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^[A-Z][A-Za-z0-9]{7,15}$/)
      .required(),
  }),

  verifyEmailSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
  }),

  changePasswordSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
    oldPassword: Joi.string()
      .pattern(/^[A-Z][A-Za-z0-9]{7,15}$/)
      .required(),
    newPassword: Joi.string()
      .pattern(/^[A-Z][A-Za-z0-9]{7,15}$/)
      .required(),
  }),

  updateUserSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
    firstName: Joi.string().min(3).max(20),
    lastName: Joi.string().min(3).max(20),
    age: Joi.number().min(5).max(100),
  }),

  deleteUserSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
  }),

  deactivateUserSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
  }),

  logoutSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
  }),
};
