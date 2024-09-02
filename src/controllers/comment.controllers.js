import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateObjectId } from "../utils/validateObjectId.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.body;

  // Ensure page and limit are integers
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  validateObjectId(videoId, "Video");

  const offset = page * limit - limit;

  const comments = await Comment.find({ video: videoId })
    .limit(limit)
    .skip(offset);

  const totalComments = await Comment.countDocuments({ video: videoId });
  const totalPages = Math.ceil(totalComments / limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, totalComments, totalPages, currentPage: page },
        "Comments fetched successfully"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  validateObjectId(videoId, "Video");

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { _id: userId } = req.user;

  validateObjectId(commentId, "Comment");

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the user is the owner of the comment
  if (comment.owner?.toString() !== userId?.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { _id: userId } = req.user;

  validateObjectId(commentId, "Comment");

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Check if the user is the owner of the comment
  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(204)
    .json(new ApiResponse(204, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
