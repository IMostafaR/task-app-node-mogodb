import { Router } from "express";
import { userController } from "./user.controller.js";
import { auth } from "../../middleware/auth/auth.js";
import { validation } from "../../middleware/validation/validation.js";
import { userValidator } from "./user.validator.js";

const router = Router();

// 1-signUp
router.post(
  "/signup",
  validation(userValidator.signupSchema),
  userController.signUp
);

// verify email
router.get(
  "/verify/:token",
  validation(userValidator.verifyEmailSchema),
  userController.verifyEmail
);

// 2-login-->with create token
router.post(
  "/login",
  validation(userValidator.loginSchema),
  userController.logIn
);

// 3-change password (user must be logged in)
router.put(
  "/ch-password",
  validation(userValidator.changePasswordSchema),
  auth,
  userController.changePassword
);

// 4-update user (age , firstName , lastName)(user must be logged in)
router.put(
  "/update",
  validation(userValidator.updateUserSchema),
  auth,
  userController.updateUser
);

// 5-delete user(user must be logged in)
router.delete(
  "/delete",
  validation(userValidator.deleteUserSchema),
  auth,
  userController.deleteUser
);

// 6-soft delete(user must be logged in)
router.put(
  "/deactivate",
  validation(userValidator.deactivateUserSchema),
  auth,
  userController.deactivateUser
);

// 7-logout
router.post(
  "/logout",
  validation(userValidator.logoutSchema),
  auth,
  userController.logout
);

export default router;
