import { db } from "../database/connection.js";
import userRouter from "./modules/user/user.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import { AppError } from "./utils/error/appError.js";
import { globalErrorHandler } from "./middleware/error/globalErrorHandler.js";

export const router = (app, express) => {
  process.on("unhandledRejection", (error) => {
    console.error("Error: ", error);
  });
  process.on("uncaughtException", (error) => {
    console.error("Error: ", error);
  });

  db();
  app.use(express.json());
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/task", taskRouter);
  app.all("*", (req, res, next) => {
    next(new AppError(`invalid routing ${req.originalUrl}`, 404));
  });
  app.use(globalErrorHandler());
};
