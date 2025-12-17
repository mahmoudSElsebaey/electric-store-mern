// src/modules/Products/product.route.js
import express from "express";
import multer from "multer";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";
import { admin, protect } from "../../middlewares/authMiddleware.js";

// الحل السحري: استخدم memoryStorage + filter
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    console.log("File detected:", file.originalname, file.mimetype);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("الملف يجب أن يكون صورة"));
    }
  },
});

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProductById);
productRoutes.post("/", protect, admin, upload.single("image"), createProduct);
productRoutes.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);
productRoutes.delete("/:id", protect, admin, deleteProduct);

export default productRoutes;
