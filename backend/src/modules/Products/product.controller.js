// src/modules/Products/product.controller.js
import cloudinary from "../../../config/cloudinary.js";
import Product from "../../models/product.model.js";

// GET: جلب كل المنتجات
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET: جلب منتج واحد
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST: إضافة منتج جديد
export const createProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "غير مسموح لك" });
    }

    // للاختبار
    // console.log(
    //   "File received:",
    //   req.file ? "YES → " + req.file.originalname : "NO"
    // );

    const { name, description, price, brand, category, countInStock } =
      req.body;
    let image = "https://via.placeholder.com/800x800.png?text=No+Image";

    // لو فيه صورة → ارفعها على Cloudinary
    if (req.file) {
      console.log("Uploading to Cloudinary...", req.file.originalname);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "electrical-tools",
            transformation: [
              { width: 1000, height: 1000, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              console.log("Upload Success:", result.secure_url);
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      image = result.secure_url;
    }

    const product = await Product.create({
      name,
      description: description || "لا يوجد وصف",
      price: parseFloat(price),
      image,
      brand,
      category: category || "أدوات عامة",
      countInStock: parseInt(countInStock),
    });

    console.log("Product created:", product.name);
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      message: error.message || "فشل في إنشاء المنتج",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// PUT: تعديل منتج
export const updateProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "غير مسموح لك" });
    }

    const updates = {
      name: req.body.name,
      description: req.body.description || "لا يوجد وصف",
      price: parseFloat(req.body.price),
      brand: req.body.brand,
      category: req.body.category || "أدوات عامة",
      countInStock: parseInt(req.body.countInStock),
    };

    // لو فيه صورة جديدة → ارفعها
    if (req.file) {
      console.log("Updating image for:", req.params.id);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "electrical-tools" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Update Error:", error);
              reject(error);
            } else {
              console.log("Image updated:", result.secure_url);
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      updates.image = result.secure_url;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    console.log("Product updated:", product.name);
    res.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      message: error.message || "فشل في تعديل المنتج",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// DELETE: حذف منتج
export const deleteProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "غير مسموح لك" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    console.log("Product deleted:", product.name);
    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};
