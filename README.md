# ⚡ Electrical Store – Full MERN E-Commerce Platform

A complete, production-ready e-commerce website for electrical and home appliances built with the **MERN Stack** (MongoDB, Express, React, Node.js) and TypeScript on the frontend.

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

## 📁 Project Structure

```
electric-store-mern/
├── backend/
│   ├── config/          # DB, Cloudinary, Stripe
│   ├── src/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── modules/     # Auth, Products, Orders, Payment, etc.
│   │   └── validation/
│   ├── seed.js          # Sample products, categories & brands
│   ├── createOwner.js   # Create the owner/admin account
│   └── server.js
└── frontend/
    ├── public/
    │   └── logo.svg
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── locales/     # ar / en translations
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env          # Fill in your environment variables
npm install
node createOwner.js           # Create the owner account (run once)
npm run seed                  # (Optional) Seed products, categories & brands
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env          # Set VITE_API_URL and other keys
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 🔐 Demo / Dummy Accounts

After running `node createOwner.js` you will have:

| Role   | Email              | Password   |
|--------|--------------------|------------|
| Owner  | `owner@gmail.com`  | `owner123` |

> **Note:** Regular user accounts can be created via the Register page.  
> The seed script (`npm run seed`) populates categories, brands and products only.

### Recommended Testing Flow
1. Login as **Owner** → access Admin Dashboard
2. Create a regular user account from the Register page
3. Browse products, add to cart/wishlist, place an order
4. Switch back to Owner to manage the order

---

## 🎨 Design System

| Role            | Color       | Hex       |
|-----------------|-------------|-----------|
| Primary         | Teal        | `#0F766E` |
| Primary Dark    | Deep Teal   | `#134E4A` |
| Accent          | Soft Amber  | `#FBBF24` |
| Background      | Soft Slate  | `#F8FAFC` |
| Text            | Slate       | `#1E293B` |

The palette is clean, modern and distinctive — suitable for an electronics store.

---

## 🔧 Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
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

## 📝 Notes

- The Navbar appears immediately (no “Checking authentication…” flash).
- Logo is located at `/public/logo.svg` and is also used as the favicon.
- Full RTL support when Arabic is selected.
- Scroll-to-top button appears after scrolling 400px and matches the brand colors.

---

## 📄 License

MIT

---

Built with ❤️ using the MERN Stack
