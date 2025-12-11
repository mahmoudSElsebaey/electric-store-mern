// src/modules/Category/category.route.js
import express from "express";
import Category from '../../models/category.model.js';
 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}).select("name");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "فشل جلب التصنيفات" });
  }
});

export default router;