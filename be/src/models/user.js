import mongoose from "mongoose";
import { userTypes } from "../../constants";

const user = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    mobileNo: { type: String, require: true },
    password: { type: String, require: true },
    role: {
      type: String,
      default: userTypes.USER,
      enum: [userTypes.ADMIN, userTypes.USER, userTypes.MODERATOR],
    },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("user", user);
export default UserModel;
