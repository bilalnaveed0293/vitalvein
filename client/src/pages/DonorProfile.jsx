"use client"

import { useState, useContext, useEffect } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"
import DonationHistory from "../components/DonationHistory"

const DonorProfile = () => {
  const { user, updateProfile } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bloodType: "",
  })
  const [lastDonation, setLastDonation] = useState(null)
  const [isEligible, setIsEligible] = useState(true)
  const [nextEligibleDate, setNextEligibleDate] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bloodType: user.bloodType || "",
      })

      // Fetch donor details including last donation
      const fetchDonorDetails = async () => {
        try {
          const res = await axios.get("/api/users/me")
          if (res.data.lastDonation) {
            const lastDonationDate = new Date(res.data.lastDonation)
            setLastDonation(lastDonationDate)

            // Check eligibility (8 weeks after last donation)
            const eightWeeksLater = new Date(lastDonationDate)
            eightWeeksLater.setDate(eightWeeksLater.getDate() + 56) // 8 weeks = 56 days

            setNextEligibleDate(eightWeeksLater)
            setIsEligible(new Date() >= eightWeeksLater)
          } else {
            setIsEligible(true)
          }
        } catch (error) {
          console.error("Error fetching donor details:", error)
        }
      }

      fetchDonorDetails()
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateProfile(formData)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Donor Profile</h1>
            <p className="mt-2 text-sm text-gray-600">Update your profile information and view your donation status.</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`${
                  activeTab === "profile"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`${
                  activeTab === "history"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Donation History
              </button>
            </nav>
          </div>

          {activeTab === "profile" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your personal details.</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-span-6">
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            required
                            placeholder="City, State"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            value={formData.location}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                            Blood Type
                          </label>
                          <select
                            id="bloodType"
                            name="bloodType"
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                            value={formData.bloodType}
                            onChange={handleChange}
                          >
                            <option value="">Select Blood Type</option>
                            {bloodTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Donation Status */}
              <div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Donation Status</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Your current donation eligibility.</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="mb-4">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            isEligible ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {isEligible ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {isEligible ? "Eligible to Donate" : "Not Eligible Yet"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {isEligible
                              ? "You can schedule a blood donation appointment."
                              : "You need to wait until the next eligible date."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {lastDonation && (
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <dl className="divide-y divide-gray-200">
                          <div className="py-3 flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Last Donation</dt>
                            <dd className="text-sm text-gray-900">{lastDonation.toLocaleDateString()}</dd>
                          </div>
                          {nextEligibleDate && (
                            <div className="py-3 flex justify-between">
                              <dt className="text-sm font-medium text-gray-500">Next Eligible Date</dt>
                              <dd className="text-sm text-gray-900">{nextEligibleDate.toLocaleDateString()}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}

                    <div className="mt-6">
                      <a
                        href="/appointments"
                        className={`block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                          isEligible
                            ? "text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            : "text-gray-700 bg-gray-100 cursor-not-allowed"
                        }`}
                      >
                        {isEligible ? "Schedule Donation" : "Cannot Donate Yet"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex items-center">
                    <h2 className="text-lg font-medium text-gray-900">Verification Status</h2>
                    {user.isVerified ? (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-gray-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Not Verified
                      </span>
                    )}
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <p className="text-sm text-gray-500">
                      {user.isVerified
                        ? "You are a verified donor. Recipients can see your verified status when you respond to blood requests."
                        : "Complete your first donation to become a verified donor. This helps recipients trust your profile."}
                    </p>
                    {user.isVerified && (
                      <div className="mt-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">Verified Donor</h3>
                            <p className="text-sm text-gray-500">Total donations: {user.donationCount || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Blood Type Information</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Your blood type compatibility.</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    {formData.bloodType ? (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Your blood type ({formData.bloodType}) can donate to:
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {formData.bloodType === "O-" && "All blood types (O-, O+, A-, A+, B-, B+, AB-, AB+)"}
                          {formData.bloodType === "O+" && "O+, A+, B+, AB+"}
                          {formData.bloodType === "A-" && "A-, A+, AB-, AB+"}
                          {formData.bloodType === "A+" && "A+, AB+"}
                          {formData.bloodType === "B-" && "B-, B+, AB-, AB+"}
                          {formData.bloodType === "B+" && "B+, AB+"}
                          {formData.bloodType === "AB-" && "AB-, AB+"}
                          {formData.bloodType === "AB+" && "AB+ only"}
                        </p>

                        <h3 className="mt-4 text-sm font-medium text-gray-500">You can receive from:</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {formData.bloodType === "O-" && "O- only"}
                          {formData.bloodType === "O+" && "O-, O+"}
                          {formData.bloodType === "A-" && "O-, A-"}
                          {formData.bloodType === "A+" && "O-, O+, A-, A+"}
                          {formData.bloodType === "B-" && "O-, B-"}
                          {formData.bloodType === "B+" && "O-, O+, B-, B+"}
                          {formData.bloodType === "AB-" && "O-, A-, B-, AB-"}
                          {formData.bloodType === "AB+" && "All blood types"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Please update your blood type to see compatibility information.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && <DonationHistory userId={user._id} />}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DonorProfile

