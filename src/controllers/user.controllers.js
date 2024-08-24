import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from 'fs'

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(404, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;
  
  if (existedUser) {
    fs.unlinkSync(avatarLocalPath);
    fs.unlinkSync(coverLocalPath);
    throw new ApiError(409, "User with email or username already exists");
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is missing");
  }

  let avatar = "";

  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded Avatar", avatar?.public_id);
  } catch (error) {
    console.log("Error Uploading Avatar", error);
    throw new ApiError(500, "Failed to upload avatar");
  }

  let coverImage = "";

  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Uploaded Cover Image", coverImage?.public_id);
  } catch (error) {
    console.log("Error Uploading Cover Image", error);
    throw new ApiError(500, "Failed to upload avatar");
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar?.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username?.toLowerCase(),
    });

    const createdUser = await User.findOne(user?._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }
    
    res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
} catch (error) {
    console.log('User creation failed')
    
    if(avatar) {
        await deleteFromCloudinary(avatar.public_id)
    }
    if(coverImage) {
        await deleteFromCloudinary(coverImage.public_id)
    }
    throw new ApiError(500, "Something went wrong while registering user & images were deleted");
}
});

export { registerUser };
