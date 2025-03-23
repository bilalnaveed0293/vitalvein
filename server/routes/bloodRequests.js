const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")
const BloodRequest = require("../models/BloodRequest")
const User = require("../models/User")

// @route   POST /api/blood-requests
// @desc    Create a new blood request
// @access  Private (Recipients only)
router.post("/", auth, async (req, res) => {
  try {
    // Check if user is a recipient
    if (req.user.userType !== "recipient" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only recipients can create blood requests" })
    }

    const { bloodType, quantity, urgency, hospital, location, notes } = req.body

    // Create new blood request
    const bloodRequest = new BloodRequest({
      recipient: req.user.id,
      bloodType,
      quantity,
      urgency,
      hospital,
      location,
      notes,
    })

    await bloodRequest.save()

    res.status(201).json(bloodRequest)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/blood-requests
// @desc    Get all blood requests for current user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find({ recipient: req.user.id }).sort({ createdAt: -1 })

    res.json(bloodRequests)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/blood-requests/available
// @desc    Get all approved blood requests
// @access  Private (Donors only)
router.get("/available", auth, async (req, res) => {
  try {
    // Check if user is a donor
    if (req.user.userType !== "donor") {
      return res.status(403).json({ message: "Only donors can view available requests" })
    }

    // Get donor's blood type
    const donor = await User.findById(req.user.id)

    // Determine compatible blood types based on donor's blood type
    let compatibleTypes = []
    switch (donor.bloodType) {
      case "O-":
        compatibleTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
        break
      case "O+":
        compatibleTypes = ["O+", "A+", "B+", "AB+"]
        break
      case "A-":
        compatibleTypes = ["A-", "A+", "AB-", "AB+"]
        break
      case "A+":
        compatibleTypes = ["A+", "AB+"]
        break
      case "B-":
        compatibleTypes = ["B-", "B+", "AB-", "AB+"]
        break
      case "B+":
        compatibleTypes = ["B+", "AB+"]
        break
      case "AB-":
        compatibleTypes = ["AB-", "AB+"]
        break
      case "AB+":
        compatibleTypes = ["AB+"]
        break
      default:
        compatibleTypes = []
    }

    // Find approved requests with compatible blood types
    const bloodRequests = await BloodRequest.find({
      status: "approved",
      bloodType: { $in: compatibleTypes },
    })
      .populate("recipient", "name location")
      .sort({ urgency: -1, createdAt: -1 })

    res.json(bloodRequests)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/blood-requests/:id
// @desc    Update blood request status (admin only)
// @access  Private/Admin
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body

    // Update blood request
    const bloodRequest = await BloodRequest.findByIdAndUpdate(req.params.id, { $set: { status, notes } }, { new: true })

    if (!bloodRequest) {
      return res.status(404).json({ message: "Blood request not found" })
    }

    res.json(bloodRequest)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/blood-requests/admin/all
// @desc    Get all blood requests (admin only)
// @access  Private/Admin
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find()
      .populate("recipient", "name email phone location")
      .sort({ urgency: -1, createdAt: -1 })

    res.json(bloodRequests)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

