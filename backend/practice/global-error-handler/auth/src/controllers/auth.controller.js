const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cacheInstance = require("../config/redis");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const registerController = asyncHandler(async (req, res) => {
  // 1. get data from body
  let { name, email, password, mobile } = req.body;

  // 2. validate that data
  if (!name || !email || !password)
    return res.status(400).json({
      success: false,
      message: "All fileds are required",
    });

  //   3. check user exists or not
  let isExists = await UserModel.findOne({ email });

  // 4. return error when user exists
  if (isExists)
    return res.status(409).json({
      message: "Email is already exists",
      success: false,
    });

  //   5. password hash
  let hashPass = bcrypt.hashSync(password, 12);

  // 6. save user in db
  let user = await UserModel.create({
    name,
    email,
    password: hashPass,
    mobile,
  });

  // 7. generate token
  let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  // 8. save token in cookies
  res.cookie("tala", token);

  // 9. send the res
  return res.status(201).json({
    success: true,
    message: "User registred successfully",
    data: user,
  });
});

const loginController = asyncHandler(async (req, res) => {
  // 1. get data from body
  let { email, password } = req.body;

  // 2. validate that data
  if (!email || !password) throw new AppError("all fields are required", 400);
  //   3. check user exists or not
  let isExists = UserModel.findOne({ email });

  // 4. return error when user exists
  if (!isExists) throw new AppError("user not found", 404);

  //   5. check password
  let checkPass = bcrypt.compareSync(password, isExists.password);

  if (!checkPass) throw new AppError("Invalid credentials", 401);

  // 6. generate token
  let token = jwt.sign({ id: isExists._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  // 7. save token in cookies
  res.cookie("tala", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });

  // 8. send the res
  return res.status(201).json({
    success: true,
    message: "user logged in",
    data: isExists,
  });
});

const logoutController = asyncHandler(async (req, res) => {
  let tala = req.cookies.tala;

  if (!tala)
    return res.status(401).json({
      message: "Unauthorized request",
      success: false,
    });

  let decode = jwt.verify(tala, process.env.JWT_SECRET_KEY);

  let tokenExpiry = Math.floor(decode.exp - Date.now() / 1000);

  await cacheInstance.set(tala, "blacklisted", "EX", tokenExpiry);

  res.clearCookie("tala");

  return res.status(200).json({
    success: true,
    message: "User logged out",
  });
});

module.exports = {
  registerController,
  loginController,
  logoutController,
};
