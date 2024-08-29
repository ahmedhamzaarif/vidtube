import { asyncHandler } from "../utils/asyncHandler.js";

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
});
const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment
});
const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet
});
const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
