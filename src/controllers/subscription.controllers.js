import { Subscription } from "../models/subscription.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params
  const result = await Subscription.find({channel: channelId})
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  // TODO
  const { subscriberId } = req.params
  const result = await Subscription.find({subscriber: subscriberId})
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  // TODO
  const { channelId } = req.params
  const result = await Subscription.find({channel: channelId})
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
