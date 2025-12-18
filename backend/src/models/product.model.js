import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "لا يوجد وصف" },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

// ⭐ Virtual rating (آمن مع populate / بدون)
productSchema.virtual("rating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;

  // لو reviews مش populated
  if (typeof this.reviews[0] === "string") return 0;

  const sum = this.reviews.reduce(
    (acc, review) => acc + (review.rating || 0),
    0
  );

  return sum / this.reviews.length;
});

productSchema.virtual("numReviews").get(function () {
  return this.reviews?.length || 0;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
