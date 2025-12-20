import express from "express";
import { register, login, getMe, updateProfile, logout, makeAdmin, getAllUsers, deleteUser } from "./auth.controller.js";
import { owner, protect } from "../../middlewares/authMiddleware.js";

import { validate } from "../../middlewares/validate.js";
import { registerSchema, loginSchema } from "../../validation/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", protect, getMe);
router.post("/logout", logout);
router.put("/profile", protect, updateProfile);

//_________________________________ Owner Routes _________________________________
router.delete("/users/:email", protect, owner, deleteUser);
router.get("/users", protect, owner, getAllUsers);
router.put("/make-admin", protect, owner, makeAdmin);

export default router;