import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";
import redis from "../utils/redis.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; //assigning the refreshToken to the user object
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const ip = req.ip; //user ip address

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(400, "User already exists");
  }

  //redis stuff
  const emailKey = `otp_requests:email:${email}`;
  const ipKey = `otp_requests:ip:${ip}`;

  //check for email
  const emailRequests = await redis.get(emailKey);
  if (emailRequests && Number(emailRequests) >= 3) {
    throw new ApiError(
      429,
      "Too many OTP requests for this email. Try again later."
    );
  }

  //check for ip
  const ipRequests = await redis.get(ipKey);
  if (ipRequests && Number(ipRequests) >= 10) {
    throw new ApiError(
      429,
      "Too many requests from your device. Please try again later."
    );
  }

  // increament counts for email
  await redis.incr(emailKey);
  await redis.expire(emailKey, 60 * 60);

  // increament counts for ip
  await redis.incr(ipKey);
  await redis.expire(ipKey, 60 * 60);

  const otp = Math.floor(100000 + Math.random() * 900000);

  //hashing the otp before saving to redis
  const hashedOtp = crypto.createHash("sha256").update(`${otp}`).digest("hex");

  await redis.set(`otp:${email}`, hashedOtp, "EX", 15 * 60);

  //reseting the attempts for every new request for otp
  await redis.del(`otp_attempts:email:${email}`);

  await sendEmail({
    email: email,
    subject: "Your One-Time Password (OTP) for Registration",
    message: `Hello,

    Thank you for registering with us!

    Your One-Time Password (OTP) for completing your registration is:

    OTP: ${otp}

    This OTP is valid for the next 15 minutes. Please do not share it with anyone for security reasons.

    If you did not request this, please ignore this message.

    – The RareKraft Team
    -For any help! contact-prashantmishra10232@gmail.com`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, otp } = req.body;

  if ([name, email, password, otp].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or userName already existed");
  }

  const avatar = `https://ui-avatars.com/api/?name=${name
    .split(" ")
    .join("+")}&background=random&color=fff`;

  const userCounts = await User.countDocuments();
  const role = userCounts === 0 ? "Admin" : "Buyer";

  const attemptsKey = `otp_attempts:email:${email}`;
  const attempts = await redis.get(attemptsKey);

  if (attempts && Number(attempts) >= 5) {
    throw new ApiError(429, "Too many incorrect attempts. Try later.");
  }

  //fetching the otp from redis
  const hashedOtp = await redis.get(`otp:${email}`);

  if (!hashedOtp) {
    throw new ApiError(400, "OTP expired or not requested");
  }

  //hash the incoming otp to compare it with redis otp
  const incomingOtpHashed = crypto
    .createHash("sha256")
    .update(`${otp}`)
    .digest("hex");

  //now compare them
  if (hashedOtp !== incomingOtpHashed) {
    await redis.incr(attemptsKey); //here i am incrementing the counts of attempts
    await redis.expire(attemptsKey, 60 * 60);
    throw new ApiError(400, "Invalid OTP");
  }

  await redis.del(`otp:${email}`);
  await redis.del(attemptsKey);

  await redis
    .multi()
    .incr(attemptsKey)
    .expire(attemptsKey, 60 * 60)
    .exec();

  const user = await User.create({
    name,
    email,
    password,
    avatar,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  //checkin if the password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite:"none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...options, maxAge: 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        loggedInUser,
        "User logged in successfully"
      )
    );
});

//google OAuth setup here
const googleCallback = asyncHandler(
  async (req, accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ googleId: profile.id });
    let role = "Student";

    if (req.query.state) {
      try {
        const stateObj = JSON.parse(
          Buffer.from(req.query.state, "base64").toString()
        );
        if (stateObj.role) role = stateObj.role;
      } catch (error) {
        console.error("Failed to parse state param", error);
      }
    }

    if (!user) {
      const imageResponse = await axios.get(profile.photo[0].value, {
        responseType: arrayBuffer,
      });

      const fileName = `${profile.displayName.replace(/\s+/g, "_")}_photo`;

      const profilePhoto = await uploadOnCloudinary(
        imageResponse.data,
        fileName
      );

      user = await User.create({
        googleId: profile.id,
        fullName: profile.displayName,
        email: profile.email[0].value,
        profile: {
          profilePhoto: profilePhoto?.url || "",
          profilePhoto_id: profilePhoto._id,
        },
      });

      done(null, user);
    }
  }
);

const handleLoginSuccess = asyncHandler(async () => {
  const user = req.user;

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password");

  const encodedUser = Buffer.from(JSON.stringify(loggedInUser)).toString(
    "base64"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: none,
  };

  const redirectUrl = `${process.env.CLIENT_URL}/login/success?accessToken=${accessToken}&user=${encodedUser}`;

  return res
    .status(200)
    .cookie("accessToken", accessToken, { options, maxAge: 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, {
      options,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .redirect(redirectUrl);
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //removes the field from the document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "RefreshToken is expired or used");
  }

  const { accessToken, newRefreshToken } =
    await User.generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, { options, maxAge: 60 * 60 * 1000 })
    .cookie("refreshToken", newRefreshToken, {
      options,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { accessToken},
        "Access Token refreshed"
      )
    );
});

const requestResetCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(404, "Enter the email first");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");
  const code = await user.generateResetPasswordToken();

  //saving the code to DB
  user.resetPasswordToken = code;
  await user.save({ validateBeforeSave: false });

  const options = {
    email: email,
    subject: "Code for password reset",
    message: `Here is your code to reset your password ${code}, Do not share it with anyone. The code is only valid for 15 minutes`,
  };
  await sendEmail(options);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetCode, password } = req.body;

  if (!email || !password || !resetCode) {
    throw new ApiError(404, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  //hash the code to comapre it
  const hashedCode = crypto.hash("sha256").update(resetCode).digest("hex"); //.digest finalize the hashing and return it in hexadecimal format as i am usind 'hex' can use different formats

  if (
    hashedCode !== user.resetPasswordToken ||
    Date.now() > user.resetPasswordTokenExpiry
  ) {
    throw new ApiError(400, "Invalid or expired reset code");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;

  await user.save().select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, { user }));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name: name,
        email: email,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User deatils updated successfully"));
});

//get all users(admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (!users) {
    throw new ApiError(404, "No user found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, users, "This are the all users in your application")
    );
});

//get single user(admin)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, `User does not exist with Id: ${req.params.id}`);
  }

  return res.status(200).json(new ApiResponse(200, user));
});

//update user role(admin)
const updateRole = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  const allowedRoles = ["user", "admin"];
  if (role && !allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role provided");
  }

  if (!name && !email && !role) {
    throw new ApiError(
      400,
      "At least one field (name, email, role) must be provided"
    );
  }

  if (email && !validator.isEmail(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Role updated successfully"));
});

//delete user(admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(400, `User does not exist with Id: ${req.params.id}`);
  }

  await User.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
});

export {
  requestOtp,
  registerUser,
  loginUser,
  googleCallback,
  handleLoginSuccess,
  logOut,
  deleteUser,
  getAllUsers,
  getUser,
  getUserDetails,
  refreshAccessToken,
  updateRole,
  updateUserProfile,
  resetPassword,
  requestResetCode,
  resetPassword,
};
