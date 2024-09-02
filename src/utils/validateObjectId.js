import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

export const validateObjectId = (id, type) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${type} ID`);
  }
};
