import express from "express";
import Brand from "./../../models/brand.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find({}).select("name");
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "فشل جلب الماركات" });
  }
});

export default router;
