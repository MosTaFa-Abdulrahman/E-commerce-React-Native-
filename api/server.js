const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const PORT = process.env.PORT || 5000;
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const foodRoute = require("./routes/food");
const orderRoute = require("./routes/order");

// Express Usages
dotenv.config();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Database Config
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Work 😍"))
  .catch((err) => console.log(`Error ${err.message}`));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function seedFoods() {
  const foods = await FoodModel.countDocuments();
  if (foods > 0) {
    console.log("Foods seed is already done!");
    return;
  }

  for (const food of sample_foods) {
    food.imageUrl = `/food/${food.imageUrl}`;
    await FoodModel.create(food);
  }

  console.log("Foods seed Is Done!");
}

// MiddleWares
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/food", foodRoute);
app.use("/api/order", orderRoute);

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT} 🥰`));
