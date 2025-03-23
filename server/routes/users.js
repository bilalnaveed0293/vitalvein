const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")
const User = require("../models/User")
const Appointment = require("../models/Appointment")
const BloodRequest = require("../models/BloodRequest")
const Campaign = require("../models/Campaign")

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, location, bloodType } = req.body

    // Build user object
    const userFields = {}
    if (name) userFields.name = name
    if (phone) userFields.phone = phone
    if (location) userFields.location = location
    if (bloodType && req.user.userType === "donor") userFields.bloodType = bloodType

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, { $set: userFields }, { new: true }).select("-password")

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/donors
// @desc    Get all eligible donors
// @access  Private
router.get("/donors", auth, async (req, res) => {
  try {
    const { bloodType, location, verified } = req.query

    // Build query
    const query = { userType: "donor", isEligible: true }
    if (bloodType) query.bloodType = bloodType
    if (location) query.location = { $regex: location, $options: "i" }
    if (verified === "true") query.isVerified = true

    const donors = await User.find(query).select("-password").sort({ isVerified: -1, name: 1 })

    res.json(donors)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/admin/all
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/admin/verify/:id
// @desc    Manually verify a donor (admin only)
// @access  Private/Admin
router.put("/admin/verify/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.userType !== "donor") {
      return res.status(400).json({ message: "Only donors can be verified" })
    }

    user.isVerified = true
    await user.save()

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/users/admin/:id
// @desc    Delete a user (admin only)
// @access  Private/Admin
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Don't allow admins to delete themselves or other admins
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" })
    }

    await User.findByIdAndDelete(req.params.id)

    // Also delete related data (appointments, blood requests, campaign participations)
    if (user.userType === "donor") {
      await Appointment.deleteMany({ donor: req.params.id })

      // Remove user from campaign participants
      await Campaign.updateMany(
        { "participants.donor": req.params.id },
        { $pull: { participants: { donor: req.params.id } } },
      )
    } else if (user.userType === "recipient") {
      await BloodRequest.deleteMany({ recipient: req.params.id })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

