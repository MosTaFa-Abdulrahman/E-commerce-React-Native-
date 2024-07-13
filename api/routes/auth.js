const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, username } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user)
      return res.status(400).json({ error: "User already exists 🙄🧐" });
    else {
      const salt = bcrypt.genSalt(10);
      const hashPassword = bcrypt.hashSync(req.body.password, parseInt(salt));
      const newUser = new User({ ...req.body, password: hashPassword });
      await newUser.save();

      if (newUser) {
        generateTokenAndSetCookie(newUser._id, res);

        res.status(200).json({
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          imageUrl: newUser.imageUrl,
          address: newUser.address,
        });
      } else res.status(400).json({ error: "Invalid user data 😥" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send("Email is required");
    }
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("User not Found 🙄🧐");
    else {
      const validatePassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!validatePassword) return res.status(404).send("Wrong Password 😥");
      else {
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          imageUrl: user.imageUrl,
          address: user.address,
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Logout
router.post("/logout", (req, res) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully 😍" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
