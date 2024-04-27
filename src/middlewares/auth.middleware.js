import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {

    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = User.findById(
      decodedToken?._id.select("-password -refreshToken")
    );

    if (!user) {
      throw new apiError(401, "invalid access Token");
    }
    req.user = user;
    next();

  } catch (error) {
    
    throw new apiError(401, error?.message || "Invalid access Token");
  }
});
