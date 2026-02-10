import TourBooking from "../models/TourBooking.model.js";
import Property from "../models/Property.model.js";
import transporter from "../config/nodemailer.js";

/**
 * CREATE TOUR BOOKING + SEND MAIL
 */
export const createTourBooking = async (req, res) => {
  try {
    const { propertyId, name, email, phone, preferredDate, preferredTime, numberOfPeople, guestType, message } = req.body;

    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Create tour booking
    const tourBooking = await TourBooking.create({
      propertyId,
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      numberOfPeople,
      guestType,
      message,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Property Search Tours" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Tour Booking Confirmation - ${property.title}`,
      html: `
        <h2>Tour Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for booking a tour with us!</p>
        <hr/>
        <h3>Booking Details:</h3>
        <p><b>Property:</b> ${property.title}</p>
        <p><b>Location:</b> ${property.location}, ${property.city}</p>
        <p><b>Preferred Date:</b> ${new Date(preferredDate).toLocaleDateString()}</p>
        <p><b>Preferred Time:</b> ${preferredTime}</p>
        <p><b>Number of Guests:</b> ${numberOfPeople}</p>
        <p><b>Guest Type:</b> ${guestType}</p>
        ${message ? `<p><b>Additional Message:</b><br/>${message}</p>` : ""}
        <hr/>
        <p>We will confirm your tour booking shortly. Please check your email for further updates.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br/>Property Search Team</p>
      `,
    });

    // Send notification to admin
    await transporter.sendMail({
      from: `"Property Search Tours" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Tour Booking - ${property.title}`,
      html: `
        <h2>New Tour Booking Request</h2>
        <p><b>Property:</b> ${property.title}</p>
        <p><b>Location:</b> ${property.location}, ${property.city}</p>
        <hr/>
        <h3>Guest Information:</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Guest Type:</b> ${guestType}</p>
        <p><b>Number of Guests:</b> ${numberOfPeople}</p>
        <hr/>
        <h3>Tour Details:</h3>
        <p><b>Preferred Date:</b> ${new Date(preferredDate).toLocaleDateString()}</p>
        <p><b>Preferred Time:</b> ${preferredTime}</p>
        ${message ? `<p><b>Message:</b><br/>${message}</p>` : ""}
        <hr/>
        <p>Log in to the admin panel to confirm or manage this booking.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Tour booking created successfully",
      tourBooking,
    });
  } catch (error) {
    console.error("Tour Booking Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create tour booking",
    });
  }
};

/**
 * GET ALL TOUR BOOKINGS (ADMIN)
 */
export const getTourBookings = async (req, res) => {
  try {
    const tourBookings = await TourBooking.find()
      .populate("propertyId", "title location city image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tourBookings.length,
      tourBookings,
    });
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

    res.json({
      success: true,
      count: tourBookings.length,
      tourBookings,
    });
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

    const tourBooking = await TourBooking.findById(id).populate("propertyId");

    if (!tourBooking) {
      return res.status(404).json({ success: false, message: "Tour booking not found" });
    }

    res.json({
      success: true,
      tourBooking,
    });
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
    ).populate("propertyId");

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
 * DELETE TOUR BOOKING
 */
export const deleteTourBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const tourBooking = await TourBooking.findByIdAndDelete(id);

    if (!tourBooking) {
      return res.status(404).json({ success: false, message: "Tour booking not found" });
    }

    res.json({
      success: true,
      message: "Tour booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete tour booking" });
  }
};
