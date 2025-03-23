const mongoose = require("mongoose")
const User = require("../models/User")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Function to create an admin user
async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@blooddonate.org" })

    if (adminExists) {
      console.log("Admin user already exists")
      mongoose.connection.close()
      return
    }

    // Create admin user
    const adminUser = new User({
      name: "System Administrator",
      email: "admin@blooddonate.org",
      password: "admin123", // This will be hashed by the pre-save hook
      phone: "123-456-7890",
      userType: "admin",
      location: "System",
      role: "admin",
    })

    await adminUser.save()
    console.log("Admin user created successfully")
    console.log("Email: admin@blooddonate.org")
    console.log("Password: admin123")
    console.log("Please change this password after first login")

    mongoose.connection.close()
  } catch (error) {
    console.error("Error creating admin user:", error)
    mongoose.connection.close()
  }
}

// Run the function
createAdminUser()

