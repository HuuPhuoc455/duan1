//chèn multer để upload file
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  return cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: checkfile });

const Variant = require("../models/variantModel"); // Ensure correct initialization

// Get all variants
const getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.find().populate({
      path: "productId",
      select: "name description",
      populate: {
        path: "categoryId",
        select: "name",
      },
    });
    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single variant by ID
const getVariantById = async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id).populate({
      path: "productId",
      select: "name description",
      populate: {
        path: "categoryId",
        select: "name",
      },
    });
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    res.status(200).json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new variant
const createVariant = [
  upload.single("img"),
  async (req, res) => {
    try {
      const { name, price, sale, productId, duration } = req.body;
      const newVariant = new Variant({
        name,
        price: Number(price),
        sale: sale ? Number(sale) : 0,
        duration,
        productId,
        img: req.file ? req.file.originalname : "",
      });
      const savedVariant = await newVariant.save();
      res.status(201).json(savedVariant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const updateVariant = [
  upload.single("img"),
  async (req, res) => {
    try {
      const { name, price, sale, duration } = req.body;
      const updateData = {
        name,
        price: Number(price),
        sale: sale ? Number(sale) : 0,
        duration,
      };
      if (req.file) {
        updateData.img = req.file.originalname;
      }
      const updatedVariant = await Variant.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
      );
      if (!updatedVariant) {
        return res.status(404).json({ message: "Variant not found" });
      }
      res.status(200).json(updatedVariant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

const deleteVariant = async (req, res) => {
  try {
    const deletedVariant = await Variant.findByIdAndDelete(req.params.id);
    if (!deletedVariant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
};
