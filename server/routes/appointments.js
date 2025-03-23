const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")
const User = require("../models/User")
const Appointment = require("../models/Appointment")
const DonationCenter = require("../models/DonationCenter")

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Donors only)
router.post("/", auth, async (req, res) => {
  try {
    // Check if user is a donor
    if (req.user.userType !== "donor") {
      return res.status(403).json({ message: "Only donors can create appointments" })
    }

    // Check if donor is eligible
    const user = await User.findById(req.user.id)
    if (!user.checkEligibility()) {
      return res.status(400).json({
        message: "You are not eligible to donate at this time. Please wait at least 8 weeks between donations.",
      })
    }

    const { donationCenterId, date, notes } = req.body

    // Check if donation center exists
    const donationCenter = await DonationCenter.findById(donationCenterId)
    if (!donationCenter) {
      return res.status(404).json({ message: "Donation center not found" })
    }

    // Create new appointment
    const appointment = new Appointment({
      donor: req.user.id,
      donationCenter: donationCenterId,
      date: new Date(date),
      notes,
    })

    await appointment.save()

    res.status(201).json(appointment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/appointments
// @desc    Get all appointments for current user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ donor: req.user.id })
      .populate("donationCenter", "name address city state")
      .sort({ date: -1 })

    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/appointments/history
// @desc    Get donation history for current user
// @access  Private (Donors only)
router.get("/history", auth, async (req, res) => {
  try {
    // Check if user is a donor
    if (req.user.userType !== "donor") {
      return res.status(403).json({ message: "Only donors can view donation history" })
    }

    // Get completed appointments
    const completedAppointments = await Appointment.find({
      donor: req.user.id,
      status: "completed",
    })
      .populate("donationCenter", "name address city state")
      .sort({ date: -1 })

    res.json(completedAppointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body

    // Find appointment
    let appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Check if user owns this appointment or is admin
    if (appointment.donor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Update appointment
    appointment = await Appointment.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true }).populate(
      "donationCenter",
      "name address city state",
    )

    // If appointment is completed, update user's last donation date
    if (status === "completed") {
      await User.findByIdAndUpdate(appointment.donor, {
        $set: { lastDonation: new Date() },
        $inc: { donationCount: 1 },
        $set: { isVerified: true },
      })
    }

    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find appointment
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Check if user owns this appointment
    if (appointment.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Check if appointment is in the future
    if (new Date(appointment.date) <= new Date()) {
      return res.status(400).json({ message: "Cannot cancel past appointments" })
    }

    // Update status to cancelled instead of deleting
    await Appointment.findByIdAndUpdate(req.params.id, { $set: { status: "cancelled" } })

    res.json({ message: "Appointment cancelled" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/appointments/admin/all
// @desc    Get all appointments (admin only)
// @access  Private/Admin
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("donor", "name email phone bloodType isVerified donationCount")
      .populate("donationCenter", "name address city state")
      .sort({ date: -1 })

    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/appointments/admin/:id
// @desc    Delete appointment (admin only)
// @access  Private/Admin
router.delete("/admin/:id", adminAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    await Appointment.findByIdAndDelete(req.params.id)
    res.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/appointments/admin/:id
// @desc    Update appointment status (admin only)
// @access  Private/Admin
router.put("/admin/:id", adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body

    // Find appointment
    let appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Update appointment
    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: { status, notes } },
      { new: true },
    ).populate("donationCenter", "name address city state")

    // If appointment is completed, update user's last donation date and verify the donor
    if (status === "completed") {
      await User.findByIdAndUpdate(appointment.donor, {
        $set: {
          lastDonation: new Date(),
          isVerified: true,
        },
        $inc: { donationCount: 1 },
      })
    }

    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

