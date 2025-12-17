import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import { 
  payWithStripe, 
  createPaymentIntent   
} from "./payment.controller.js";
import { stripeWebhook } from "./webhook.controller.js";

const paymentRoutes = express.Router();

// الطريقة الجديدة: PaymentIntent للدفع داخل الصفحة
paymentRoutes.post("/create-payment-intent", protect, createPaymentIntent);

// الطريقة القديمة: Checkout Session (لو عايز تحتفظ بيها)
paymentRoutes.post("/stripe/:orderId", protect, payWithStripe);

paymentRoutes.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default paymentRoutes;