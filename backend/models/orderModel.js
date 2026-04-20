const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "variants",
      default: null,
    },
    name: { type: String, required: true, trim: true },
    variantName: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true },
    img: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    items: { type: [orderItemSchema], required: true },
    totalQuantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    customerInfo: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      address: { type: String, default: "", trim: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "BANK_TRANSFER"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    note: { type: String, default: "", trim: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

module.exports = mongoose.model("order", orderSchema, "order");
