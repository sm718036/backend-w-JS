import { User } from "../models/user.model.js";

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
      throw new Error(409, "User already exists");
    }
    const user = await User.create({
      fullName,
      email,
      username: username.toLowerCase(),
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

export { registerUser };
