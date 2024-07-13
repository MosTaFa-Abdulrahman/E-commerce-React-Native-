const mongoose = require("mongoose");
const Food = require("../models/Food");
const { OrderStatus } = require("../utils/orderStatus");

const OrderItemSchema = mongoose.Schema(
  {
    food: { type: Food.schema, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

OrderItemSchema.pre("validate", function (next) {
  this.price = this.food.price * this.quantity;
  next();
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //, required: true
    name: { type: String, required: true },
    address: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, default: OrderStatus.NEW },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
