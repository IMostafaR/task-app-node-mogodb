import { db } from "../database/connection.js";
import userRouter from "./modules/user/user.routes.js";
import taskRouter from "./modules/task/task.routes.js";

export const router = (app, express) => {
  db();
  app.use(express.json());
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/task", taskRouter);
  app.use("*", (_, res) =>
    res.json({ status: "failed", message: "invalid routing" })
  );
};
