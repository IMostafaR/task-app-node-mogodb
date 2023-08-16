import { User } from "../../../database/models/user.model.js";
import jwt from "jsonwebtoken";
import { comparePasswords, hashPassword } from "../../utils/password.js";
import { BlacklistedToken } from "../../../database/models/blackList.model.js";
import { verifyEmail } from "../../utils/email/nodemailer.js";
import path from "path";
import { fileURLToPath } from "url";
import { catchAsyncError } from "../../utils/error/catchAsyncError.js";
import { AppError } from "../../utils/error/appError.js";

export const userController = {
  // 1-signUp
  signUp: catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, password, age, gender, phone } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new AppError(`Email already exists`, 409));
    }

    const hashedPassword = hashPassword(password);

    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      age,
      gender,
      phone,
    });

    const token = jwt.sign({ email }, process.env.VERIFY_EMAIL_KEY, {
      expiresIn: 60 * 5,
    });

    verifyEmail({
      email,
      token,
      protocol: req.protocol,
      host: req.headers.host,
    });

    return res.json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  }),
  // verify Email
  verifyEmail: (req, res, next) => {
    const { token } = req.params;
    jwt.verify(token, process.env.VERIFY_EMAIL_KEY, async (error, decoded) => {
      if (error) {
        return next(new AppError(`Invalid token`, 401));
      }

      const verifiedUser = await User.findOneAndUpdate(
        { email: decoded.email },
        { verifiedEmail: true },
        { new: true }
      );
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const htmlFilePath = path.join(
        __dirname,
        "../../view/verifySuccess.html"
      );

      verifiedUser && res.sendFile(htmlFilePath);
    });
  },

  // 2-login-->with create token
  logIn: catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      deactivated: false,
      verifiedEmail: true,
    });

    if (user && comparePasswords(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.SECRET_KEY
      );

      return res.json({
        status: "success",
        message: "User signedIn successfully",
        token,
      });
    }

    return next(new AppError(`incorrect email or password`, 401));
  }),
  // 3-change password (user must be logged in)
  changePassword: catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.id);

    if (user && comparePasswords(newPassword, user.password)) {
      return next(new AppError(`new password should be different`, 409));
    }

    if (user && comparePasswords(oldPassword, user.password)) {
      const hashedPassword = hashPassword(newPassword);

      const updatedUser = await User.findByIdAndUpdate(
        req.id,
        { password: hashedPassword },
        {
          new: true,
        }
      );

      return res.json({
        status: "success",
        message: "Password updated successfully",
        updatedUser,
      });
    }

    return next(new AppError(`Incorrect old password`, 422));
  }),
  // 4-update user (age , firstName , lastName)(user must be logged in)
  updateUser: catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, age } = req.body;
    const updates = {};

    if (firstName && lastName) {
      updates.name = `${firstName} ${lastName}`;
    } else if (firstName || lastName) {
      const user = await User.findById(req.id);
      const { name } = user;
      const nameRegex = /^(\S+)\s(\S+)$/;
      const match = name.match(nameRegex);

      if (firstName) {
        updates.name = `${firstName} ${match[2]}`;
      }
      if (lastName) {
        updates.name = `${match[1]} ${lastName}`;
      }
    }

    if (age) {
      updates.age = age;
    }

    if (!Object.keys(updates).length) {
      return next(new AppError(`there's no data to be updated`, 400));
    }

    const updatedUser = await User.findByIdAndUpdate(req.id, updates, {
      new: true,
    });

    if (updatedUser) {
      return res.json({
        status: "success",
        message: "User's data updated successfully",
        updatedUser,
      });
    }
  }),
  // 5-delete user(user must be logged in)
  deleteUser: catchAsyncError(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.id);

    if (deletedUser) {
      return res.json({
        status: "success",
        message: "user's data deleted successfully",
        id: deletedUser._id,
        email: deletedUser.email,
      });
    }
  }),
  // 6-soft delete(user must be logged in)
  deactivateUser: catchAsyncError(async (req, res, next) => {
    const deactivatedUser = await User.findByIdAndUpdate(
      req.id,
      {
        deactivated: true,
      },
      {
        new: true,
      }
    );
    if (deactivatedUser) {
      const token = req.headers.token;
      await BlacklistedToken.create({ token });
      return res.json({
        status: "success",
        message: "User's account deactivated successfully",
        deactivatedUser,
      });
    }
  }),
  // 7-logout
  logout: catchAsyncError(async (req, res, next) => {
    const token = req.headers.token;
    await BlacklistedToken.create({ token });

    return res.json({
      status: "success",
      message: "User logged out successfully",
    });
  }),
};
