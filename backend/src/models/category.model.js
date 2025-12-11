import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "لا يوجد وصف" },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
