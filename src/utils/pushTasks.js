import { Task } from "../../database/models/task.model.js";
import { User } from "../../database/models/user.model.js";
import { catchAsyncError } from "./error/catchAsyncError.js";

// push new tasks for owner
export const pushTaskOwner = catchAsyncError(async (taskId, createdBy) => {
  const user = await User.findById(createdBy);
  if (user) {
    user.createdTasks.push(taskId);
    await user.save();
  }
});

// push new tasks for assigned
export const pushTaskAssigned = catchAsyncError(async (taskId, assignTo) => {
  const user = await User.findById(assignTo);
  if (user) {
    user.assignedTasks.push(taskId);
    await user.save();
  }
});

// to update createdTasks lists after task updates or delete
export const updateOwnerTasksList = catchAsyncError(async (loggedInUser) => {
  const newOwnerList = await Task.find({
    createdBy: loggedInUser,
  });
  if (newOwnerList) {
    const owner = await User.findByIdAndUpdate(loggedInUser, {
      createdTasks: newOwnerList,
    });
  }
});

// to update  assignedTasks lists after task updates or delete
export const updateAssignedTasksList = catchAsyncError(async (assignedTo) => {
  const newAssignedList = await Task.find({
    assignTo: assignedTo,
  });
  if (newAssignedList) {
    const assigned = await User.findByIdAndUpdate(assignedTo, {
      assignedTasks: newAssignedList,
    });
  }
});
