import { signToken } from "../utils/jwt.js";

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email !== "admin@gmail.com" || password !== "123456") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ role: "admin", email });

  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: "Admin logged in successfully",
  });
};

export const logoutAdmin = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getMe = (req, res) => {
  return res.json({
    authenticated: true,
    admin: req.admin,
  });
};
