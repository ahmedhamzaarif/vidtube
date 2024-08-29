import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  // TODO
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  // TODO
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
