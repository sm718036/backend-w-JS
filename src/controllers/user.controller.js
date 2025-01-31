import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshToken };
  } catch {
    throw new Error("Something went wrong while generating tokens");
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, username, password } = req.body;
    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new Error(400, "All fields are required.");
    }
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      res.status(409).json({
        message: "User already exists",
      });
      throw new Error("User already exists");
    }
    const user = await User.create({
      fullName,
      email,
      username,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new Error(500, "Something went wrong while registering the user.");
    }
    return res.status(201).json({
      message: "User created successfully.",
      user: createdUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if ([username, password].some((field) => field?.trim() === "")) {
      throw new Error("All fields are required.");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      throw new Error("User not found.");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }
    const { accesstoken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accesstoken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User logged in successfully.",
        user: loggedInUser,
        accesstoken,
        refreshToken,
      });
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .clearCookies("accessToken", options)
      .clearCookies("refreshToken", options)
      .json({
        message: "User logged out successfully.",
      });
  } catch (error) {
    console.log(error);
  }
};

export { registerUser, loginUser, logoutUser };
