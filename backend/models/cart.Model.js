const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    cartItemId: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "variants",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    sale: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    variantName: { type: String, default: "" },
    duration: { type: String, default: "" },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model("carts", cartSchema);
