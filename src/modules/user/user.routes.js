import { Router } from "express";
import { userController } from "./user.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

// 1-signUp
router.post("/signup", userController.signUp);

// verify email
router.get("/verify/:token", userController.verifyEmail);

// 2-login-->with create token
router.post("/login", userController.logIn);

// 3-change password (user must be logged in)
router.put("/ch-password", auth, userController.changePassword);

// 4-update user (age , firstName , lastName)(user must be logged in)
router.put("/update", auth, userController.updateUser);

// 5-delete user(user must be logged in)
router.delete("/delete", auth, userController.deleteUser);

// 6-soft delete(user must be logged in)
router.put("/deactivate", auth, userController.deactivateUser);

// 7-logout
router.post("/logout", auth, userController.logout);

export default router;
