import express from "express";
import { protect, admin } from "../../middlewares/authMiddleware.js";
import multer from "multer";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./category.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", protect, admin, upload.single("image"), createCategory);
router.put("/:id", protect, admin, upload.single("image"), updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;
