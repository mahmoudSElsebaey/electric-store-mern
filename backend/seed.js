import dotenv from "dotenv";
import { connectDB } from "./config/db/connectDB.js";
import Product from "./src/models/product.model.js";
import Category from "./src/models/category.model.js";
import Brand from "./src/models/brand.model.js";
dotenv.config();

const categoriesData = [
  { name: "غسالات", description: "غسالات ملابس أوتوماتيك وفوق أوتوماتيك" },
  { name: "ثلاجات", description: "ثلاجات وفريزرات نوفروست" },
  { name: "تكييفات", description: "تكييفات سبليت وشباك" },
  { name: "خلاطات", description: "خلاطات وكبّات متعددة الاستخدامات" },
  { name: "مكانس", description: "مكانس كهربائية عادية وروبوت" },
  { name: "مكاوي", description: "مكاوي بخار وعادية" },
  { name: "ميكروويف", description: "أفران ميكروويف" },
  { name: "توستر", description: "توستر وشوايات خبز" },
  { name: "قهوة ميكرز", description: "ماكينات قهوة وكبسولات" },
  { name: "غسالة أطباق", description: "غسالات أطباق مدمجة ومنفصلة" },
];

const brandsData = [
  { name: "LG" },
  { name: "Samsung" },
  { name: "Toshiba" },
  { name: "Sharp" },
  { name: "Bosch" },
  { name: "Whirlpool" },
  { name: "Beko" },
  { name: "Unionaire" },
  { name: "Kenwood" },
  { name: "Braun" },
  { name: "Philips" },
  { name: "Nespresso" },
];

const productsData = [
  // غسالات (4)
  {
    name: "غسالة LG أوتوماتيك 10 كجم",
    price: 18500,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "LG",
    category: "غسالات",
    countInStock: 12,
  },
  {
    name: "غسالة Samsung 9 كجم ديجيتال",
    price: 16200,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Samsung",
    category: "غسالات",
    countInStock: 8,
  },
  {
    name: "غسالة Toshiba فوق أوتوماتيك 12 كجم",
    price: 9800,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Toshiba",
    category: "غسالات",
    countInStock: 20,
  },
  {
    name: "غسالة Beko 8 كجم",
    price: 13500,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Beko",
    category: "غسالات",
    countInStock: 15,
  },

  // ثلاجات (4)
  {
    name: "ثلاجة LG 600 لتر نوفروست",
    price: 28900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "LG",
    category: "ثلاجات",
    countInStock: 5,
  },
  {
    name: "ثلاجة Samsung 500 لتر إنفرتر",
    price: 25900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Samsung",
    category: "ثلاجات",
    countInStock: 7,
  },
  {
    name: "ثلاجة Sharp 450 لتر",
    price: 18900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Sharp",
    category: "ثلاجات",
    countInStock: 10,
  },
  {
    name: "ثلاجة Whirlpool 550 لتر",
    price: 27500,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Whirlpool",
    category: "ثلاجات",
    countInStock: 6,
  },

  // تكييفات (3)
  {
    name: "تكييف Unionaire سبليت 1.5 حصان بارد",
    price: 14500,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Unionaire",
    category: "تكييفات",
    countInStock: 18,
  },
  {
    name: "تكييف LG إنفرتر 2.25 حصان بارد/ساخن",
    price: 22900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "LG",
    category: "تكييفات",
    countInStock: 9,
  },
  {
    name: "تكييف Sharp 3 حصان",
    price: 28900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Sharp",
    category: "تكييفات",
    countInStock: 4,
  },

  // خلاطات ومكانس ومكاوي (4)
  {
    name: "خلاط Kenwood 1000 وات",
    price: 1890,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Kenwood",
    category: "خلاطات",
    countInStock: 25,
  },
  {
    name: "خلاط Braun متعدد الاستخدامات",
    price: 1590,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Braun",
    category: "خلاطات",
    countInStock: 30,
  },
  {
    name: "مكنسة Bosch كيس",
    price: 4500,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Bosch",
    category: "مكانس",
    countInStock: 14,
  },
  {
    name: "مكواة بخار Philips",
    price: 1290,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Philips",
    category: "مكاوي",
    countInStock: 22,
  },

  // ميكروويف وتوستر وقهوة وغسالة أطباق (5)
  {
    name: "ميكروويف Samsung 40 لتر",
    price: 6900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Samsung",
    category: "ميكروويف",
    countInStock: 11,
  },
  {
    name: "توستر Kenwood 4 شرائح",
    price: 890,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Kenwood",
    category: "توستر",
    countInStock: 28,
  },
  {
    name: "ماكينة قهوة Nespresso",
    price: 4900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Nespresso",
    category: "قهوة ميكرز",
    countInStock: 15,
  },
  {
    name: "غسالة أطباق Bosch 13 فرد",
    price: 28900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Bosch",
    category: "غسالة أطباق",
    countInStock: 5,
  },
  {
    name: "غسالة أطباق Whirlpool 12 فرد",
    price: 24900,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800",
    brand: "Whirlpool",
    category: "غسالة أطباق",
    countInStock: 8,
  },
];

const seedDB = async () => {
  await connectDB();

  await Category.deleteMany({});
  await Brand.deleteMany({});
  await Product.deleteMany({});

  const createdCategories = await Category.insertMany(categoriesData);
  const createdBrands = await Brand.insertMany(brandsData);

  const categoryMap = createdCategories.reduce((map, cat) => {
    map[cat.name] = cat._id;
    return map;
  }, {});

  const brandMap = createdBrands.reduce((map, br) => {
    map[br.name] = br._id;
    return map;
  }, {});

  const mappedProducts = productsData.map((p) => ({
    ...p,
    brand: brandMap[p.brand],
    category: categoryMap[p.category],
  }));

  await Product.insertMany(mappedProducts);

  console.log(
    `✅ تم إضافة ${mappedProducts.length} منتج، ${categoriesData.length} تصنيف، ${brandsData.length} براند بنجاح!`
  );
  process.exit();
};

seedDB();
