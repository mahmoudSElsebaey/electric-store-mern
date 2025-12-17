import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "paymob", "cashOnDelivery"], // أضفنا cash لو عايز
      required: true,
    },

    paymentResult: {
      id: String,
      status: String,
      email: String,
    },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 50 },
    totalPrice: { type: Number, required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    // === الجديد هنا ===
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending", // أول حالة بعد الإنشاء
    },
    deliveredAt: Date, // هنستخدمه بدل isDelivered لو عايز دقة أكتر

    // isDelivered ممكن نحذفها لو مش مستخدماها، أو نسيبها ونحدثها تلقائي
    isDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
