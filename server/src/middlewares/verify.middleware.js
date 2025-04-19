import AsyncHandler from "../utils/AsyncHandler.js";
import userSchema from "../models/user.model.js";

import jwt from "jsonwebtoken";
import { _env } from "../constant.js";

const verify = AsyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken)
    return res.status(400).json({
      success: false,
      message: "Please login first",
    });

  const tokenValue = jwt.verify(accessToken, _env.ACCESS_TOEKN_SEC);

  if (!tokenValue || !tokenValue._id)
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });

  const userId = tokenValue._id;

  const user = await userSchema.findById(userId);

  if (!user)
    return res.status(400).jsno({
      success: false,
      message: "User does not exist",
    });

  req.user = user;
  return next();
});

export default verify;
