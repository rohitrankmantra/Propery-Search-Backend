import { verifyToken } from "../utils/jwt.js";

export const adminAuth = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
