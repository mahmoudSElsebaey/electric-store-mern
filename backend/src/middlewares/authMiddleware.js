import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// __________________________________________ Protect Middleware __________________________________________
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "غير مصرح - مفيش توكن" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "المستخدم غير موجود" });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "جلسة منتهية - سجل دخول مرة تانية" });
  }
};
// __________________________________________ Admin Middleware __________________________________________
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "owner")) {
    next();
  } else {
    res.status(403).json({ message: "ممنوع - مطلوب صلاحيات Admin أو Owner" });
  }
};
// __________________________________________ Owner Middleware __________________________________________
export const owner = (req, res, next) => {
  if (req.user && req.user.role === "owner") {
    next();
  } else {
    res.status(403).json({ message: "ممنوع - مطلوب صلاحيات Owner فقط" });
  }
};