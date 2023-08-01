import { Task } from "../../database/models/task.model.js";
import { User } from "../../database/models/user.model.js";

// push new tasks for owner
export const pushTaskOwner = async (taskId, createdBy) => {
  try {
    const user = await User.findById(createdBy);
    if (user) {
      user.createdTasks.push(taskId);
      await user.save();

      return { pushOwnerStatus: "success" };
    }

    return { pushOwnerStatus: "failed" };
  } catch (error) {
    return error;
  }
};

// push new tasks for assigned
export const pushTaskAssigned = async (taskId, assignTo) => {
  try {
    const user = await User.findById(assignTo);
    if (user) {
      user.assignedTasks.push(taskId);
      await user.save();

      return { pushAssignedStatus: "success" };
    }

    return { pushAssignedStatus: "failed" };
  } catch (error) {
    return error;
  }
};

// to update createdTasks lists after task updates or delete
export const updateOwnerTasksList = async (loggedInUser) => {
  try {
    const newOwnerList = await Task.find({
      createdBy: loggedInUser,
    });
    if (newOwnerList) {
      const owner = await User.findByIdAndUpdate(loggedInUser, {
        createdTasks: newOwnerList,
      });

      if (owner) {
        return {
          ownerTaskListStatus: "createdTasks lists updated successfully",
        };
      }
    }
  } catch (error) {
    return error;
  }
};

// to update  assignedTasks lists after task updates or delete
export const updateAssignedTasksList = async (assignedTo) => {
  try {
    const newAssignedList = await Task.find({
      assignTo: assignedTo,
    });
    if (newAssignedList) {
      const assigned = await User.findByIdAndUpdate(assignedTo, {
        assignedTasks: newAssignedList,
      });

      if (assigned) {
        return {
          assignedTaskListStatus: "assignedTasks lists updated successfully",
        };
      }
    }
  } catch (error) {
    return error;
  }
};
