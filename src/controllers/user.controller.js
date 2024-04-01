import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  // check whether the field are empty or not
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All field are required");
  }

  // find user using mongoose model
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // check if user is already exist
  if (existedUser) {
    throw new apiError(409, "user with email and username already exist");
  }

  // console.log(req.files);
  // get file path
  const avatarLocalPath = await req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (Array.isArray(req.files.coverImage && req.files.coverImage.length > 0)) {
    coverImageLocalPath = await req.files.coverImage[0].path;
  }

  // check if file exist
  if (!avatarLocalPath) {
    throw new apiError(409, "avatar is required");
  }

  // upload on cloudinary
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(500, "failed to upload on cloudinary");
  }

  // create entry on db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new apiError(500, "failed to register");
  }

  // returned response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered sucessfully!"));
});

export { registerUser };
