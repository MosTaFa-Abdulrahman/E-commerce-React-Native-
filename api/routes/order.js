const router = require("express").Router();
const Order = require("../models/Order");

// Create
router.post("/create", async (req, res) => {
  try {
    const { user, name, address, totalPrice, items } = req.body;

    // Create new order
    const newOrder = new Order({
      user,
      name,
      address,
      totalPrice,
      items,
    });

    // Save order to database
    await newOrder.save();

    res
      .status(200)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "Failed to create order. Please try again." });
  }
});

// get Order (Specific User)
router.get("/get/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/delete/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json("Order not found");
    }

    res.status(200).json("Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
