import express from "express";
import {
  deleteUser,
  getAllUser,
  getUser,
  updateUserProfile,
} from "../controllers/user.controller";
import { userTypes } from "../../constants";
import { checkToken } from "../config/middleware";
const userRoute = express.Router();

userRoute.get(
  "/all",
  checkToken([userTypes.ADMIN, userTypes.MODERATOR]),
  getAllUser
);
userRoute.get(
  "/:id",
  checkToken([userTypes.USER, userTypes.ADMIN, userTypes.MODERATOR]),
  getUser
);
userRoute.delete("/:id", checkToken([userTypes.ADMIN]), deleteUser);
userRoute.put(
  "/:id",
  checkToken([userTypes.USER, userTypes.ADMIN]),
  updateUserProfile
);

export default userRoute;
