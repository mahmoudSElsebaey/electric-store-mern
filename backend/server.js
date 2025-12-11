import express from "express";
import { connectDB } from "./config/db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./src/modules/Products/product.route.js";
import authRoutes from "./src/modules/Auth/auth.route.js";

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
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
