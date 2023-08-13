import { User } from "../../../database/models/user.model.js";
import jwt from "jsonwebtoken";
import { comparePasswords, hashPassword } from "../../utils/password.js";
import { BlacklistedToken } from "../../../database/models/blackList.model.js";
import { verifyEmail } from "../../utils/email/nodemailer.js";
import path from "path";
import { fileURLToPath } from "url";

export const userController = {
  // 1-signUp
  signUp: async (req, res) => {
    try {
      const { firstName, lastName, email, password, age, gender, phone } =
        req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json({
          status: "failed",
          message: "Email already exists",
          email,
        });
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

      const token = jwt.sign({ email }, process.env.VERIFY_EMAIL_KEY);
      verifyEmail({ email, token });

      return res.json({
        status: "success",
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      return res.json({
        status: "error",
        message: "Server error",
        error,
      });
    }
  },

  // verify Email
  verifyEmail: (req, res) => {
    const { token } = req.params;
    jwt.verify(token, process.env.VERIFY_EMAIL_KEY, async (error, decoded) => {
      if (error) {
        return res.json({
          status: "failed",
          message: "Invalid token",
          error,
        });
      }

      const verifiedUser = await User.findOneAndUpdate(
        { email: decoded.email },
        { verified: true },
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
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        email,
        deactivated: false,
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

      return res.json({
        status: "failed",
        message: "incorrect email or password",
      });
    } catch (error) {
      return res.json({ status: "error", message: "server error", error });
    }
  },

  // 3-change password (user must be logged in)
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (oldPassword == newPassword) {
        return res.json({
          status: "failed",
          message: "new password should be different",
        });
      }

      const user = await User.findById(req.id);

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

      return res.json({
        status: "failed",
        message: "Incorrect old password",
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: "error", message: "server error", error });
    }
  },

  // 4-update user (age , firstName , lastName)(user must be logged in)
  updateUser: async (req, res) => {
    try {
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
        return res.json({
          status: "failed",
          message: "there's no data to be updated",
        });
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
      return res.json({
        status: "failed",
        message: "Updating data failed",
      });
    } catch (error) {
      return res.json({ status: "error", message: "server error", error });
    }
  },

  // 5-delete user(user must be logged in)
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.id);

      if (deletedUser) {
        return res.json({
          status: "success",
          message: "user's data deleted successfully",
          id: deletedUser._id,
          email: deletedUser.email,
        });
      }
      return res.json({
        status: "failed",
        message: "no user has been deleted",
      });
    } catch (error) {
      return res.json({ status: "error", message: "server error", error });
    }
  },

  // 6-soft delete(user must be logged in)
  deactivateUser: async (req, res) => {
    try {
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
      return res.json({
        status: "failed",
        message: "Deactivation failed",
      });
    } catch (error) {
      return res.json({ status: "error", message: "server error", error });
    }
  },

  // 7-logout
  logout: async (req, res) => {
    try {
      const token = req.headers.token;
      await BlacklistedToken.create({ token });

      return res.json({
        status: "success",
        message: "User logged out successfully",
      });
    } catch (error) {
      return res.json({ status: "error", message: "server error", error });
    }
  },
};
