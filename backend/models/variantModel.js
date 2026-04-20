const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sale: {
        type: Number,
    },
    img: {
        type: String,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});
const variantModel = mongoose.model('variants', variantSchema);
module.exports = variantModel;