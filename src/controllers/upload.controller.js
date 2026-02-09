import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folder = req.body.folder || "properties";

    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};
