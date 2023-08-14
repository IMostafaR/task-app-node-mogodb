import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
