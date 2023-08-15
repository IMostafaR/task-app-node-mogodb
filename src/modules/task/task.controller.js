import { Task } from "../../../database/models/task.model.js";
import { catchAsyncError } from "../../utils/error/catchAsyncError.js";
import {
  pushTaskAssigned,
  pushTaskOwner,
  updateAssignedTasksList,
  updateOwnerTasksList,
} from "../../utils/pushTasks.js";

export const taskController = {
  // 1-add task with status (toDo)(user must be logged in)
  addTask: catchAsyncError(async (req, res) => {
    const { assignTo, title, description, deadlineInDays } = req.body;
    const createdBy = req.id;
    const assignedTo = assignTo || createdBy; // if no assignTo it will be createdBy

    const currentDate = Date.now();
    const deadline = new Date(
      currentDate + deadlineInDays * 24 * 60 * 60 * 1000
    ); // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

    const newTask = await Task.create({
      createdBy,
      assignTo: assignedTo,
      title,
      description,
      deadline,
    });

    if (newTask) {
      const ownerStatus = await pushTaskOwner(newTask._id, createdBy);
      const assignStatus = await pushTaskAssigned(newTask._id, assignTo);

      return res.json({
        status: "success",
        message: "Task added successfully",
        newTask,
        ownerStatus,
        assignStatus,
      });
    }

    return res.json({ status: "failed", message: "Failed to add task" });
  }),
  // 2-update task (title , description , status) (user must be logged in) (creator only can update task)
  updateTask: catchAsyncError(async (req, res) => {
    const { taskId, title, description, status } = req.body;
    const loggedInUser = req.id;

    const updates = {};
    if (title) {
      updates.title = title;
    }
    if (description) {
      updates.description = description;
    }
    if (status) {
      updates.status = status; // todo, doing , done
    }

    if (!Object.keys(updates).length) {
      return res.json({
        status: "failed",
        message: "there's no data to be updated",
      });
    }

    const task = await Task.findById(taskId);

    if (task && task.createdBy == loggedInUser) {
      const assignedTo = task.assignTo;
      const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
        new: true,
      });

      if (updatedTask) {
        const ownerListStatus = await updateOwnerTasksList(loggedInUser);
        const assignedListStatus = await updateAssignedTasksList(assignedTo);

        return res.json({
          status: "success",
          message: "Task updated successfully",
          updatedTask,
          ownerListStatus,
          assignedListStatus,
        });
      }
    }

    return res.json({
      status: "failed",
      message: "Only task creator can update its information",
    });
  }),
  // 3-delete task(user must be logged in) (creator only can delete task)
  deleteTask: catchAsyncError(async (req, res) => {
    const { taskId } = req.body;
    const loggedInUser = req.id;

    const task = await Task.findById(taskId);

    if (task && task.createdBy == loggedInUser) {
      const assignedTo = task.assignTo;
      const deletedTask = await Task.findByIdAndDelete(taskId);

      if (deletedTask) {
        const ownerListStatus = await updateOwnerTasksList(loggedInUser);
        const assignedListStatus = await updateAssignedTasksList(assignedTo);

        return res.json({
          status: "success",
          message: "Task deleted successfully",
          deletedTask,
          ownerListStatus,
          assignedListStatus,
        });
      }
    }

    return res.json({
      status: "failed",
      message: "Only task creator can delete it",
    });
  }),
  // 4-get all tasks with user data
  getAllTasks: catchAsyncError(async (_, res) => {
    const tasks = await Task.find().populate([
      {
        path: "createdBy",
        select: "name email",
      },
      {
        path: "assignTo",
        select: "name email",
      },
    ]);

    if (tasks.length) {
      return res.json({ status: "success", tasks });
    }

    return res.json({
      status: "failed",
      message: "no tasks yet",
    });
  }),
  // 5-get tasks of oneUser with user data userId (user must be logged in)
  getUserTasks: catchAsyncError(async (req, res) => {
    const loggedInUser = req.id;

    const tasks = await Task.find({ createdBy: loggedInUser }).populate([
      {
        path: "createdBy",
        select: "name email",
      },
      {
        path: "assignTo",
        select: "name email",
      },
    ]);
    if (tasks.length) {
      return res.json({ status: "success", tasks });
    }

    return res.json({
      status: "failed",
      message: "no tasks yet",
    });
  }),
  // 6-get all tasks that not done after deadline
  getNotDoneAfterDeadline: catchAsyncError(async (_, res) => {
    const currentDate = Date.now();

    const tasks = await Task.find({
      $and: [{ status: { $ne: "done" } }, { deadline: { $lt: currentDate } }],
    });

    return res.json({
      status: "success",
      tasks,
    });
  }),
};
