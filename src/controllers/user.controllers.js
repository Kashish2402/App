import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    // FETCHING USER FROM USERID
    const user = await User.findById(userId);

    // GENERATING TOKENS AND SAVING TO DATABASE
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return next(
      new ApiError(
        400,
        "Something went wrong while generating refresh and access tokens"
      )
    );
  }
};

const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!(fullName && email && password))
    throw new ApiError(400, "Full name, username, password required...");

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return next(new ApiError(400, "User Account Already exist"));

  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (!user)
    return next(
      new ApiError(400, "Something went wrong... Unable to create User Account")
    );

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User Account Created Successfully"));
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email || password)) throw new ApiError(400, "Email,Password Required");

  const user = await User.findOne({ email });
  if (!user) return next(new ApiResponse(404, "User not found"));
  const validatePassword = await user.isPasswordCorrect(password);
  if (!validatePassword) return next(new ApiError(400, "Wrong Password"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findByIdAndUpdate(user?._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) return next(new ApiError(404, "Unable to find user"));

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Loggged In Successfully!"
      )
    );
});

const getCurrentUser=asyncHandler(async(req,res)=>{
  return res.status(200).json(new ApiResponse(200,req.user,"User Fetched Successfully!! "))
})
const logout = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!(oldPassword || newPassword || confirmNewPassword))
    return next(
      new ApiError(
        400,
        "Password, New Password, Confirm New Password fields must required "
      )
    );

  if (newPassword !== confirmNewPassword)
    return next(
      new ApiError(400, "New Password and Confirm Password must be same!!")
    );

  const user = await User.findById(req.user?._id);

  if (!user) return next(new ApiError(400, "User Not found"));

  const validatePassword = await user.isPasswordCorrect(oldPassword);

  if (!validatePassword) return next(new ApiError(400, "Wrong Password"));

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!!"));
});

const updateAvatar = asyncHandler(async (req, res, next) => {
  const profilepic = req.file?.path;
  if (!profilepic) throw new ApiError(404, "File not found");

  const image = await uploadOnCloudinary(profilepic);

  if (!image)
    return next(
      new ApiError(
        400,
        "Something went wrong... Unable to upload file on server"
      )
    );

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      profilepic: image.url,
    },
    {
      new: true,
    }
  );

  if (!user)
    return next(
      new ApiError(
        400,
        "Something went wrong... Unable to update profile picture"
      )
    );

  return res
    .status(400)
    .json(new ApiResponse(400, {}, "Profile picture Updated successfully !!"));
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { fullName } = req.body;

  if (!fullName) return next(new ApiError(400, "Full Name Required"));

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      fullName,
    },
    { new: true }
  );

  if (!user) return next(new ApiError(400, "Unable to Update User Details"));

  return res
    .status(400)
    .json(new ApiResponse(400, {}, "User Details Updated successfully !!"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  let incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken)
    return next(new ApiError(400, "UNAUTHORISED REQUEST"));

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN
    );
    if (!decodedToken) return next(new ApiError(400, "Unauthorised TOKEN"));

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return next(new ApiError(401, "INVALID REFRESH TOKEN "));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return next(new ApiError(401, "Refresh Token is expired or used"));
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, user, "Access Token Refreshed successfully!!")
      );
  } catch (error) {
    return next(new ApiError(401, error?.message || "INVALID REFRESH TOKEN"));
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password, -refreshToken"
  );

  if (!user) return next(new ApiError(400, "User doesn't Exist"));

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Details Fetched Successfully"));
});
export {
  register,
  login,
  logout,
  changePassword,
  updateAvatar,
  updateUserDetails,
  getCurrentUser,
  refreshAccessToken,
  getUserProfile,
};
