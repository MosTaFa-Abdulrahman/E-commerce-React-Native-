const router = require("express").Router();
const Food = require("../models/Food");

// Create
router.post("/create", async (req, res) => {
  try {
    const food = new Food({ ...req.body });
    await food.save();

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All
router.get("/get/all", async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const query = category && category !== "all" ? { cat: category } : {};

    const foods = await Food.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalCount = await Food.countDocuments(query);

    res.json({
      foods,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get foods based on query parameters
router.get("/get/foodParams", async (req, res) => {
  const { sort, order, limit } = req.query;

  try {
    const sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === "desc" ? -1 : 1;
    }

    const foods = await Food.find()
      .sort(sortOptions)
      .limit(parseInt(limit) || 10);

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching foods", error });
  }
});

// Get Random
router.get("/get/random", async (req, res) => {
  try {
    const randomFoods = await Food.aggregate([{ $sample: { size: 3 } }]);
    res.status(200).json(randomFoods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single
router.get("/get/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for Single Food
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const foods = await Food.find({ name: { $regex: query, $options: "i" } });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching foods", error });
  }
});

module.exports = router;
