import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: [true, "Fullname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
