// // src/modules/Products/product.controller.js
// import cloudinary from "../../../config/cloudinary.js";
// import Product from "../../models/product.model.js";

// // GET: جلب كل المنتجات
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find({})
//       .populate("brand", "name -_id")
//       .populate("category", "name -_id");
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Get Products Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // GET: جلب منتج واحد
// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
//     res.status(200).json(product);
//   } catch (error) {
//     console.error("Get Product Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // POST: إضافة منتج جديد
// export const createProduct = async (req, res) => {
//   try {
//     if (!req.user || !req.user.isAdmin) {
//       return res.status(403).json({ message: "غير مسموح لك" });
//     }
 
//     const { name, description, price, brand, category, countInStock } =
//       req.body;
//     let image = "https://via.placeholder.com/800x800.png?text=No+Image";

//     // لو فيه صورة → ارفعها على Cloudinary
//     if (req.file) {
//       console.log("Uploading to Cloudinary...", req.file.originalname);

//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "electrical-tools",
//             transformation: [
//               { width: 1000, height: 1000, crop: "limit" },
//               { quality: "auto" },
//               { fetch_format: "auto" },
//             ],
//           },
//           (error, result) => {
//             if (error) {
//               console.error("Cloudinary Upload Error:", error);
//               reject(error);
//             } else {
//               console.log("Upload Success:", result.secure_url);
//               resolve(result);
//             }
//           }
//         );
//         uploadStream.end(req.file.buffer);
//       });

//       image = result.secure_url;
//     }

//     const product = await Product.create({
//       name,
//       description: description || "لا يوجد وصف",
//       price: parseFloat(price),
//       image,
//       brand,
//       category: category || "أدوات عامة",
//       countInStock: parseInt(countInStock),
//     });

//     console.log("Product created:", product.name);
//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Create Product Error:", error);
//     res.status(500).json({
//       message: error.message || "فشل في إنشاء المنتج",
//       error: process.env.NODE_ENV === "development" ? error : undefined,
//     });
//   }
// };

// // PUT: تعديل منتج
// export const updateProduct = async (req, res) => {
//   try {
//     if (!req.user || !req.user.isAdmin) {
//       return res.status(403).json({ message: "غير مسموح لك" });
//     }

//     const updates = {
//       name: req.body.name,
//       description: req.body.description || "لا يوجد وصف",
//       price: parseFloat(req.body.price),
//       brand: req.body.brand,
//       category: req.body.category || "أدوات عامة",
//       countInStock: parseInt(req.body.countInStock),
//     };

//     // لو فيه صورة جديدة → ارفعها
//     if (req.file) {
//       console.log("Updating image for:", req.params.id);

//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           { folder: "electrical-tools" },
//           (error, result) => {
//             if (error) {
//               console.error("Cloudinary Update Error:", error);
//               reject(error);
//             } else {
//               console.log("Image updated:", result.secure_url);
//               resolve(result);
//             }
//           }
//         );
//         uploadStream.end(req.file.buffer);
//       });

//       updates.image = result.secure_url;
//     }

//     const product = await Product.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!product) {
//       return res.status(404).json({ message: "المنتج غير موجود" });
//     }

//     console.log("Product updated:", product.name);
//     res.json(product);
//   } catch (error) {
//     console.error("Update Product Error:", error);
//     res.status(500).json({
//       message: error.message || "فشل في تعديل المنتج",
//       error: process.env.NODE_ENV === "development" ? error : undefined,
//     });
//   }
// };

// // DELETE: حذف منتج
// export const deleteProduct = async (req, res) => {
//   try {
//     if (!req.user || !req.user.isAdmin) {
//       return res.status(403).json({ message: "غير مسموح لك" });
//     }

//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "المنتج غير موجود" });
//     }

//     console.log("Product deleted:", product.name);
//     res.json({ message: "تم حذف المنتج بنجاح" });
//   } catch (error) {
//     console.error("Delete Product Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


// src/modules/Products/product.controller.js
import cloudinary from "../../../config/cloudinary.js";
import Brand from "../../models/brand.model.js";
import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";

// GET: جلب كل المنتجات
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("brand", "name -_id")
      .populate("category", "name -_id");
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET: جلب منتج واحد
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name -_id")
      .populate("category", "name -_id");

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

    const { name, description, price, brand, category, countInStock } = req.body;
    let image = "https://via.placeholder.com/800x800.png?text=No+Image";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "electrical-tools" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        uploadStream.end(req.file.buffer);
      });
      image = result.secure_url;
    }

    // تأكد إن الـ brand و category موجودين
    const selectedBrand = await Brand.findById(brand);
    const selectedCategory = await Category.findById(category);

    if (!selectedBrand || !selectedCategory) {
      return res.status(400).json({ message: "Brand أو Category غير موجود" });
    }

    const product = await Product.create({
      name,
      description: description || "لا يوجد وصف",
      price: parseFloat(price),
      image,
      brand: selectedBrand._id,
      category: selectedCategory._id,
      countInStock: parseInt(countInStock),
    });

    // اعمل populate قبل الإرسال للـ frontend
    const productWithPopulates = await Product.findById(product._id)
      .populate("brand", "name -_id")
      .populate("category", "name -_id");

    res.status(201).json(productWithPopulates);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// PUT: تعديل منتج
export const updateProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "غير مسموح لك" });
    }

    const { name, description, price, brand, category, countInStock } = req.body;

    // تأكد إن الـ brand و category موجودين في DB
    const selectedBrand = await Brand.findById(brand);
    const selectedCategory = await Category.findById(category);

    if (!selectedBrand || !selectedCategory) {
      return res.status(400).json({ message: "Brand أو Category غير موجود" });
    }

    const updates = {
      name,
      description: description || "لا يوجد وصف",
      price: parseFloat(price),
      brand: selectedBrand._id,
      category: selectedCategory._id,
      countInStock: parseInt(countInStock),
    };

    // لو فيه صورة جديدة → ارفعها على Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "electrical-tools" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        uploadStream.end(req.file.buffer);
      });

      updates.image = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("brand", "name -_id")
      .populate("category", "name -_id");

    if (!updatedProduct) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: error.message });
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

    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};
