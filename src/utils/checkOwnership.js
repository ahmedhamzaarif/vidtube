import { ApiError } from "./ApiError.js";

// Check if the user is the owner of the comment
export const checkOwnership = (ownerId, userId, resource = "resource") => {
  if (ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, `You are not authorized to modify this ${resource}`);
  }
};