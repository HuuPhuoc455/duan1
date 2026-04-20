var express = require("express");
var router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { verifyToken, verifyAdmin } = require("../controllers/userController");

//Lấy tất cả danh mục
router.get("/", getAllCategories);

//Thêm danh mục
router.post("/", verifyToken, verifyAdmin, createCategory);

//Lấy chi tiết 1 danh mục
router.get("/:id", getCategoryById);

//Sửa danh mục
router.patch("/:id", verifyToken, verifyAdmin, updateCategory);

//Xóa danh mục
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
