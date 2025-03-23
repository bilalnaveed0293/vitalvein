const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")
const DonationCenter = require("../models/DonationCenter")

// @route   GET /api/donation-centers
// @desc    Get all donation centers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const donationCenters = await DonationCenter.find().sort({ name: 1 })

    res.json(donationCenters)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/donation-centers/nearby
// @desc    Get nearby donation centers
// @access  Public
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50 } = req.query

    console.log("Nearby search request:", { lat, lng, maxDistance })

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" })
    }

    const latitude = Number.parseFloat(lat)
    const longitude = Number.parseFloat(lng)
    const distance = Number.parseInt(maxDistance)

    console.log("Parsed coordinates:", { latitude, longitude, distance })

    if (isNaN(latitude) || isNaN(longitude) || isNaN(distance)) {
      return res.status(400).json({ message: "Invalid coordinates or distance" })
    }

    // Find centers within maxDistance kilometers
    const donationCenters = await DonationCenter.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: distance * 1000, // Convert to meters
        },
      },
    }).limit(10)

    console.log(`Found ${donationCenters.length} centers near [${latitude}, ${longitude}]`)

    res.json(donationCenters)
  } catch (error) {
    console.error("Error in nearby donation centers:", error)
    res.status(500).json({ message: "Server error", error: error.toString() })
  }
})

// @route   GET /api/donation-centers/:id
// @desc    Get donation center by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const donationCenter = await DonationCenter.findById(req.params.id)

    if (!donationCenter) {
      return res.status(404).json({ message: "Donation center not found" })
    }

    res.json(donationCenter)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/donation-centers
// @desc    Create a new donation center (admin only)
// @access  Private/Admin
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, address, city, state, zipCode, phone, email, operatingHours, coordinates } = req.body

    // Create new donation center
    const donationCenter = new DonationCenter({
      name,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      operatingHours,
      location: {
        type: "Point",
        coordinates,
      },
    })

    await donationCenter.save()

    res.status(201).json(donationCenter)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/donation-centers/:id
// @desc    Update donation center (admin only)
// @access  Private/Admin
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const donationCenter = await DonationCenter.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

    if (!donationCenter) {
      return res.status(404).json({ message: "Donation center not found" })
    }

    res.json(donationCenter)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

