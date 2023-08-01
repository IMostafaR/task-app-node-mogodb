import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo",
    },
    deadline: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model("Task", taskSchema);
