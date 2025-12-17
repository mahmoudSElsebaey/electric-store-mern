import Order from "../../models/order.model.js";
import User from "../../models/user.model.js";
import Product from './../../models/product.model.js';

// إنشاء الطلب
// إنشاء الطلب مع التحقق من المخزون ونقص الكمية
export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "المستخدم غير مسجل الدخول" });
    }

    const { orderItems, shippingAddress, paymentMethod, paymentIntentId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    // جلب المنتجات من الداتابيز عشان نتحقق من الكمية المتاحة
    const productsFromDB = await Product.find({
      _id: { $in: orderItems.map((item) => item.product) },
    });

    // تحقق من الكمية المتاحة لكل منتج
    const updatedOrderItems = orderItems.map((item) => {
      const dbProduct = productsFromDB.find((p) => p._id.toString() === item.product.toString());

      if (!dbProduct) {
        throw new Error(`المنتج غير موجود: ${item.name}`);
      }

      if (dbProduct.countInStock < item.qty) {
        throw new Error(`الكمية المطلوبة من "${item.name}" غير متوفرة (متاح: ${dbProduct.countInStock})`);
      }

      return {
        ...item,
        price: dbProduct.price, // نأخذ السعر من الداتابيز عشان يكون أحدث
      };
    });

    const itemsPrice = updatedOrderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = 50;
    const totalPrice = itemsPrice + shippingPrice;

    // إنشاء الطلب
    const order = await Order.create({
      user: req.user._id,
      orderItems: updatedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "stripe",
      itemsPrice,
      shippingPrice,
      totalPrice,
      ...(paymentIntentId && {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: paymentIntentId,
          status: "succeeded",
        },
      }),
    });

    // نقص الكمية من المخزون فقط لو الدفع ناجح
    if (paymentIntentId) {
      for (const item of updatedOrderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.qty },
        });
      }
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(400).json({ message: error.message || "فشل في إنشاء الطلب" }); // 400 عشان الـ frontend يعرف يعرض الرسالة
  }
};

// جلب طلبات المستخدم
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب كل الطلبات (للأدمن والأونر)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// جلب تفاصيل طلب معين (مع صلاحية للأونر)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    const isOrderOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.role === "owner";

    if (!isOrderOwner && !isAdmin && !isOwner) {
      return res.status(403).json({ message: "غير مصرح" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: error.message || "فشل جلب تفاصيل الطلب" });
  }
};

// تحديث حالة الطلب (للأدمن والأونر)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    // صلاحية التحديث للأدمن أو الأونر فقط
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.role === "owner";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "غير مصرح بتغيير حالة الطلب" });
    }

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    if (status === "Cancelled") {
      order.isDelivered = false;
    }

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// إحصائيات الطلبات
export const getOrderStats = async (req, res) => {
  try {
   const isAdmin = req.user.role === "admin";
    const isOwner = req.user.role === "owner";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "غير مصرح" });
    }

    const pending = await Order.countDocuments({ status: "Pending" });
    const processing = await Order.countDocuments({ status: "Processing" });
    const shipped = await Order.countDocuments({ status: "Shipped" });
    const delivered = await Order.countDocuments({ status: "Delivered" });
    const cancelled = await Order.countDocuments({ status: "Cancelled" });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// استبدل الدالة القديمة getOrderStats بهذه الجديدة
export const getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.role === "owner";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "غير مصرح" });
    }

    // Total Revenue (Delivered only)
    const revenueResult = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Orders count by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const statusMap = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    ordersByStatus.forEach((item) => {
      if (statusMap.hasOwnProperty(item._id)) statusMap[item._id] = item.count;
    });
    const totalOrders = Object.values(statusMap).reduce((a, b) => a + b, 0);

    // Total Users (users only, not admins/owner)
    const totalUsers = await User.countDocuments({ role: "user" });

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Top 5 selling products (Delivered orders)
    const topProducts = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          totalQty: { $sum: "$orderItems.qty" },
          totalSales: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

    // Daily sales last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      ordersByStatus: statusMap,
      totalUsers,
      totalProducts,
      topProducts,
      dailySales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
  }
};