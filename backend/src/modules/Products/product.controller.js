import cloudinary from "../../../config/cloudinary.js";
import Brand from "../../models/brand.model.js";
import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
import Review from "../../models/review.model.js";
import Order from "./../../models/order.model.js";

//________________________________________ GET All Products  ________________________________________
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("brand", "name")
      .populate("category", "name")
      .populate({
        path: "reviews",
        select: "rating",
      });
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "فشل جلب المنتجات" });
  }
};

//________________________________________ GET Product By Id  ________________________________________
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name")
      .populate("category", "name")
      .populate({
        path: "reviews",
        select: "rating comment name createdAt",
        options: { sort: { createdAt: -1 } },
      });

    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "فشل جلب المنتج" });
  }
};

//________________________________________ Create Product  ________________________________________
export const createProduct = async (req, res) => {
  try {
    // الحماية: Owner أو Admin فقط
    if (!req.user || !["admin", "owner"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "ممنوع - مطلوب صلاحيات Admin أو Owner" });
    }

    const { name, description, price, brand, category, countInStock } =
      req.body;

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

    let image =
      "https://res.cloudinary.com/dw6wavb0f/image/upload/v1/electrical-tools/placeholder.jpg";

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

// ________________________________________ Update Product  ________________________________________
export const updateProduct = async (req, res) => {
  try {
    if (!req.user || !["admin", "owner"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "ممنوع - مطلوب صلاحيات Admin أو Owner" });
    }

    const { name, description, price, brand, category, countInStock } =
      req.body;

    const updates = {
      name,
      description: description || "لا يوجد وصف",
      price: parseFloat(price),
      countInStock: parseInt(countInStock, 10),
    };

    // تحديث brand و category لو موجودين
    if (brand) {
      const foundBrand = await Brand.findById(brand);
      if (!foundBrand)
        return res.status(400).json({ message: "الماركة غير موجودة" });
      updates.brand = foundBrand._id;
    }

    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory)
        return res.status(400).json({ message: "التصنيف غير موجود" });
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

//________________________________________ Delete Product  ________________________________________
export const deleteProduct = async (req, res) => {
  try {
    if (!req.user || !["admin", "owner"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "ممنوع - مطلوب صلاحيات Admin أو Owner" });
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

// ________________________________________ Add Review  ________________________________________
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "التقييم يجب أن يكون بين 1 و 5 نجوم" });
    }

    // التحقق من إن المستخدم اشترى المنتج (طلب مكتمل أو تم تسليمه)
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "orderItems.product": productId,
      status: { $in: ["Delivered"] }, // أو "Processing" لو عايز تسمح قبل التسليم
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "يجب شراء المنتج أولاً لتقييمه" });
    }

    // التحقق من إن المستخدم ما قيّمش قبل كده (بسبب الـ unique index)
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "لقد قيّمت هذا المنتج من قبل" });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment: comment || "",
      name: req.user.name,
    });

    // إضافة الـ review للـ product
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });

    res.status(201).json({ message: "تم إضافة التقييم بنجاح", review });
  } catch (error) {
    console.error("Add Review Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "لقد قيّمت هذا المنتج من قبل" });
    }
    res.status(500).json({ message: error.message || "فشل إضافة التقييم" });
  }
};

//________________________________________ Delete Review  ________________________________________
export const deleteReview = async (req, res) => {
  try {
    const { id: productId, reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "التقييم غير موجود" });
    }

    // حذف الـ review من الـ product
    await Product.findByIdAndUpdate(productId, {
      $pull: { reviews: review._id },
    });

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "تم حذف التقييم بنجاح" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: "فشل حذف التقييم" });
  }
};
