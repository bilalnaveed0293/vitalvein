const mongoose = require("mongoose")

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  bloodTypesNeeded: {
    type: [String],
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "All"],
    default: ["All"],
  },
  goal: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    default: "",
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      signupDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["signed", "donated", "cancelled"],
        default: "signed",
      },
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "active", "completed", "cancelled"],
    default: "upcoming",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Campaign", CampaignSchema)

