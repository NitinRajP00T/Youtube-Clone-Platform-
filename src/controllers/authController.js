const { MakeBcrypt, CompareBcrypt } = require("../utils/bcrypt");
const User = require("../models/User");
const Channel = require("../models/Channel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateUsername = require("../utils/UserNameGun");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  console.log("----- REGISTER CONTROLLER START -----");

  // 1⃣ Validate request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(" Validation Error:", errors.array());
    return next(new AppError(errors.array()[0].msg, 400));
  }

  console.log(" Validation Passed");

  // 2️ Extract user data
  const { username, email, password } = req.body;

  if (!username) {
    username = generateUsername(email);
  }

  console.log(" Request Data:", {
    username,
    email,
  });

  // 3️ Hash password
  console.log(" Hashing password...");

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  console.log(" Password hashed successfully");

  // 4️ Create user
  console.log(" Creating user in database...");

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(" User created successfully:", newUser._id);

  //  Send JWT token
  console.log(" Generating JWT token...");

  createSendToken(newUser, 201, res);

  console.log("----- REGISTER CONTROLLER END -----");
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email })
    .select("+password")
    .populate("channel");
  console.log("password", password, "user.password", user.password);
  // if (!user || !(await user.correctPassword(password, user.password))) {
  //   return next(new AppError("Incorrect email or password", 401));
  // }

  // if (!user || !(await CompareBcrypt(password, user.password)))
  //   return next(new AppError("Incorrect email or password", 401));

  if (!user || !bcrypt.compare(password, user.password)) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("channel");
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// exports.googleAuth = catchAsync(async (req, res, next) => {
//   const { token } = req.body;

//   // Verify token with Google
//   const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: process.env.GOOGLE_CLIENT_ID,
//   });

//   const { name, email, picture } = ticket.getPayload();

//   // Check if user already exists
//   let user = await User.findOne({ email }).populate("channel");

//   if (!user) {
//     // Create new user, generating random password since it's OAuth
//     const randomPassword =
//       Math.random().toString(36).slice(-8) +
//       Math.random().toString(36).slice(-8);
//     user = await User.create({
//       username:
//         name.replace(/\s/g, "").toLowerCase() +
//         Math.random().toString(36).slice(-4), // Simple unique-ish username
//       email: email,
//       password: randomPassword,
//     });
//   }

//   createSendToken(user, 200, res);
// });

exports.googleAuthCallback = catchAsync(async (req, res, next) => {
  // Passport provides the user on req.user
  if (!req.user) {
    return next(new AppError("Google Authentication Failed", 401));
  }
  
  // Sign JWT
  const token = signToken(req.user._id);

  // Send token back to frontend in a redirect so the React app can pick it up
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/google-callback?token=${token}`);
});
