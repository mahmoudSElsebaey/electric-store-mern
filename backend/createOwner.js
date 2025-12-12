import dotenv from "dotenv";
import { connectDB } from "./config/db/connectDB.js";
import User from "./src/models/user.model.js";

dotenv.config();

const createNewOwner = async () => {
  await connectDB();

  const ownerData = {
    name: "Owner Name",
    email: "owner@gmail.com",
    password: "owner123",
    role: "owner",
  };

  const existing = await User.findOne({ email: ownerData.email });
  if (existing) {
    console.log("الأدمن موجود بالفعل");
    process.exit();
  }

  await User.create(ownerData);
  console.log("تم إنشاء أدمن جديد بنجاح!");
  console.log("الإيميل:", ownerData.email);
  console.log("كلمة المرور:", ownerData.password);
  process.exit();
};

createNewOwner();

//_________________ run this command to create the owner just once in the first time _________________
//====> node createOwner.js
