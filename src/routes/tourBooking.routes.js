import express from "express";
import { adminAuth } from "../middleware/auth.middleware.js";
import {
  createTourBooking,
  getTourBookings,
  getTourBookingsByProperty,
  getTourBookingById,
  updateTourBooking,
  deleteTourBooking,
} from "../controllers/tourBooking.controller.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 */
// Create tour booking
router.post("/", createTourBooking);

// Get tour bookings for a property
router.get("/property/:propertyId", getTourBookingsByProperty);

/**
 * ADMIN ROUTES
 */
// Get all tour bookings
router.get("/", getTourBookings);

// Get single tour booking
router.get("/:id", getTourBookingById);

// Update tour booking status
router.put("/:id", adminAuth, updateTourBooking);

// Delete tour booking
router.delete("/:id", adminAuth, deleteTourBooking);

export default router;
