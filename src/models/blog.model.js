// models/blog.model.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // thumbnail
      required: true,
    },

    image1: {
      type: String,
      default: "",
    },

    image2: {
      type: String,
      default: "",
    },

    image3: {
      type: String,
      default: "",
    },

    excerpt: {
      type: String,
      default: "",
    },

    content: {
      type: String, // HTML allowed (h2, p, etc)
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
