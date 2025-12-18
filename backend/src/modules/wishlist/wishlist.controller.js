import Wishlist from "../../models/wishlist.model.js";

// جلب المفضلة للمستخدم
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: "products",
      select:
        "name price image brand category countInStock rating numReviews description",
      populate: [
        { path: "brand", select: "name" },
        { path: "category", select: "name" },
        { path: "reviews", select: "rating" },
      ],
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json(wishlist.products);
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: "فشل جلب المفضلة" });
  }
};

// إضافة منتج للمفضلة
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id });
    }

    if (wishlist.products.includes(productId)) {
      return res
        .status(400)
        .json({ message: "المنتج موجود بالفعل في المفضلة" });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate(
      "products",
      "name price image brand category countInStock rating numReviews"
    );

    res.json(populated.products);
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: "فشل إضافة المنتج للمفضلة" });
  }
};

// حذف منتج من المفضلة
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "المفضلة غير موجودة" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate(
      "products",
      "name price image brand category countInStock rating numReviews"
    );

    res.json(populated.products);
  } catch (error) {
    console.error("Remove from Wishlist Error:", error);
    res.status(500).json({ message: "فشل حذف المنتج من المفضلة" });
  }
};
