import jwt from "jsonwebtoken";
import { statusCodes } from "../../constants";
import UserModel from "../models/user";

import bcrypt from "bcrypt";
import { checkUserExists, getUserByEmail } from "./user.controller";

const saltRounds = 10;

export async function signup(req, res) {
  try {
    console.log("signup api call with data --->", req.body);
    const isUserExists = await checkUserExists(req.body.email);
    if (isUserExists) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    const accessToken = await generateAccessToken(user);

    user.password = undefined;
    return res.status(statusCodes.CREATED).json({
      success: true,
      message: "Signup successful",
      data: {
        user: user,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.log("error found while signup", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server Error",
      error: error,
    });
  }
}

export async function signin(req, res) {
  try {
    console.log("signin api call with data --->", req.body);

    const isUserExists = await checkUserExists(req.body.email);

    if (!isUserExists) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }
    const user = await getUserByEmail(req.body.email);

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const accessToken = await generateAccessToken(user);
    user.password = undefined;
    return res.status(statusCodes.CREATED).json({
      success: true,
      message: "Signin successful",
      data: {
        user: user,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.log("error found while signin", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server Error",
      error: error,
    });
  }
}

export async function getUser(req, res) {
  try {
    console.log("get user api call with data --->", req.params.id);

    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(statusCodes.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(statusCodes.ACCEPTED).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    console.log("error found while signin", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server Error",
      error: error,
    });
  }
}

async function generateAccessToken(user) {
  const payload = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  });
  return accessToken;
}
