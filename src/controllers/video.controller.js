import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { validateObjectId } from "../utils/validateObjectId.js";
import { checkOwnership } from "../utils/checkOwnership.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  const offset = page * limit - limit;

  // Define sort options based on sortBy and sortType
  const sortOptions = {};
  sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

  // Build filter query
  const filter = query
    ? {
        title: { $regex: query, $options: "i" },
      }
    : {};

  try {
    const list = await Video.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const totalVideos = await Video.countDocuments(filter);
    const totalPages = Math.ceil(totalVideos / limit);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { videos: list, totalPages, currentPage: parseInt(page) },
          "Videos fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching videos");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoLocalPath = req.files?.videoFile?.[0].path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0].path;
  const userId = req.user?._id;

  if (
    [title, description, videoLocalPath, thumbnailLocalPath].some(
      (field) => !field?.trim()
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  let video,
    thumbnail = "";

  try {
    video = await uploadOnCloudinary(videoLocalPath);
    console.log("Uploaded Video", video?.public_id);
  } catch (error) {
    console.log("Error Uploading Video", error);
    throw new ApiError(500, "Failed to upload video");
  }

  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log("Uploaded Thumbnail", thumbnail?.public_id);
  } catch (error) {
    console.log("Error Uploading Thumbnail", error);
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  try {
    const publishedVideo = await Video.create({
      videoFile: video?.url,
      thumbnail: thumbnail?.url,
      title,
      description,
      duration: video?.duration,
      owner: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, publishedVideo, "Video published successfully")
      );
  } catch (error) {
    console.log("Video published failed");

    if (video) await deleteFromCloudinary(video.public_id);
    if (thumbnail) await deleteFromCloudinary(thumbnail.public_id);

    throw new ApiError(
      500,
      "Something went wrong while publishing video & files were deleted"
    );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  validateObjectId(videoId, "Video");

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching video");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  validateObjectId(videoId, "Video");

  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(404, "All fields are required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.title = title;
  video.description = description;
  video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  checkOwnership(video.owner, userId);

  await video.deleteOne({ _id: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { published } = req.body;

  if (published === undefined) {
    throw new ApiError(400, "Published field is required");
  }

  validateObjectId(videoId, "Video");

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  (video.isPublished = published), video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video status updated successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
