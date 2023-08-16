import { Router } from "express";
import { taskController } from "./task.controller.js";
import { isExist } from "../../middleware/checkAssignTo.js";
import { auth } from "../../middleware/auth/auth.js";
import { validation } from "../../middleware/validation/validation.js";
import { taskValidator } from "./task.validator.js";

const router = Router();

export default router;

// 1-add task with status (toDo)(user must be logged in)
router.post(
  "/add",
  validation(taskValidator.addTaskSchema),
  auth,
  isExist,
  taskController.addTask
);

// 2-update task (title , description , status) (user must be logged in) (creator only can update task)
router.put(
  "/update",
  validation(taskValidator.updateTaskSchema),
  auth,
  taskController.updateTask
);

// 3-delete task(user must be logged in) (creator only can delete task)
router.delete(
  "/delete",
  validation(taskValidator.deleteTaskSchema),
  auth,
  taskController.deleteTask
);

// 4-get all tasks with user data
router.get("/all-tasks", taskController.getAllTasks);

// 5-get tasks of oneUser with user data userId (user must be logged in)
router.get(
  "/user-tasks",
  validation(taskValidator.getUserTasksSchema),
  auth,
  taskController.getUserTasks
);

// 6-get all tasks that not done after deadline
router.get("/deadline", taskController.getNotDoneAfterDeadline);
