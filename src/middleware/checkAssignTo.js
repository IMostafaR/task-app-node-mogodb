import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/error/appError.js";
import { catchAsyncError } from "../utils/error/catchAsyncError.js";

export const isExist = catchAsyncError(async (req, res, next) => {
  const { assignTo } = req.body;

  if (assignTo) {
    let user = await User.findById(assignTo);

    if (!user) {
      return next(
        new AppError(
          `The user you're trying to assign a task to isn't exist`,
          404
        )
      );
    }
  }

  next();
});
