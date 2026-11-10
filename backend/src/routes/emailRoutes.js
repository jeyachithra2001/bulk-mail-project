import { Router } from "express";
import nodemailer from "nodemailer";
import Email from "../models/Email.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

router.post("/api/emails/send", requireAuth, async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;
    if (!subject?.trim() || !body?.trim() || !Array.isArray(recipients)) {
      return res.status(400).json({ message: "Subject, message, and recipients are required." });
    }

    const uniqueRecipients = [...new Set(
      recipients.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
    )];

    if (!uniqueRecipients.length) {
      return res.status(400).json({ message: "Enter at least one recipient email." });
    }
    if (uniqueRecipients.length > 100) {
      return res.status(400).json({ message: "Maximum 100 recipients per batch in this demo." });
    }

    const invalid = uniqueRecipients.filter((email) => !validEmail(email));
    if (invalid.length) {
      return res.status(400).json({
        message: "Some email addresses are invalid.",
        invalidEmails: invalid
      });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ message: "SMTP credentials are not configured in backend/.env." });
    }

    const transporter = createTransporter();
    const results = [];

    // Send individually so the app can record the status for each recipient.
    for (const recipient of uniqueRecipients) {
      try {
        const info = await transporter.sendMail({
          from: `"${process.env.MAIL_FROM_NAME || "Bulk Mail App"}" <${process.env.SMTP_USER}>`,
          to: recipient,
          subject: subject.trim(),
          text: body
        });
        results.push({ email: recipient, status: "sent", messageId: info.messageId || "" });
      } catch (error) {
        results.push({ email: recipient, status: "failed", error: error.message });
      }
    }

    const sentCount = results.filter((item) => item.status === "sent").length;
    const failedCount = results.length - sentCount;
    const record = await Email.create({
      subject: subject.trim(),
      body,
      recipients: results,
      totalRecipients: results.length,
      sentCount,
      failedCount,
      status: sentCount === results.length ? "sent" : sentCount > 0 ? "partial" : "failed"
    });

    return res.status(201).json({
      message: `Sending finished: ${sentCount} sent, ${failedCount} failed.`,
      email: record
    });
  } catch (error) {
    console.error("Bulk send error:", error);
    return res.status(500).json({ message: "Unable to process emails. Check the server logs." });
  }
});

router.get("/api/emails/history", requireAuth, async (_req, res) => {
  try {
    const history = await Email.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: "Could not load email history." });
  }
});

router.get("/history/:id", requireAuth, async (req, res) => {
  try {
    const item = await Email.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Email record not found." });
    res.json({ email: item });
  } catch {
    res.status(400).json({ message: "Invalid history ID." });
  }
});

export default router;
