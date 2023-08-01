import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: String,
  },
  {
    timestamps: false,
  }
);

export const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema
);
