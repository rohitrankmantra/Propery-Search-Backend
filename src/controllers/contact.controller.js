import Contact from "../models/contact.model.js";
import transporter from "../config/nodemailer.js";

/**
 * CREATE CONTACT + SEND MAIL
 */
export const createContact = async (req, res) => {
  try {
    const { name, email, message, phone, propertyInterest, bestTime } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
      phone,
      propertyInterest,
      bestTime,
    });

    // Send mail separately (so DB save doesn't fail if mail fails)
    try {
      await transporter.sendMail({
        from: `"Property Search Contact Form" <${process.env.MAIL_USER}}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Contact Inquiry",
        html: `
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${contact.name}</p>
          <p><b>Email:</b> ${contact.email}</p>
          <p><b>Phone:</b> ${contact.phone || "-"}</p>
          <p><b>Interest:</b> ${contact.propertyInterest || "-"}</p>
          <p><b>Best Time:</b> ${contact.bestTime || "-"}</p>
          <p><b>Message:</b><br/>${contact.message}</p>
        `,
      });
    } catch (mailError) {
      console.error("Mail Error:", mailError);
    }

    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
    });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/**
 * GET ALL CONTACTS (ADMIN)
 */
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};


/**
 * DELETE CONTACT
 */
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
