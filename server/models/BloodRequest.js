const mongoose = require("mongoose")

const BloodRequestSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  hospital: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "fulfilled", "rejected"],
    default: "pending",
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("BloodRequest", BloodRequestSchema)

