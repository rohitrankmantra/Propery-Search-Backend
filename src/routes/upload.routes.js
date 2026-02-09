import express from "express";
import upload from "../middleware/multer.middleware.js";
import { adminAuth } from "../middleware/auth.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

// Single image upload
router.post("/", adminAuth, upload.single("image"), uploadImage);

export default router;
