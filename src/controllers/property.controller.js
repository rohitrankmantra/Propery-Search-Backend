import Property from "../models/Property.model.js";

/**
 * CREATE PROPERTY (NO CLOUDINARY HERE)
 */
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      city,
      location,
      price,
      beds,
      baths,
      sqft,
      description,
      status,
      image,
      image1,
      image2,
      image3,
    } = req.body;

    if (!status || !["buy", "sell"].includes(status)) {
      return res.status(400).json({ message: "Invalid property status" });
    }

    if (!title || !city || !location || !price || !beds || !baths || !sqft || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!image) {
      return res.status(400).json({ message: "Main image URL is required" });
    }

    const property = await Property.create({
      title,
      city,
      location,
      price,
      beds,
      baths,
      sqft,
      description,
      status,
      image,
      image1,
      image2,
      image3,
    });

    res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
};

/**
 * GET ALL PROPERTIES
 */
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      items: properties,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

/**
 * GET SINGLE PROPERTY
 */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

/**
 * UPDATE PROPERTY (ONLY URL UPDATE)
 */
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const fields = [
      "title",
      "city",
      "location",
      "price",
      "beds",
      "baths",
      "sqft",
      "description",
      "status",
      "image",
      "image1",
      "image2",
      "image3",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    await property.save();

    res.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ message: "Failed to update property" });
  }
};

/**
 * DELETE PROPERTY
 */
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};


/**
 * GET PROPERTIES BY CITY (PUBLIC)
 */
export const getPropertiesByCity = async (req, res) => {
  try {
    const city = req.params.city;

    const properties = await Property.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      city,
      count: properties.length,
      items: properties,
    });
  } catch (error) {
    console.error("Get properties by city error:", error);
    res.status(500).json({ message: "Failed to fetch properties by city" });
  }
};

