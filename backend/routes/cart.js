const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/userController");
const {
  getMyCart,
  saveMyCart,
  clearMyCart,
} = require("../controllers/cartController");

router.get("/", verifyToken, getMyCart);
router.put("/", verifyToken, saveMyCart);
router.delete("/", verifyToken, clearMyCart);

module.exports = router;
