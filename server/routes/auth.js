const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request received:", req.body)
    const { name, email, password, userType, bloodType, location, phone } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      console.log("User already exists with email:", email)
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      userType,
      bloodType: userType === "donor" ? bloodType : "",
      location,
      phone,
    })

    await user.save()
    console.log("User registered successfully:", user._id)

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        bloodType: user.bloodType,
        location: user.location,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Server error during registration:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        bloodType: user.bloodType,
        location: user.location,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

