const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["donor", "recipient", "admin"],
    default: "donor",
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
    default: "",
  },
  location: {
    type: String,
    required: true,
  },
  lastDonation: {
    type: Date,
    default: null,
  },
  isEligible: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  donationCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    console.log("Hashing password for user:", this.email)
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    console.error("Error hashing password:", error)
    next(error)
  }
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Method to check if donor is eligible
UserSchema.methods.checkEligibility = function () {
  if (this.userType !== "donor") return false

  if (!this.lastDonation) return true

  // Check if last donation was more than 56 days ago (8 weeks)
  const eightWeeksAgo = new Date()
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)

  return this.lastDonation < eightWeeksAgo
}

module.exports = mongoose.model("User", UserSchema)

