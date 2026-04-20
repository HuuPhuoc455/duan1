const orderModel = require("../models/orderModel");
const cartModel = require("../models/cart.Model");
const { normalizeCartItems } = require("./cartController");

const generateOrderId = () =>
  `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      paymentMethod,
      note,
    } = req.body;

    const normalizedItems = normalizeCartItems(req.body.items);

    if (!customerName || !customerEmail || !customerPhone) {
      return res
        .status(400)
        .json({ message: "Vui long nhap day du thong tin thanh toan" });
    }

    if (!normalizedItems.length) {
      return res.status(400).json({ message: "Gio hang dang trong" });
    }

    const items = normalizedItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      variantName: item.variantName || "",
      duration: item.duration || "",
      img: item.image || "",
      price: item.sale || item.price || 0,
      quantity: item.quantity,
      total: (item.sale || item.price || 0) * item.quantity,
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.total, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const order = await orderModel.create({
      orderId: generateOrderId(),
      userId: req.userId || null,
      items,
      totalQuantity,
      totalPrice,
      customerInfo: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress || "",
      },
      paymentMethod:
        paymentMethod === "bank_transfer" ? "BANK_TRANSFER" : "COD",
      paymentStatus: paymentMethod === "bank_transfer" ? "paid" : "unpaid",
      orderStatus: "pending",
      note: note || "",
    });

    if (req.userId) {
      await cartModel.findOneAndUpdate(
        { userId: req.userId },
        { userId: req.userId, items: [] },
        { upsert: true },
      );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const updateData = {};

    if (orderStatus) {
      const validOrderStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ];

      if (!validOrderStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: "Order status khong hop le" });
      }

      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ["unpaid", "paid"];

      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res
          .status(400)
          .json({ message: "Payment status khong hop le" });
      }

      updateData.paymentStatus = paymentStatus;
    }

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "Khong co du lieu can cap nhat" });
    }

    const order = await orderModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Khong tim thay don hang" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
};
