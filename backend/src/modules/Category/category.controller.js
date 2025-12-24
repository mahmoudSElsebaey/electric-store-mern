import cloudinary from "../../../config/cloudinary.js";
import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
 

// ================= Helper: Upload to Cloudinary =================
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "categories",
          width: 300,
          height: 300,
          crop: "fill",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

// ================= Get All Categories =================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "فشل جلب التصنيفات" });
  }
};

// ================= Create Category =================
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    let image = "https://via.placeholder.com/300x300?text=Category+Icon";

    if (!name) {
      return res.status(400).json({ message: "الاسم مطلوب" });
    }

    const existing = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existing) {
      return res.status(400).json({ message: "التصنيف موجود بالفعل" });
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      image,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= Update Category =================
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "التصنيف غير موجود" });
    }

    let image = category.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    if (name && name !== category.name) {
      const existing = await Category.findOne({
        name: new RegExp(`^${name}$`, "i"),
      });
      if (existing) {
        return res.status(400).json({ message: "الاسم مستخدم بالفعل" });
      }
    }

    category.name = name?.trim() || category.name;
    category.description = description || category.description;
    category.image = image;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= Delete Category =================
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "التصنيف غير موجود" });
    }

    const productsCount = await Product.countDocuments({
      category: category._id,
    });

    if (productsCount > 0) {
      return res.status(400).json({
        message: `لا يمكن الحذف: يوجد ${productsCount} منتج مرتبط بهذا التصنيف`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف التصنيف بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
