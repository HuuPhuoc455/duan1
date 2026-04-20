//Tạo cấu trúc schema cho dữ liệu product
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
  //ref: 'Categories' để liên kết với collection Categories
  img: { type: String, required: true },
  description: { type: String },
}, { versionKey: false });

// Tạo model từ schema trên Collection products
const productModel = mongoose.model('products', productSchema);

module.exports = productModel;
