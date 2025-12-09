// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// اختبار الاتصال
console.log("Cloudinary Config:", {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? "exists" : "missing",
  api_secret: cloudinary.config().api_secret ? "exists" : "missing",
});

export default cloudinary;