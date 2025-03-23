"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const Campaigns = () => {
  const { user } = useContext(AuthContext)
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [userCampaigns, setUserCampaigns] = useState([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        const [allCampaignsRes, userCampaignsRes] = await Promise.all([
          axios.get("/api/campaigns"),
          user ? axios.get("/api/campaigns/user/signed") : Promise.resolve({ data: [] }),
        ])

        setCampaigns(allCampaignsRes.data)
        setUserCampaigns(userCampaignsRes.data)
      } catch (error) {
        toast.error("Failed to load campaigns")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [user])

  const handleSignup = async (campaignId) => {
    if (!user) {
      toast.error("Please log in to sign up for campaigns")
      return
    }

    if (user.userType !== "donor") {
      toast.error("Only donors can sign up for campaigns")
      return
    }

    try {
      await axios.post(`/api/campaigns/${campaignId}/signup`)
      toast.success("You have successfully signed up for this campaign")

      // Refresh campaigns
      const [allCampaignsRes, userCampaignsRes] = await Promise.all([
        axios.get("/api/campaigns"),
        axios.get("/api/campaigns/user/signed"),
      ])

      setCampaigns(allCampaignsRes.data)
      setUserCampaigns(userCampaignsRes.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign up for campaign")
      console.error(error)
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (activeFilter === "all") return true
    if (activeFilter === "upcoming") return campaign.status === "upcoming"
    if (activeFilter === "active") return campaign.status === "active"
    if (activeFilter === "completed") return campaign.status === "completed"
    if (activeFilter === "signed") {
      return userCampaigns.some((uc) => uc._id === campaign._id)
    }
    return true
  })

  const isUserSignedUp = (campaignId) => {
    return userCampaigns.some((campaign) => campaign._id === campaignId)
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Blood Donation Campaigns</h1>
            <p className="mt-2 text-sm text-gray-600">Join a campaign and help save lives through blood donation.</p>
          </div>

          {/* Filters */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveFilter("all")}
                className={`${
                  activeFilter === "all"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                All Campaigns
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`${
                  activeFilter === "active"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter("upcoming")}
                className={`${
                  activeFilter === "upcoming"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveFilter("completed")}
                className={`${
                  activeFilter === "completed"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Completed
              </button>
              {user && user.userType === "donor" && (
                <button
                  onClick={() => setActiveFilter("signed")}
                  className={`${
                    activeFilter === "signed"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Campaigns
                </button>
              )}
            </nav>
          </div>

          {/* Campaign Cards */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign._id} className="bg-white shadow overflow-hidden rounded-lg">
                  {campaign.image ? (
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-red-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{campaign.title}</h3>
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
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {campaign.description.length > 100
                        ? campaign.description.substring(0, 100) + "..."
                        : campaign.description}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{campaign.location}</dd>
                      </div>
                      <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Dates</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Blood Types</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {campaign.bloodTypesNeeded.join(", ")}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Goal</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {campaign.participants?.length || 0} / {campaign.goal} donors
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                    >
                      View Details
                    </Link>
                    {user &&
                      user.userType === "donor" &&
                      campaign.status !== "completed" &&
                      campaign.status !== "cancelled" &&
                      !isUserSignedUp(campaign._id) && (
                        <button
                          onClick={() => handleSignup(campaign._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Sign Up
                        </button>
                      )}
                    {isUserSignedUp(campaign._id) && (
                      <span className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100">
                        Signed Up
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">No campaigns found matching your filter.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Campaigns

