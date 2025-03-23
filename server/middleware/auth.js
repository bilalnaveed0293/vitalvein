const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "")

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user by id
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

// Admin middleware - checks if user is authenticated AND is an admin
module.exports.adminAuth = async (req, res, next) => {
  try {
    // First run the regular auth middleware
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user by id
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

