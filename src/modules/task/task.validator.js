import Joi from "joi";

export const taskValidator = {
  addTaskSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
    assignTo: Joi.string().hex().length(24),
    title: Joi.string().min(1).max(25).required(),
    description: Joi.string().min(1).max(200).required(),
    deadlineDate: Joi.date().required(),
  }),

  updateTaskSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
    taskId: Joi.string().hex().length(24).required(),
    title: Joi.string().min(1).max(25),
    description: Joi.string().min(1).max(200),
    status: Joi.string().valid("todo", "doing", "done"),
  }),

  deleteTaskSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
    taskId: Joi.string().hex().length(24).required(),
  }),

  getUserTasksSchema: Joi.object({
    token: Joi.string().pattern(
      /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
    ),
    loggedInUser: Joi.string().hex().length(24).required(),
  }),
};
