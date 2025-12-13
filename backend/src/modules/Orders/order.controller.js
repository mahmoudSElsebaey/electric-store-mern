import Order from "../../models/order.model.js";

// إنشاء الطلب
export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "المستخدم غير مسجل الدخول" });
    }

    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      paymentIntentId // ← جديد: من Stripe بعد نجاح الدفع
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const shippingPrice = 50;
    const totalPrice = itemsPrice + shippingPrice;

    console.log({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentIntentId, // للـ debug
    });

    // إنشاء الطلب
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "stripe", // default stripe
      itemsPrice,
      shippingPrice,
      totalPrice,
      // لو الدفع تم بالفعل بـ Stripe
      ...(paymentIntentId && {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: paymentIntentId,
          status: "succeeded",
        },
      }),
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message || "فشل في إنشاء الطلب" });
  }
};

// // جلب كل الطلبات
// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({}).populate("user", "name email");
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Get All Orders Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // جلب الطلبات للمستخدم
// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id });
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Get My Orders Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

