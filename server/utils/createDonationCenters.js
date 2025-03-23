const mongoose = require("mongoose")
const DonationCenter = require("../models/DonationCenter")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Sample donation centers with proper geolocation data
const sampleCenters = [
  {
    name: "Central Blood Bank",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "212-555-1234",
    email: "info@centralbloodbank.org",
    operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "10:00", close: "16:00" },
      sunday: { open: "10:00", close: "14:00" },
    },
    location: {
      type: "Point",
      coordinates: [-73.9857, 40.7484], // longitude, latitude for NYC
    },
  },
  {
    name: "LifeSource Blood Center",
    address: "456 Oak Avenue",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    phone: "312-555-6789",
    email: "contact@lifesource.org",
    operatingHours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "09:00", close: "17:00" },
      sunday: { open: "11:00", close: "15:00" },
    },
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781], // longitude, latitude for Chicago
    },
  },
  {
    name: "Red Cross Donation Center",
    address: "789 Pine Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    phone: "213-555-4321",
    email: "la@redcross.org",
    operatingHours: {
      monday: { open: "08:30", close: "17:30" },
      tuesday: { open: "08:30", close: "17:30" },
      wednesday: { open: "08:30", close: "17:30" },
      thursday: { open: "08:30", close: "17:30" },
      friday: { open: "08:30", close: "17:30" },
      saturday: { open: "09:00", close: "15:00" },
      sunday: { open: "Closed", close: "Closed" },
    },
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522], // longitude, latitude for LA
    },
  },
  {
    name: "Community Blood Services",
    address: "321 Elm Street",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    phone: "713-555-8765",
    email: "info@communityblood.org",
    operatingHours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "08:00", close: "16:00" },
      sunday: { open: "10:00", close: "16:00" },
    },
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604], // longitude, latitude for Houston
    },
  },
  {
    name: "Vitalant Blood Center",
    address: "555 Market Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    phone: "415-555-2345",
    email: "sf@vitalant.org",
    operatingHours: {
      monday: { open: "07:00", close: "19:00" },
      tuesday: { open: "07:00", close: "19:00" },
      wednesday: { open: "07:00", close: "19:00" },
      thursday: { open: "07:00", close: "19:00" },
      friday: { open: "07:00", close: "19:00" },
      saturday: { open: "08:00", close: "16:00" },
      sunday: { open: "08:00", close: "14:00" },
    },
    location: {
      type: "Point",
      coordinates: [-122.4194, 37.7749], // longitude, latitude for SF
    },
  },
]

// Function to create donation centers
async function createDonationCenters() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if centers already exist
    const existingCount = await DonationCenter.countDocuments()
    if (existingCount > 0) {
      console.log(`${existingCount} donation centers already exist. Deleting them...`)
      await DonationCenter.deleteMany({})
      console.log("Existing donation centers deleted.")
    }

    // Insert sample centers
    const result = await DonationCenter.insertMany(sampleCenters)
    console.log(`${result.length} donation centers created successfully!`)

    // Verify the 2dsphere index
    const indexes = await DonationCenter.collection.indexes()
    console.log("Collection indexes:", indexes)

    const hasGeoIndex = indexes.some((index) => index.key && index.key.location === "2dsphere")

    if (!hasGeoIndex) {
      console.log("Creating 2dsphere index on location field...")
      await DonationCenter.collection.createIndex({ location: "2dsphere" })
      console.log("2dsphere index created successfully!")
    } else {
      console.log("2dsphere index already exists on location field.")
    }

    mongoose.connection.close()
  } catch (error) {
    console.error("Error creating donation centers:", error)
    mongoose.connection.close()
  }
}

// Run the function
createDonationCenters()

