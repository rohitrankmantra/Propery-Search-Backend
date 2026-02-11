import TourBooking from "../models/TourBooking.model.js";
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * CREATE TOUR BOOKING + SEND MAIL (SIMPLE LIKE CONTACT FORM)
 */
export const createTourBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      numberOfPeople,
      guestType,
      message,
      propertyId,
    } = req.body;

    // Basic validation
    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const tourBooking = await TourBooking.create({
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      numberOfPeople,
      guestType,
      message,
      propertyId,
    });

    // Send mail separately (so DB save doesn't fail)
    try {
      await transporter.sendMail({
        from: `"Property Search Tour Bookings" <${process.env.MAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Tour Booking Request",
        html: `
          <h2>New Tour Booking Request</h2>
          <p><b>Name:</b> ${tourBooking.name}</p>
          <p><b>Email:</b> ${tourBooking.email}</p>
          <p><b>Phone:</b> ${tourBooking.phone}</p>
          <p><b>Preferred Date:</b> ${new Date(tourBooking.preferredDate).toLocaleDateString()}</p>
          <p><b>Preferred Time:</b> ${tourBooking.preferredTime}</p>
          <p><b>Number of Guests:</b> ${tourBooking.numberOfPeople}</p>
          <p><b>Guest Type:</b> ${tourBooking.guestType}</p>
          ${tourBooking.message ? `<p><b>Message:</b><br/>${tourBooking.message}</p>` : ""}
        `,
      });
    } catch (mailError) {
      console.error("Mail Error:", mailError);
    }

    res.status(201).json({
      success: true,
      message: "Tour booking submitted successfully",
    });

  } catch (error) {
    console.error("Tour Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit tour booking",
    });
  }
};

/**
 * GET ALL TOUR BOOKINGS (ADMIN) - SIMPLE
 */
export const getTourBookings = async (req, res) => {
  try {
    const tourBookings = await TourBooking.find().sort({ createdAt: -1 });
    res.json(tourBookings);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tour bookings" });
  }
};

/**
 * GET TOUR BOOKINGS FOR A PROPERTY
 */
export const getTourBookingsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const tourBookings = await TourBooking.find({ propertyId }).sort({ createdAt: -1 });
    res.json(tourBookings);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tour bookings" });
  }
};

/**
 * GET SINGLE TOUR BOOKING
 */
export const getTourBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const tourBooking = await TourBooking.findById(id);

    if (!tourBooking) {
      return res.status(404).json({ success: false, message: "Tour booking not found" });
    }

    res.json(tourBooking);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tour booking" });
  }
};

/**
 * UPDATE TOUR BOOKING STATUS (ADMIN)
 */
export const updateTourBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const tourBooking = await TourBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!tourBooking) {
      return res.status(404).json({ success: false, message: "Tour booking not found" });
    }

    res.json({
      success: true,
      message: "Tour booking updated successfully",
      tourBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update tour booking" });
  }
};

/**
 * DELETE TOUR BOOKING - SIMPLE
 */
export const deleteTourBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await TourBooking.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
