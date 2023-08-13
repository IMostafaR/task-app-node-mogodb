import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female"] },
    phone: { type: String },
    createdTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    deactivated: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
