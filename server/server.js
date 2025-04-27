const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const feedbackRoutes = require('./routes/feedback');
const authMiddleware = require('./middleware/auth');
// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const appointmentRoutes = require("./routes/appointments")
const bloodRequestRoutes = require("./routes/bloodRequests")
const donationCenterRoutes = require("./routes/donationCenters")
const campaignRoutes = require("./routes/campaign")
//const debugRoutes = require("./routes/debug") // Add debug routes

// Initialize express app
const app = express()

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5176"],
    credentials: true,
  }),
)
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    console.error("Please check your MONGODB_URI environment variable and ensure MongoDB is running")
  })
// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/blood-requests", bloodRequestRoutes)
app.use("/api/donation-centers", donationCenterRoutes)
app.use("/api/campaigns", campaignRoutes)
app.use('/api/feedback', authMiddleware, feedbackRoutes);
//app.use("/api/debug", debugRoutes) // Add debug routes

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

