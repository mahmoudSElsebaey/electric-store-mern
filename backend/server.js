import express from "express";
import { connectDB } from "./config/db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

//______________________________ Imports Routes _________________________________
import authRoutes from "./src/modules/Auth/auth.route.js";
import productRoutes from "./src/modules/Products/product.route.js";
import brandRoutes from "./src/modules/Brand/brand.route.js";
import categoryRoutes from "./src/modules/Category/category.route.js";
import orderRoutes from "./src/modules/Orders/order.route.js";
import paymentRoutes from "./src/modules/Payment/payment.routes.js";
import wishlistRoutes from "./src/modules/wishlist/wishlist.route.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://electric-store-mern.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json()); // ← ده اللي بيقرأ req.body !! لازم يكون موجود وفي المكان ده

connectDB();

// __________________________________ Routes _________________________________
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use("/api/wishlist", wishlistRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
