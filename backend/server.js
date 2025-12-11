import express from "express";
import { connectDB } from "./config/db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/modules/Auth/auth.route.js";
import productRoutes from "./src/modules/Products/product.route.js";
import brandRoutes from "./src/modules/Brand/brand.route.js";
import categoryRoutes from "./src/modules/Category/category.route.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",  
    credentials: true,
  })
);
// app.options("*", cors());
app.use(cookieParser());
app.use(express.json());
connectDB();

// app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
