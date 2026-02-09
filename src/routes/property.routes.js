import express from "express";
import { adminAuth } from "../middleware/auth.middleware.js";

import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

const router = express.Router();

// CREATE property
router.post("/", adminAuth, createProperty);

// GET all properties
router.get("/", adminAuth, getAllProperties);

// GET single property
router.get("/:id", adminAuth, getPropertyById);

// UPDATE property
router.put("/:id", adminAuth, updateProperty);

// DELETE property
router.delete("/:id", adminAuth, deleteProperty);

export default router;
