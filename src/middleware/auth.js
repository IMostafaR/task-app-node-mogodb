import jwt from "jsonwebtoken";
import { BlacklistedToken } from "../../database/models/blackList.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    const jwtBlacklist = await BlacklistedToken.findOne({ token });
    if (jwtBlacklist) {
      return res.json({
        status: "failed",
        message:
          "Unauthorized - Token is revoked or invalid. Please try to login again",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.json({
          status: "failed",
          message: "Invalid token",
        });
      }

      req.id = decoded.id;
      next();
    });
  } catch (error) {
    return res.json({ status: "error", message: "server error", error });
  }
};
