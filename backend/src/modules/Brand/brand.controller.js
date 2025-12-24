import cloudinary from "../../../config/cloudinary.js";
import Brand from "../../models/brand.model.js";
import Product from "../../models/product.model.js";


// ================= Helper: Upload to Cloudinary =================
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "brands",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

// ================= Get All Brands =================
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "فشل جلب الماركات" });
  }
};

// ================= Create Brand =================
export const createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    let logo = "https://via.placeholder.com/200x100?text=No+Logo";

    if (!name) {
      return res.status(400).json({ message: "الاسم مطلوب" });
    }

    const existing = await Brand.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existing) {
      return res.status(400).json({ message: "الماركة موجودة بالفعل" });
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      logo = result.secure_url;
    }

    const brand = await Brand.create({
      name: name.trim(),
      description,
      logo,
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= Update Brand =================
export const updateBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: "الماركة غير موجودة" });
    }

    let logo = brand.logo;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      logo = result.secure_url;
    }

    if (name && name !== brand.name) {
      const existing = await Brand.findOne({
        name: new RegExp(`^${name}$`, "i"),
      });
      if (existing) {
        return res.status(400).json({ message: "الاسم مستخدم بالفعل" });
      }
    }

    brand.name = name?.trim() || brand.name;
    brand.description = description || brand.description;
    brand.logo = logo;

    await brand.save();
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= Delete Brand =================
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: "الماركة غير موجودة" });
    }

    const productsCount = await Product.countDocuments({
      brand: brand._id,
    });

    if (productsCount > 0) {
      return res.status(400).json({
        message: `لا يمكن الحذف: يوجد ${productsCount} منتج مرتبط بهذه الماركة`,
      });
    }

    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف الماركة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
