import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkOwnership } from "../utils/checkOwnership.js";
import { validateObjectId } from "../utils/validateObjectId.js";

const createTweet = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const result = await Tweet.create({ content, owner });

  if (!result) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Successfully created tweet"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  validateObjectId(userId, "User");

  const result = await Tweet.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Successfully fetched user tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;
  const { content } = req.body;

  validateObjectId(tweetId);

  if (!content.trim()) {
    throw new ApiError(400, "content is required");
  }

  const result = await Tweet.findById(tweetId);
  if (!result) {
    throw new ApiError(404, "Tweet not found");
  }

  checkOwnership(result.owner, userId);

  result.content = content;
  result.save();

  if (!result) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Successfully created tweet"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { tweetId } = req.params;

  validateObjectId(tweetId);

  const result = await Tweet.findById(tweetId);
  if (!result) {
    throw new ApiError(404, "Tweet not found");
  }

  checkOwnership(result.owner, userId);

  await result.deleteOne({ _id: tweetId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully deleted tweet"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
