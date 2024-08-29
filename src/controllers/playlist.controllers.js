import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  //TODO
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
