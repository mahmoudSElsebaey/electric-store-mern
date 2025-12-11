
import dotenv from "dotenv";
import { connectDB } from "./config/db/connectDB.js";
import User from "./src/models/auth.model.js";

dotenv.config();

const createNewAdmin = async () => {
  await connectDB();

  const adminData = {
    name: "admin name",
    email: "admin@gmail.com",
    password: "admin123",
    isAdmin: true,
  };

  const existing = await User.findOne({ email: adminData.email });
  if (existing) {
    console.log("الأدمن موجود بالفعل");
    process.exit();
  }

  await User.create(adminData);
  console.log("تم إنشاء أدمن جديد بنجاح!");
  console.log("الإيميل:", adminData.email);
  console.log("كلمة المرور:", adminData.password);
  process.exit();
};

createNewAdmin();


// run this command to create admin just once in the first time 
// node createAdmin.js  