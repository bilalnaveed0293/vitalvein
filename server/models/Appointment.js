const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donationCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DonationCenter",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "no-show"],
    default: "scheduled",
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

module.exports = mongoose.model("Appointment", AppointmentSchema)

