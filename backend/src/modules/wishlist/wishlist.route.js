 
import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./wishlist.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect); // كل الروتس محمية

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;