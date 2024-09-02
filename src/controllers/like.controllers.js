import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateObjectId } from "../utils/validateObjectId.js";

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id.toString();

  validateObjectId(commentId, "Comment");

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
  } else {
    await Like.create({ comment: commentId, likedBy: userId });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Comment like has been ${existingLike ? "removed" : "added"} successfully`
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id.toString();

  validateObjectId(tweetId, "Tweet");

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
  } else {
    await Like.create({ tweet: tweetId, likedBy: userId });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Tweet like has been ${existingLike ? "removed" : "added"} successfully`
      )
    );
});

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id.toString();

  validateObjectId(videoId, "Video");

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
  } else {
    await Like.create({ video: videoId, likedBy: userId });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Video like has been ${existingLike ? "removed" : "added"} successfully`
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: userId,
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $unwind: "$likedVideos",
    },
    // {
    //   $project: {
    //     _id: 0,
    //     likedVideos: 1,
    //   }
    // }
    {
      $replaceRoot: {
        newRoot: "$likedVideos",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, "User liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
