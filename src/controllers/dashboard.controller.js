import { Like } from "../models/like.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id.toString();
  console.log(userId);

  //watchHistory -> match videos of current user
  const totalViews = await Video.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } }
  ]).then(result => result.length > 0 ? result[0].totalViews : 0);

  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  const totalVideos = await Video.countDocuments({ owner: userId });

  const totalLikes = await Like.countDocuments({ video: { $in: (await Video.find({ owner: userId }).select('_id')) } });

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
  const userId = req.user._id.toString();
  const videos = await Video.find({ owner: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
