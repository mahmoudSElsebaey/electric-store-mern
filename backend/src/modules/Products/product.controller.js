import cloudinary from "../../../config/cloudinary.js";
import Brand from "../../models/brand.model.js";
import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";

// GET: جلب كل المنتجات
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("brand", "name")
      .populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "فشل جلب المنتجات" });
  }
};

// GET: جلب منتج واحد
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name")
      .populate("category", "name");

    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "فشل جلب المنتج" });
  }
};

// POST: إضافة منتج جديد (للـ Admin و Owner فقط)
export const createProduct = async (req, res) => {
  try {
    // الحماية: Owner أو Admin فقط
    if (!req.user || !["admin", "owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "ممنوع - مطلوب صلاحيات Admin أو Owner" });
    }

    const { name, description, price, brand, category, countInStock } = req.body;

    if (!name || !price || !brand || !category || !countInStock) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    // التحقق من وجود الـ brand و category
    const [foundBrand, foundCategory] = await Promise.all([
      Brand.findById(brand),
      Category.findById(category),
    ]);

    if (!foundBrand || !foundCategory) {
      return res.status(400).json({ message: "الماركة أو التصنيف غير موجود" });
    }

    let image = "https://res.cloudinary.com/dw6wavb0f/image/upload/v1/electrical-tools/placeholder.jpg";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "electrical-tools" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      image = result.secure_url;
    }

    const product = await Product.create({
      name,
      description: description || "لا يوجد وصف",
      price: parseFloat(price),
      image,
      brand: foundBrand._id,
      category: foundCategory._id,
      countInStock: parseInt(countInStock, 10),
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("brand", "name")
      .populate("category", "name");

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: error.message || "فشل إضافة المنتج" });
  }
};

// PUT: تعديل منتج (للـ Admin و Owner فقط)
export const updateProduct = async (req, res) => {
  try {
    if (!req.user || !["admin", "owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "ممنوع - مطلوب صلاحيات Admin أو Owner" });
    }

    const { name, description, price, brand, category, countInStock } = req.body;

    const updates = {
      name,
      description: description || "لا يوجد وصف",
      price: parseFloat(price),
      countInStock: parseInt(countInStock, 10),
    };

    // تحديث brand و category لو موجودين
    if (brand) {
      const foundBrand = await Brand.findById(brand);
      if (!foundBrand) return res.status(400).json({ message: "الماركة غير موجودة" });
      updates.brand = foundBrand._id;
    }

    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory) return res.status(400).json({ message: "التصنيف غير موجود" });
      updates.category = foundCategory._id;
    }

    // رفع صورة جديدة لو موجودة
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "electrical-tools" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updates.image = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("brand", "name")
      .populate("category", "name");

    if (!updatedProduct) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: error.message || "فشل تحديث المنتج" });
  }
};

// DELETE: حذف منتج (للـ Admin و Owner فقط)
export const deleteProduct = async (req, res) => {
  try {
    if (!req.user || !["admin", "owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "ممنوع - مطلوب صلاحيات Admin أو Owner" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message || "فشل حذف المنتج" });
  }
};