import jwt from "jsonwebtoken";
import { BlacklistedToken } from "../../../database/models/blackList.model.js";
import { AppError } from "../../utils/error/appError.js";
import { catchAsyncError } from "../../utils/error/catchAsyncError.js";

export const auth = catchAsyncError(async (req, res, next) => {
  const token = req.headers.token;

  const jwtBlacklist = await BlacklistedToken.findOne({ token });
  if (jwtBlacklist) {
    return next(
      new AppError(
        `Unauthorized - Token is revoked or invalid. Please try to login again`,
        401
      )
    );
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return next(new AppError(`Invalid token`, 401));
    }

    req.id = decoded.id;
    next();
  });
});
