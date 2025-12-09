import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
 

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      
      return next();  
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "غير مصرح لك" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "غير مصرح لك، لا يوجد توكن" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "ممنوع - مطلوب صلاحيات Admin" });
  }
};