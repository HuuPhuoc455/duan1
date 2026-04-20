const jwt = require("jsonwebtoken");
const cartModel = require("../models/cart.Model");

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
};

const optionalAuth = (req, res, next) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    return next();
  }

  jwt.verify(token, "conguoiyeuchua", (err, decoded) => {
    if (!err && decoded?.id) {
      req.userId = decoded.id;
    }
    next();
  });
};

const normalizeCartItems = (items = []) =>
  items
    .map((item) => ({
      cartItemId:
        item.cartItemId || `${item.productId || item._id}-${item.variantId}`,
      productId: item.productId || item._id,
      variantId: item.variantId || item.selectedVariant?._id,
      name: item.name,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || item.selectedVariant?.price || 0),
      sale: Number(item.sale || item.selectedVariant?.sale || 0),
      image: item.image || item.selectedVariant?.img || item.img || "",
      variantName:
        item.variantName || item.selectedVariant?.name || item.variant?.name || "",
      duration:
        item.duration ||
        item.selectedVariant?.duration ||
        item.variant?.duration ||
        "",
    }))
    .filter(
      (item) =>
        item.productId &&
        item.variantId &&
        item.name &&
        item.quantity > 0,
    );

const getMyCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.userId });
    res.json(cart || { userId: req.userId, items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveMyCart = async (req, res) => {
  try {
    const items = normalizeCartItems(req.body.items);

    const cart = await cartModel.findOneAndUpdate(
      { userId: req.userId },
      { userId: req.userId, items },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearMyCart = async (req, res) => {
  try {
    await cartModel.findOneAndUpdate(
      { userId: req.userId },
      { userId: req.userId, items: [] },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  optionalAuth,
  normalizeCartItems,
  getMyCart,
  saveMyCart,
  clearMyCart,
};
