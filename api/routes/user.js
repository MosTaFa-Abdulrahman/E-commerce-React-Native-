const router = require("express").Router();
const User = require("../models/User");

// Get By ((Username))
router.get("/find/:id", async (req, res) => {
  try {
    const getUser = await User.findOne({ id: req.params.id });
    if (getUser) return res.status(200).json(getUser);
    else res.status(400).json({ error: "User Not Found 😣" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put("/update/:id", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
