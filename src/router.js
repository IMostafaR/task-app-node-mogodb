import { db } from "../database/connection.js";
import userRouter from "./modules/user/user.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import { AppError } from "./utils/error/appError.js";

export const router = (app, express) => {
  db();
  app.use(express.json());
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/task", taskRouter);
  app.all("*", (req, res, next) => {
    next(new AppError(`invalid routing ${req.originalUrl}`, 404));
  });
  app.use((error, req, res, next) => {
    const status = error.statusCode || 500;

    res.status(status).json({
      status: "failed",
      message: error.message,
      ...error,
    });
  });
};
