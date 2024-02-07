import { statusCodes } from "../../constants";
import UserModel from "../models/user";

export async function getUser(req, res) {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(statusCodes.BAD_REQUEST).json({
        message: "User not found",
      });
    } else {
      return res.status(statusCodes.OK).json({
        message: "User get successfully",
        data: user,
      });
    }
  } catch (error) {
    console.log("error found while gwtUser", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "error found while gwtUser",
      error: error,
    });
  }
}

export async function updateUserProfile(req, res) {
  console.log("update user profile api call with", req.body);
  try {
    delete req.body.password;
    delete req.body._id;
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    return res.status(statusCodes.OK).json({
      success: true,
      message: "User update successfully",
      data: user,
    });
  } catch (error) {
    console.log("error found while updateUserProfile", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "error found while updateUserProfile",
      error: error,
    });
  }
}

export async function getAllUser(req, res) {
  try {
    const users = await UserModel.find({});
    return res.status(statusCodes.OK).json({
      success: true,
      message: "User get successfully",
      data: {
        users: users,
      },
    });
  } catch (error) {
    console.log("error found while gwtUser", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "error found while gwtUser",
      error: error,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(statusCodes.BAD_REQUEST).json({
        message: "User not found",
      });
    } else {
      await UserModel.deleteOne({ _id: req.params.id });
      return res.status(statusCodes.OK).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.log("error found while deleteUser", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "error found while deleteUser",
      error: error,
    });
  }
}

export async function checkUserExists(email) {
  const user = await UserModel.findOne({ email: email });
  return user ? true : false;
}

export async function getUserByEmail(email) {
  const user = await UserModel.findOne({ email: email });
  return user;
}

export async function getUserById(id) {
  const user = await UserModel.findById(id);
  return user;
}

export async function addSocketToUSer(userId, socketId) {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        socketId: socketId,
      },
    },
    {
      new: true,
    }
  );
}

export async function getUserProfile(req, res) {}
