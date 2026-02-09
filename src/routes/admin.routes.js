import express from "express";
import { loginAdmin, logoutAdmin, getMe } from "../controllers/admin.controller.js";
import { adminAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.get("/me", adminAuth, getMe);

export default router;
