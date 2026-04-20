var express = require("express");
var router = express.Router();

const {
  register,
  login,
  verifyToken,
  getUser,
  verifyAdmin,
  getAllUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

//Đăng ký
router.post("/register", register);

//Đăng nhập
router.post("/login", login);

//Lấy thông tin 1 user theo token
router.get("/userinfo", verifyToken, getUser);

//Lấy tất cả users (admin)
router.get("/", verifyToken, verifyAdmin, getAllUsers);

//Xóa user (admin)
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

//Cập nhật user (admin)
router.patch("/:id", verifyToken, verifyAdmin, updateUser);

module.exports = router;
