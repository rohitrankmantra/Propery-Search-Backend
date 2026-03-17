import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
   
    status: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    location: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },

    sqft: {
      type: Number,
      required: true,
    },

    carpetArea: {
      type: Number,
    },

    superBuiltUpArea: {
      type: Number,
    },

    landmarks: [
      {
        name: String,
        distance: String,
      },
    ],

    description: {
      type: String,
      required: true,
    },

    // Images (Cloudinary URLs)
    image: {
      type: String,
      required: true,
    },
    image1: String,
    image2: String,
    image3: String,
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
