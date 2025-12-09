import express from "express";
import { connectDB } from "./config/db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./src/modules/Products/product.route.js";
import authRoutes from "./src/modules/Auth/auth.route.js";

dotenv.config();

// console.log("ENV Values:", {
//   name: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "missing",
// });

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

// app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
