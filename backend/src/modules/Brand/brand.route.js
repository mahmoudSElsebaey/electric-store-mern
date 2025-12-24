import express from "express";
import { protect, admin } from "../../middlewares/authMiddleware.js";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "./brand.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getAllBrands);
router.post("/", protect, admin, upload.single("logo"), createBrand);
router.put("/:id", protect, admin, upload.single("logo"), updateBrand);
router.delete("/:id", protect, admin, deleteBrand);

export default router;
