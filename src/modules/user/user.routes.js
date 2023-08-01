import { Router } from "express";
import { userController } from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { User } from "../../../database/models/user.model.js";

const router = Router();

export default router;

// 1-signUp
router.post("/signup", userController.signUp);

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
