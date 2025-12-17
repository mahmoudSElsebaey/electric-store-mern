import express from "express";
import { register, login, getMe, updateProfile, logout, makeAdmin, getAllUsers, deleteUser } from "./auth.controller.js";
import { owner, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.put("/profile", protect, updateProfile);

//_________________________________ Owner Routes _________________________________
router.delete("/users/:email", protect, owner, deleteUser); 
router.get("/users", protect, owner, getAllUsers); 
router.put("/make-admin", protect, owner, makeAdmin); 


export default router;