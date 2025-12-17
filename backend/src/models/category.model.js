import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "لا يوجد وصف" },
    image: { 
      type: String, 
      default: "https://via.placeholder.com/300x300?text=Category+Icon" // أيقونة افتراضية
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;