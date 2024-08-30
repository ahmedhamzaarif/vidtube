import { Like } from "../models/like.models.js";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id.toString();
  console.log(userId);

  const totalViews = await User.countDocuments(); //watchHistory -> match videos of current user
  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });
  const totalVideos = await Video.countDocuments({ owner: userId });
  const totalLikes = await Like.countDocuments();
  // const totalLikes = await Like.aggregate([
  //   {
  //     $match:
  //   }
  // ])

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalVideos, totalViews, totalSubscribers, totalLikes },
        "Dashboard data fetched successfully"
      )
    );
});
const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id.toString();
  const videos = await Video.find({ owner: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Dashboard data fetched successfully"));
});

export { getChannelStats, getChannelVideos };
