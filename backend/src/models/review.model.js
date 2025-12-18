// backend/src/models/review.model.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
    name: {
      type: String, // اسم المستخدم عشان يظهر في الـ frontend من غير populate كتير
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// منع المستخدم من إضافة أكتر من تقييم واحد لنفس المنتج
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;