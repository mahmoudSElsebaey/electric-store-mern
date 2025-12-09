// server/seed.js
 
import dotenv from "dotenv";
import Product from "./src/models/product.model.js";
import { connectDB } from "./config/db/connectDB.js";
 
 

dotenv.config();

const sampleProducts = [
  {
    name: "مفك عازل 1000V - Wera",
    description: "مفك عازل ألماني عالي الجودة 1000 فولت",
    price: 185,
    image: "https://images.unsplash.com/photo-1581092583633-2d565a9f5e9f?w=800",
    brand: "Wera",
    category: "مفكات",
    countInStock: 15,
  },
  {
    name: "كماشة قطع 8 بوصة - Knipex",
    description: "كماشة ألماني قوية جدًا للأسلاك والكابلات",
    price: 220,
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800",
    brand: "Knipex",
    category: "كماشات",
    countInStock: 8,
  },
  {
    name: "متر قياس 5 متر - Stanley",
    description: "متر قياس ضد الصدمات والكسر",
    price: 95,
    image: "https://images.unsplash.com/photo-1581092921461-7f65d1c5712e?w=800",
    brand: "Stanley",
    category: "أدوات قياس",
    countInStock: 25,
  },
  {
    name: "شنيور 710 واط - Bosch",
    description: "شنيور احترافي بسرعات متغيرة",
    price: 2850,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Bosch",
    category: "ماكينات",
    countInStock: 5,
  },
  {
    name: "طقم لقم 32 قطعة - Makita",
    description: "طقم لقم عالي التحمل مع علبة",
    price: 650,
    image: "https://images.unsplash.com/photo-1581093577422-7e8d9e3e3f2c?w=800",
    brand: "Makita",
    category: "إكسسوارات",
    countInStock: 12,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("Connected to database...");

    await Product.deleteMany({});
    console.log("Old products deleted");

    await Product.insertMany(sampleProducts);
    console.log("✅ Successfully added 5 sample products!");

    process.exit(0);
  } catch (error) {
    console.error("Error in seed:", error.message);
    process.exit(1);
  }
};

seedDB();
