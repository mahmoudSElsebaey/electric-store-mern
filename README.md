# ⚡ Electrical Store – MERN E-Commerce

متجر إلكتروني كامل للأجهزة الكهربائية مبني بـ **MERN Stack** (MongoDB + Express + React + Node.js) مع TypeScript في الواجهة الأمامية.

**Live Demo:** [https://electric-store-mern.vercel.app](https://electric-store-mern.vercel.app)

---

## ✨ الميزات الرئيسية

- تسجيل دخول وتسجيل (عادي + Google OAuth)
- تصفح المنتجات مع بحث وفلترة حسب الفئة والماركة
- سلة تسوق + قائمة المفضلة (Wishlist)
- تقييمات ومراجعات للمنتجات
- عملية دفع كاملة (Stripe + PayPal)
- لوحة تحكم أدمن قوية (منتجات، طلبات، مستخدمين، فئات، ماركات)
- دعم لغتين: العربية والإنجليزية (RTL/LTR)
- تصميم متجاوب بالكامل

---

## 🛠️ التقنيات المستخدمة

### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS + React Bootstrap
- React Router + React Hook Form + Zod
- i18next (عربي / إنجليزي)
- Stripe React + Google OAuth
- Swiper + React Icons

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT + bcrypt + Cookie Auth
- Cloudinary (رفع الصور)
- Stripe + PayPal
- Zod Validation

---

## 📁 هيكل المشروع

```
electric-store-mern/
├── backend/                 # API Server
│   ├── config/              # DB, Cloudinary, Stripe
│   ├── src/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── modules/         # Auth, Products, Orders, Payment...
│   │   └── validation/
│   ├── seed.js
│   └── server.js
└── frontend/                # React App
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── locales/         # ar / en translations
    └── ...
```

---

## 🚀 طريقة التشغيل محلياً

### المتطلبات
- Node.js 18+
- MongoDB (محلي أو Atlas)

### 1. Backend
```bash
cd backend
cp .env.example .env   # أضف المتغيرات المطلوبة
npm install
npm run seed           # (اختياري) لإضافة بيانات تجريبية
npm run dev
```
السيرفر يعمل على `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # أضف VITE_API_URL وغيرها
npm install
npm run dev
```
الواجهة تعمل على `http://localhost:5173`

---

## 🎨 نظام الألوان (Design System)

| الدور              | اللون          | Hex       |
|--------------------|----------------|-----------|
| Primary            | Teal           | `#0F766E` |
| Primary Dark       | Deep Teal      | `#134E4A` |
| Accent             | Soft Amber     | `#FBBF24` |
| Background         | Soft Slate     | `#F8FAFC` |
| Text               | Slate          | `#1E293B` |

الألوان مختارة لتكون **غير تقليدية** وبسيطة ومتناسقة، تعطي إحساس عصري ونظيف مناسب لمتجر أجهزة كهربائية.

---

## 🔐 متغيرات البيئة المطلوبة

### Backend (`.env`)
```
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
GOOGLE_CLIENT_ID=...
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=...
VITE_GOOGLE_CLIENT_ID=...
```

---

## 📝 ملاحظات

- الـ Navbar يظهر مباشرة بدون رسالة "Checking authentication".
- اللوجو موجود في `/public/logo.svg` ويُستخدم أيضاً كـ Favicon.
- المشروع يدعم RTL بشكل كامل عند اختيار اللغة العربية.

---

## 📄 الترخيص

MIT

---

صُنع بـ ❤️ باستخدام MERN Stack
