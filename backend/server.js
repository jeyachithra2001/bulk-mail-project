import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import emailRoutes from "./src/routes/emailRoutes.js";

dotenv.config();
const app = express();

const allowedOrigin = ["https://bulk-mail-project-mauve.vercel.app", "http://localhost:5173",]
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigin.includes(origin)) return cb(null, true)
    cb(new Error("Not allowed by CORS"))
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Tupe", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.json({ message: "Bulk Mail API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
