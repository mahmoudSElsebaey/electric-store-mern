import express from "express";
import { protect, admin } from "../../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  getDashboardStats,
} from "./order.controller.js";

const authorize = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "owner") return next();
  res.status(403).json({ message: "غير مصرح" });
};

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/myorders", protect, getMyOrders);

//  الإحصائيات الأول
router.get("/dashboard/stats", protect, admin, getDashboardStats);
router.get("/stats", protect, admin, getOrderStats);

// باقي الراوتس
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);




export default router;
