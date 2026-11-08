import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed"], required: true },
  error: { type: String, default: "" },
  messageId: { type: String, default: "" }
}, { _id: false });

const emailSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  recipients: { type: [recipientSchema], default: [] },
  totalRecipients: { type: Number, default: 0 },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  status: { type: String, enum: ["sent", "partial", "failed"], default: "failed" }
}, { timestamps: true });

export default mongoose.model("Email", emailSchema);
