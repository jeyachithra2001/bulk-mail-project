import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const validEmail = email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();
  const validPassword = password === process.env.ADMIN_PASSWORD;

  if (!validEmail || !validPassword) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign(
    { email: process.env.ADMIN_EMAIL, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({
    message: "Login successful.",
    token,
    admin: { email: process.env.ADMIN_EMAIL }
  });
});

export default router;
