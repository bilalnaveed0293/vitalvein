const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")
const Campaign = require("../models/Campaign")
const User = require("../models/User")

// @route   POST /api/campaigns
// @desc    Create a new campaign (admin only)
// @access  Private/Admin
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, bloodTypesNeeded, goal, image } = req.body

    // Create new campaign
    const campaign = new Campaign({
      title,
      description,
      startDate,
      endDate,
      location,
      bloodTypesNeeded: bloodTypesNeeded || ["All"],
      goal,
      image: image || "",
      organizer: req.user.id,
      status: new Date(startDate) <= new Date() && new Date(endDate) >= new Date() ? "active" : "upcoming",
    })

    await campaign.save()

    res.status(201).json(campaign)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/campaigns
// @desc    Get all campaigns
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { status } = req.query

    // Build query
    const query = {}
    if (status) {
      query.status = status
    }

    const campaigns = await Campaign.find(query).populate("organizer", "name").sort({ startDate: 1 })

    res.json(campaigns)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/campaigns/:id
// @desc    Get campaign by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("organizer", "name")
      .populate("participants.donor", "name bloodType isVerified")

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" })
    }

    res.json(campaign)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/campaigns/:id
// @desc    Update campaign (admin only)
// @access  Private/Admin
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, bloodTypesNeeded, goal, image, status } = req.body

    // Build campaign object
    const campaignFields = {}
    if (title) campaignFields.title = title
    if (description) campaignFields.description = description
    if (startDate) campaignFields.startDate = startDate
    if (endDate) campaignFields.endDate = endDate
    if (location) campaignFields.location = location
    if (bloodTypesNeeded) campaignFields.bloodTypesNeeded = bloodTypesNeeded
    if (goal) campaignFields.goal = goal
    if (image) campaignFields.image = image
    if (status) campaignFields.status = status

    // If startDate and endDate are provided, update status automatically
    if (startDate && endDate) {
      const now = new Date()
      const start = new Date(startDate)
      const end = new Date(endDate)

      if (now < start) {
        campaignFields.status = "upcoming"
      } else if (now >= start && now <= end) {
        campaignFields.status = "active"
      } else if (now > end) {
        campaignFields.status = "completed"
      }
    }

    // Update campaign
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { $set: campaignFields }, { new: true }).populate(
      "organizer",
      "name",
    )

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" })
    }

    res.json(campaign)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/campaigns/:id
// @desc    Delete campaign (admin only)
// @access  Private/Admin
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" })
    }

    await Campaign.findByIdAndDelete(req.params.id)

    res.json({ message: "Campaign deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/campaigns/:id/signup
// @desc    Sign up for a campaign
// @access  Private (Donors only)
router.post("/:id/signup", auth, async (req, res) => {
  try {
    // Check if user is a donor
    if (req.user.userType !== "donor") {
      return res.status(403).json({ message: "Only donors can sign up for campaigns" })
    }

    const campaign = await Campaign.findById(req.params.id)

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" })
    }

    // Check if campaign is active or upcoming
    if (campaign.status === "completed" || campaign.status === "cancelled") {
      return res.status(400).json({ message: "Cannot sign up for a completed or cancelled campaign" })
    }

    // Check if user is already signed up
    const alreadySignedUp = campaign.participants.some((participant) => participant.donor.toString() === req.user.id)

    if (alreadySignedUp) {
      return res.status(400).json({ message: "You are already signed up for this campaign" })
    }

    // Add user to participants
    campaign.participants.push({
      donor: req.user.id,
      status: "signed",
    })

    await campaign.save()

    res.json(campaign)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/campaigns/:id/status
// @desc    Update participant status in campaign (admin only)
// @access  Private/Admin
router.put("/:id/status/:userId", adminAuth, async (req, res) => {
  try {
    const { status } = req.body

    if (!["signed", "donated", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const campaign = await Campaign.findById(req.params.id)

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" })
    }

    // Find participant
    const participantIndex = campaign.participants.findIndex((p) => p.donor.toString() === req.params.userId)

    if (participantIndex === -1) {
      return res.status(404).json({ message: "Participant not found" })
    }

    // Update status
    campaign.participants[participantIndex].status = status

    // If status is donated, update user's donation count and verification
    if (status === "donated") {
      await User.findByIdAndUpdate(req.params.userId, {
        $inc: { donationCount: 1 },
        $set: {
          lastDonation: new Date(),
          isVerified: true,
        },
      })
    }

    await campaign.save()

    res.json(campaign)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/campaigns/user/signed
// @desc    Get campaigns user has signed up for
// @access  Private
router.get("/user/signed", auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      "participants.donor": req.user.id,
    })
      .populate("organizer", "name")
      .sort({ startDate: 1 })

    res.json(campaigns)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

