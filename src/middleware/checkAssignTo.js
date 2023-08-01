import { User } from "../../database/models/user.model.js";

export const isExist = async (req, res, next) => {
  try {
    const { assignTo } = req.body;

    if (assignTo) {
      let user = await User.findById(assignTo);

      if (!user) {
        return res.json({
          status: "failed",
          message: "The user you're trying to assign a task to isn't exist",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "server error",
      error,
    });
  }

  next();
};
