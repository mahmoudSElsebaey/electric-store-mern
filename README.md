# ⚡ Volt Store – Full MERN E-Commerce Platform

A complete, production-ready e-commerce website for home electrical appliances built with the **MERN Stack** (MongoDB, Express, React, Node.js) and TypeScript on the frontend.

**Live Demo:** [https://electric-store-mern.vercel.app](https://electric-store-mern.vercel.app)

---

## ✨ Features

- User authentication (Email/Password + Google OAuth)
- Product browsing with search, filtering by category & brand
- Shopping cart + Wishlist
- Product reviews & ratings
- Full checkout flow (Stripe + PayPal)
- Role-based Admin Dashboard (Products, Orders, Users, Brands, Categories)
- Bilingual support: Arabic & English (full RTL/LTR)
- Responsive design for mobile, tablet, and desktop
- Modern design system (Teal + Amber palette)
- Scroll-to-top button matching brand identity

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 + TypeScript | UI & type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router | Navigation |
| React Hook Form + Zod | Forms & validation |
| i18next | Internationalization |
| Stripe / Google OAuth | Payments & Auth |
| Swiper + React Icons | UI components |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | API server |
| MongoDB + Mongoose | Database |
| JWT + bcrypt + Cookies | Authentication |
| Cloudinary | Image uploads |
| Stripe + PayPal | Payment gateways |
| Zod | Request validation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
node createOwner.js
npm run seed
npm run seed:reviews   # optional random product reviews
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## 🎨 Design System

| Role | Color | Hex |
|------|-------|-----|
| Primary | Teal | `#0F766E` |
| Accent | Soft Amber | `#FBBF24` |

Brand name: **Volt Store** / **فولت ستور**

---

## 📄 License

MIT

Built with ❤️ — Volt Store
