import Order from "../../models/order.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// _____________________________ CREATE PAYMENT INTENT (جديد - للدفع داخل الصفحة) _____________________________
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // تحقق بسيط من المبلغ
    if (!amount || typeof amount !== "number" || amount < 100) {
      return res
        .status(400)
        .json({ message: "المبلغ غير صالح (يجب أن يكون أكبر من 1 جنيه)" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // تأكد إنه بالقرش
      currency: "egp",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user?._id?.toString() || "guest",
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Create Payment Intent Error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      message: "فشل في إنشاء نية الدفع",
      error: error.message,
    });
  }
};

// _____________________________ PAYMENT WITH STRIPE CHECKOUT SESSION (القديم - لسه موجود) _____________________________
export const payWithStripe = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "الطلب مدفوع مسبقًا" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.orderItems.map((item) => ({
        price_data: {
          currency: "egp",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      shipping_address_collection: { allowed_countries: ["EG"] },
      phone_number_collection: { enabled: true },
    });

    if (order.paymentMethod !== "stripe") {
      order.paymentMethod = "stripe";
      await order.save();
    }

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "فشل في إنشاء جلسة الدفع" });
  }
};
