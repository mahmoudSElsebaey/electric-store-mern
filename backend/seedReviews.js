import dotenv from "dotenv";
import { connectDB } from "./config/db/connectDB.js";
import Product from "./src/models/product.model.js";
import Review from "./src/models/review.model.js";
import User from "./src/models/user.model.js";

dotenv.config();

const reviewNames = [
  "أحمد محمد",
  "سارة علي",
  "محمود حسن",
  "نورا إبراهيم",
  "يوسف خالد",
  "مريم سعيد",
  "كريم فؤاد",
  "هدى مصطفى",
  "عمر طارق",
  "لينا عادل",
  "حسام الدين",
  "رانيا سمير",
  "تامر نبيل",
  "دينا ماجد",
  "وليد شريف",
];

const comments = [
  "منتج ممتاز وجودة عالية، أنصح به بشدة.",
  "التوصيل كان سريع والمنتج كما في الوصف.",
  "سعر مناسب مقابل الإمكانيات.",
  "استخدام يومي مريح جدًا.",
  "توفير ملحوظ في الكهرباء.",
  "تصميم أنيق وأداء قوي.",
  "خدمة العملاء ممتازة بعد الشراء.",
  "تجربة شراء سهلة من فولت ستور.",
  "يعمل بكفاءة عالية حتى الآن.",
  "يستحق كل جنيه دفعته.",
  "جودة تصنيع واضحة من أول استخدام.",
  "مناسب للبيت والمطبخ.",
  "سهل التركيب والاستخدام.",
  "صوت هادئ وأداء ثابت.",
  "هشتري منه تاني إن شاء الله.",
];

const run = async () => {
  await connectDB();

  const products = await Product.find({});
  if (!products.length) {
    console.log("لا توجد منتجات");
    process.exit(1);
  }

  await User.deleteMany({ email: /reviewer\d+@voltstore\.test/ });
  const reviewUsers = [];
  for (let i = 0; i < reviewNames.length; i++) {
    const u = await User.create({
      name: reviewNames[i],
      email: `reviewer${i + 1}@voltstore.test`,
      password: "Password1",
      role: "user",
    });
    reviewUsers.push(u);
  }

  // امسح تقييمات الـ reviewers السابقين فقط
  const reviewerIds = reviewUsers.map((u) => u._id);
  const old = await Review.find({ user: { $in: reviewerIds } });
  const oldIds = old.map((r) => r._id);
  if (oldIds.length) {
    await Review.deleteMany({ _id: { $in: oldIds } });
    await Product.updateMany({}, { $pull: { reviews: { $in: oldIds } } });
  }

  const reviewsToCreate = [];
  for (const product of products) {
    const count = 5 + Math.floor(Math.random() * 8); // 5-12
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let u;
      let tries = 0;
      do {
        u = reviewUsers[Math.floor(Math.random() * reviewUsers.length)];
        tries++;
      } while (used.has(String(u._id)) && tries < 25);
      if (used.has(String(u._id))) continue;
      used.add(String(u._id));

      const r = Math.random();
      const rating = r < 0.55 ? 5 : r < 0.82 ? 4 : r < 0.93 ? 3 : 2;
      reviewsToCreate.push({
        user: u._id,
        product: product._id,
        rating,
        comment: comments[Math.floor(Math.random() * comments.length)],
        name: u.name,
      });
    }
  }

  const created = await Review.insertMany(reviewsToCreate);
  const byProduct = {};
  for (const r of created) {
    const k = String(r.product);
    if (!byProduct[k]) byProduct[k] = [];
    byProduct[k].push(r._id);
  }

  await Promise.all(
    Object.entries(byProduct).map(([pid, ids]) =>
      Product.findByIdAndUpdate(pid, { $addToSet: { reviews: { $each: ids } } })
    )
  );

  console.log(`✅ تم إضافة ${created.length} تقييم عشوائي على ${products.length} منتج`);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
