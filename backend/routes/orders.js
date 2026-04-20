const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
} = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../controllers/userController");
const { optionalAuth } = require("../controllers/cartController");

router.post("/", optionalAuth, createOrder);
router.get("/mine", verifyToken, getMyOrders);
router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.patch("/:id", verifyToken, verifyAdmin, updateOrder);

module.exports = router;
