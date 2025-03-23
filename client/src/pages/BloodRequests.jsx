"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const BloodRequests = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [bloodRequests, setBloodRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(location.pathname === "/blood-requests/new")
  const [formData, setFormData] = useState({
    bloodType: "",
    quantity: 1,
    urgency: "medium",
    hospital: "",
    location: user?.location || "",
    notes: "",
  })

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const urgencyLevels = [
    { value: "low", label: "Low - Within a few weeks" },
    { value: "medium", label: "Medium - Within a week" },
    { value: "high", label: "High - Within 48 hours" },
    { value: "critical", label: "Critical - Immediately" },
  ]

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)

        // Different endpoints based on user type
        const endpoint = user.userType === "donor" ? "/api/blood-requests/available" : "/api/blood-requests"

        const res = await axios.get(endpoint)
        setBloodRequests(res.data)
      } catch (error) {
        toast.error("Failed to load blood requests")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [user.userType])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post("/api/blood-requests", formData)

      setBloodRequests([res.data, ...bloodRequests])
      setShowForm(false)
      setFormData({
        bloodType: "",
        quantity: 1,
        urgency: "medium",
        hospital: "",
        location: user.location,
        notes: "",
      })

      toast.success("Blood request submitted successfully!")
      navigate("/blood-requests")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request")
      console.error(error)
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.userType === "donor" ? "Available Blood Requests" : "Blood Requests"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {user.userType === "donor"
                  ? "View blood requests that match your blood type."
                  : "Create and manage your blood donation requests."}
              </p>
            </div>
            {user.userType === "recipient" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {showForm ? "Cancel" : "New Request"}
              </button>
            )}
          </div>

          {showForm && user.userType === "recipient" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Create Blood Request</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Fill out the form to request blood donation.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                        Blood Type Needed
                      </label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        value={formData.bloodType}
                        onChange={handleChange}
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Units Needed
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        min="1"
                        max="10"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                        Urgency Level
                      </label>
                      <select
                        id="urgency"
                        name="urgency"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        value={formData.urgency}
                        onChange={handleChange}
                      >
                        {urgencyLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                        Hospital/Medical Center
                      </label>
                      <input
                        type="text"
                        name="hospital"
                        id="hospital"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Hospital or medical center name"
                        value={formData.hospital}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Any additional information"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        navigate("/blood-requests")
                      }}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                {user.userType === "donor" ? "Available Requests" : "Your Requests"}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {user.userType === "donor"
                  ? "Blood requests that match your blood type compatibility."
                  : "A list of all your blood donation requests."}
              </p>
            </div>
            <div className="border-t border-gray-200">
              {bloodRequests.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {bloodRequests.map((request) => (
                    <li key={request._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="px-2 mr-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {request.bloodType}
                            </span>
                            <p className="text-sm font-medium text-gray-900">{request.hospital}</p>
                            <span
                              className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                request.urgency === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : request.urgency === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : request.urgency === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Urgency
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Location: {request.location}</p>
                          <p className="text-sm text-gray-500">Units needed: {request.quantity}</p>
                          {request.notes && <p className="text-sm text-gray-500 mt-1">Notes: {request.notes}</p>}
                          {user.userType === "recipient" && (
                            <p className="text-sm text-gray-500 mt-1">
                              Status:{" "}
                              <span
                                className={`font-semibold 
                                ${
                                  request.status === "approved"
                                    ? "text-green-600"
                                    : request.status === "fulfilled"
                                      ? "text-blue-600"
                                      : request.status === "rejected"
                                        ? "text-red-600"
                                        : "text-yellow-600"
                                }`}
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            Requested on: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {user.userType === "donor" && (
                          <div>
                            <button
                              onClick={() => {
                                // In a real app, this would open a modal or navigate to a contact page
                                toast.success(
                                  `Contact information for ${request.recipient?.name || "recipient"} would be shown here.`,
                                )
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Contact Recipient
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-center">
                  <p className="text-sm text-gray-500">
                    {user.userType === "donor"
                      ? "No blood requests matching your blood type compatibility at the moment."
                      : "You haven't created any blood requests yet."}
                  </p>
                  {user.userType === "recipient" && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Create Request
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BloodRequests

