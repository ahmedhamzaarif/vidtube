import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const offset = page * limit - limit;
  //TODO: get all videos based on query, sort, pagination

  const sortByBoolean = sortBy === "low_to_high" ? 1 : 0;

  try {
    const list = await Video.find().limit(limit).skip(offset);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { videos: list }, "Videos fetched successfully")
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
    throw new ApiError(404, "All fields are required");
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

    if (video) {
      await deleteFromCloudinary(video.public_id);
    }
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while publishing video & files were deleted"
    );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    // throw new ApiError(500, "Error fetching video");
    throw new ApiError(404, "Video not found");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  // TODO: update not working
  const { videoId } = req.params;

  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(404, "All fields are required");
  }

  try {
    const video = Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));
  } catch (error) {
    console.log("Error updating video", error);
    throw new ApiError(500, "Something went wrong while updating video");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findByIdAndDelete(videoId);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(404, "Something went wrong while deleting video");
  }
});

const togglePublishStatus = asyncHandler((req, res) => {
  // TODO: update not working
  const { videoId } = req.params;
  const { published } = req.body;

  if (typeof published === undefined) {
    throw new ApiError(404, "Published field is required");
  }
  try {
    const video = Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          isPublished: published,
        },
      },
      { new: true }
    ).select("isPublished title")

    if (!video) {
        throw new ApiError(404, "Video not found");
      }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video status updated successfully"));
  } catch (error) {
    console.log("Error updating video status", error);
    throw new ApiError(500, "Something went wrong while updating video status");
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
