import express from "express";
import { connectDB } from "./config/db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/modules/Auth/auth.route.js";
import productRoutes from "./src/modules/Products/product.route.js";
import brandRoutes from "./src/modules/Brand/brand.route.js";
import categoryRoutes from "./src/modules/Category/category.route.js";
import orderRoutes from "./src/modules/Orders/order.route.js";
import paymentRoutes from "./src/modules/Payment/payment.routes.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// مهم جدًا: دول لازم يكونوا في البداية خالص قبل أي route أو middleware تاني
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // لو عندك cookies
  })
);
app.use(cookieParser());
app.use(express.json()); // ← ده اللي بيقرأ req.body !! لازم يكون موجود وفي المكان ده

// لو عندك webhook لـ Stripe، حطه بعد كده بس مع raw body
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
connectDB();

// app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
