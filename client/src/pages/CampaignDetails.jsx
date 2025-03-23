"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const CampaignDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [campaign, setCampaign] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningUp, setIsSigningUp] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(`/api/campaigns/${id}`)
        setCampaign(res.data)
      } catch (error) {
        toast.error("Failed to load campaign details")
        console.error(error)
        navigate("/campaigns")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [id, navigate])

  const handleSignup = async () => {
    if (!user) {
      toast.error("Please log in to sign up for this campaign")
      return
    }

    if (user.userType !== "donor") {
      toast.error("Only donors can sign up for campaigns")
      return
    }

    try {
      setIsSigningUp(true)
      await axios.post(`/api/campaigns/${id}/signup`)
      toast.success("You have successfully signed up for this campaign")

      // Refresh campaign data
      const res = await axios.get(`/api/campaigns/${id}`)
      setCampaign(res.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign up for campaign")
      console.error(error)
    } finally {
      setIsSigningUp(false)
    }
  }

  const isUserSignedUp = () => {
    if (!user || !campaign) return false
    return campaign.participants.some((p) => p.donor._id === user.id || p.donor === user.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Spinner />
        </main>
        <Footer />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Campaign not found</h2>
            <p className="mt-2 text-gray-600">The campaign you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/campaigns")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Back to Campaigns
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const startDate = new Date(campaign.startDate)
  const endDate = new Date(campaign.endDate)
  const progress = Math.min(100, Math.round((campaign.participants.length / campaign.goal) * 100))

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => navigate("/campaigns")}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <svg
                className="mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Campaigns
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Organized by {campaign.organizer.name}</p>
              </div>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  campaign.status === "active"
                    ? "bg-green-100 text-green-800"
                    : campaign.status === "upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : campaign.status === "completed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </div>

            {campaign.image && (
              <div className="border-t border-gray-200">
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Campaign Details</h2>
              <p className="mt-2 text-gray-600">{campaign.description}</p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{campaign.location}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {startDate.toLocaleDateString()} at{" "}
                    {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {endDate.toLocaleDateString()} at{" "}
                    {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Blood Types Needed</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {campaign.bloodTypesNeeded.map((type, index) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2"
                      >
                        {type}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Campaign Progress</h2>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                        {progress}% Complete
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-red-600">
                        {campaign.participants.length} / {campaign.goal} Donors
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {campaign.participants.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Participants</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {campaign.participants.map((participant) => (
                    <div
                      key={participant._id}
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                          {participant.donor.name ? participant.donor.name.charAt(0) : "?"}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {participant.donor.name}
                          {participant.donor.isVerified && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {participant.donor.bloodType && `Blood Type: ${participant.donor.bloodType}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {user &&
              user.userType === "donor" &&
              campaign.status !== "completed" &&
              campaign.status !== "cancelled" ? (
                isUserSignedUp() ? (
                  <div
                    className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">Thank you!</strong>
                    <span className="block sm:inline"> You are signed up for this campaign.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSignup}
                    disabled={isSigningUp}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isSigningUp ? "Signing Up..." : "Sign Up for This Campaign"}
                  </button>
                )
              ) : campaign.status === "completed" || campaign.status === "cancelled" ? (
                <div
                  className="bg-gray-50 border border-gray-400 text-gray-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">This campaign is no longer accepting sign-ups.</span>
                </div>
              ) : !user ? (
                <div
                  className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">Please log in as a donor to sign up for this campaign.</span>
                </div>
              ) : (
                <div
                  className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">Only donors can sign up for blood donation campaigns.</span>
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

export default CampaignDetails

