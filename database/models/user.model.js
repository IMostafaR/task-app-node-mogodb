import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name is too short"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password should not be less than 8 characters"],
    },
    age: { type: Number, min: [5], max: [100] },
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
