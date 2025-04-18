import User from "../models/user.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  /*
   * generate Access and Refresh Token,
   * Update refresh Token into db ( just update refreshToken, else untouched )
   * return Access and Refresh Token
   */

  try {
    const user = await User.findById(userId);

    // generate Access and Refresh Token,
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update refresh Token into db
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // return Access and Refresh Token
    return { accessToken, refreshToken };
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while generating tokens",
    });
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  /*
   * step#1: take input name, email, password validation them -> not empty
   * step#2: check for profilePicture given or not... ( from middleware )
   * step#3: create User object and send it after removing credentials
   */

  // step#1: take input name, email, password...
  const { name, email, password } = req.body;

  // if any one not found, throw error: validation - not empty
  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.status(400).json({
      success: false,
      message: "All fields are required...",
    });
  }

  // step#3: create User object and send it after removing credentials
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    // profilePic: profilePic?.url || undefined,
  });

  // if user not created, throw error
  if (!user) {
    res.status(400).json({
      success: false,
      message: "User creation failed ",
    });
  }
  const createdUser = await User.findById(user._id).select("-password");

  // check for user in db
  if (!createdUser) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating user",
    });
  }

  // return info
  return res.status(200).json({
    success: true,
    messagge: "User registered successfully",
    user: createdUser,
  });
});

const loginUser = AsyncHandler(async (req, res) => {
  /*
   * step#1: take input name, email, password... validation them -> not empty
   * step#2: find user with given email
   * step#3: if user found, match password
   * step#4: set accessToken in Barer Authentication token
   * step#5: set cookies for tokens and send User, removing credentials
   */

  // step#1: take input name, email, password... validation them -> not empty
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    res.status(400).json({
      success: false,
      message: "All fields are required...",
    });
  }
  console.log(`from authUser, email: ${email} and password: ${password}`);

  // step#2: find user with given email
  const user = await User.findOne({ email });
  console.log("user: ", user);
  if (!user) {
    res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  // step#3: if user found, match password
  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    res.status(400).json({
      success: false,
      message: "Incorrect password",
      user: null,
    });
  }
  console.log(user._id);

  // step#4: generate accessToken and refreshToken , so User in db updated
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //  removing credentials from User object
  const loggedInUser = await User.findById(user._id).select("-password").lean();

  console.log("loggedInUser: ", loggedInUser);

  const options = {
    httpOnly: true, // cookie can be modified by server only
    secure: true,
  };

  // step#5: set accessToken in Barer Authentication token
  res.setHeader("Authorization", `Bearer ${accessToken}`);

  // step#6: set cookies for tokens and send User
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User logged in successfully",
      user: loggedInUser,
    });
});

export { registerUser, loginUser };
