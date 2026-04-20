const categories = require("../models/categoryModel");

//Hàm lấy tất cả danh mục
const getAllCategories = async (req, res, next) => {
  try {
    //Hàm find là hàm lấy tất cả document
    const arr = await categories.find();
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Thêm danh mục
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, img } = req.body;
    const newCategory = new categories({
      name,
      slug: slug || "",
      img: img || "",
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Hàm lấy chi tiết 1 danh mục
const getCategoryById = async (req, res, next) => {
  try {
    //Hàm findById là hàm lấy 1 document dựa vào ID
    const arr = await categories.findById(req.params.id);
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Sửa danh mục
const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, img } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (img) updateData.img = img;

    const updatedCategory = await categories.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Xóa danh mục
const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await categories.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//export ra để các file khác có thể sử dụng
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
