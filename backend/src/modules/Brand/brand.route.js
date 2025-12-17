import express from "express";
import { protect, admin } from "../../middlewares/authMiddleware.js";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "./brand.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", getAllBrands);
router.post("/", protect, admin, upload.single("logo"), createBrand); // جديد: upload logo
router.put("/:id", protect, admin, upload.single("logo"), updateBrand); // جديد
router.delete("/:id", protect, admin, deleteBrand);

export default router;