const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    imageUrl: { type: String, default: "" },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
