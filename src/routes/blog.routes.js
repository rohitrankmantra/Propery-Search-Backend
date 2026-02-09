import express from "express";
import { adminAuth } from "../middleware/auth.middleware.js";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);

// ADMIN ROUTES
router.post("/", adminAuth, createBlog);
router.put("/:id", adminAuth, updateBlog);
router.delete("/:id", adminAuth, deleteBlog);

export default router;
