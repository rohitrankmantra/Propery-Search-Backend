import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./src/config/db.js";
import adminRoutes from "./src/routes/admin.routes.js";
import propertyRoutes from "./src/routes/property.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import blogRoutes from "./src/routes/blog.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";

dotenv.config();

const app = express();

// connect DB
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://new-property-lyart.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// routes
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.send("API running"));

app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);   // ✅ NEW
app.use("/api/properties", propertyRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
