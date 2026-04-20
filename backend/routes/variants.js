const express = require("express");
const router = express.Router();
const {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
} = require("../controllers/variantController");
const { verifyToken, verifyAdmin } = require("../controllers/userController");

// Get all variants
router.get("/", getAllVariants);

// Create a new variant
router.post("/", verifyToken, verifyAdmin, createVariant);

// Get a single variant by ID
router.get("/:id", getVariantById);

// Update a variant
router.patch("/:id", verifyToken, verifyAdmin, updateVariant);

// Delete a variant
router.delete("/:id", verifyToken, verifyAdmin, deleteVariant);

module.exports = router;
