const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      default: () => crypto.randomBytes(3).toString("hex"),
    },
    avatar: String,

    googleAuth: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  },
  { timestamps: true },
);

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// Instance method to check password
// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword,
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

const User = mongoose.model("User", userSchema);
module.exports = User;
