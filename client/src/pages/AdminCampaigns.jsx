"use client"

import { useState, useEffect, useContext } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const AdminCampaigns = () => {
  const { user } = useContext(AuthContext)
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "17:00",
    location: "",
    bloodTypesNeeded: ["All"],
    goal: 10,
    image: "",
  })

  const bloodTypes = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("You don't have permission to access this page")
      window.location.href = "/"
      return
    }

    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get("/api/campaigns")
        setCampaigns(res.data)
      } catch (error) {
        toast.error("Failed to load campaigns")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "bloodTypesNeeded") {
      if (value === "All") {
        // If "All" is selected, deselect all other options
        setFormData({
          ...formData,
          bloodTypesNeeded: checked ? ["All"] : [],
        })
      } else {
        // If any other option is selected, remove "All" from the selection
        let newBloodTypes = [...formData.bloodTypesNeeded]

        if (checked) {
          // Add the blood type if it's checked
          newBloodTypes.push(value)
          // Remove "All" if it exists
          newBloodTypes = newBloodTypes.filter((type) => type !== "All")
        } else {
          // Remove the blood type if it's unchecked
          newBloodTypes = newBloodTypes.filter((type) => type !== value)
        }

        // If no blood types are selected, default to "All"
        if (newBloodTypes.length === 0) {
          newBloodTypes = ["All"]
        }

        setFormData({
          ...formData,
          bloodTypesNeeded: newBloodTypes,
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? Number.parseInt(value) : value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

      const campaignData = {
        title: formData.title,
        description: formData.description,
        startDate: startDateTime,
        endDate: endDateTime,
        location: formData.location,
        bloodTypesNeeded: formData.bloodTypesNeeded,
        goal: formData.goal,
        image: formData.image,
      }

      let res
      if (editingCampaign) {
        res = await axios.put(`/api/campaigns/${editingCampaign._id}`, campaignData)
        toast.success("Campaign updated successfully")
      } else {
        res = await axios.post("/api/campaigns", campaignData)
        toast.success("Campaign created successfully")
      }

      // Refresh campaigns list
      const campaignsRes = await axios.get("/api/campaigns")
      setCampaigns(campaignsRes.data)

      // Reset form
      setShowForm(false)
      setEditingCampaign(null)
      setFormData({
        title: "",
        description: "",
        startDate: "",
        startTime: "09:00",
        endDate: "",
        endTime: "17:00",
        location: "",
        bloodTypesNeeded: ["All"],
        goal: 10,
        image: "",
      })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save campaign")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (campaign) => {
    // Format dates for the form
    const startDate = new Date(campaign.startDate)
    const endDate = new Date(campaign.endDate)

    setFormData({
      title: campaign.title,
      description: campaign.description,
      startDate: startDate.toISOString().split("T")[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split("T")[0],
      endTime: endDate.toTimeString().slice(0, 5),
      location: campaign.location,
      bloodTypesNeeded: campaign.bloodTypesNeeded,
      goal: campaign.goal,
      image: campaign.image || "",
    })

    setEditingCampaign(campaign)
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) {
      return
    }

    try {
      await axios.delete(`/api/campaigns/${id}`)
      toast.success("Campaign deleted successfully")

      // Refresh campaigns list
      setCampaigns(campaigns.filter((campaign) => campaign._id !== id))
    } catch (error) {
      toast.error("Failed to delete campaign")
      console.error(error)
    }
  }

  const handleUpdateParticipantStatus = async (campaignId, userId, newStatus) => {
    try {
      await axios.put(`/api/campaigns/${campaignId}/status/${userId}`, { status: newStatus })
      toast.success("Participant status updated")

      // Refresh campaigns list
      const campaignsRes = await axios.get("/api/campaigns")
      setCampaigns(campaignsRes.data)
    } catch (error) {
      toast.error("Failed to update participant status")
      console.error(error)
    }
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Campaigns</h1>
              <p className="mt-2 text-sm text-gray-600">Create and manage blood donation campaigns.</p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingCampaign(null)
                if (!showForm) {
                  setFormData({
                    title: "",
                    description: "",
                    startDate: "",
                    startTime: "09:00",
                    endDate: "",
                    endTime: "17:00",
                    location: "",
                    bloodTypesNeeded: ["All"],
                    goal: 10,
                    image: "",
                  })
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {showForm ? "Cancel" : editingCampaign ? "Edit Campaign" : "Create Campaign"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Fill out the form below to {editingCampaign ? "update the" : "create a new"} campaign.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Campaign Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.startTime}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        id="endTime"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.endTime}
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
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                        Donor Goal
                      </label>
                      <input
                        type="number"
                        name="goal"
                        id="goal"
                        min="1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.goal}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        name="image"
                        id="image"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.image}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-700">Blood Types Needed</legend>
                        <div className="mt-2 space-y-2">
                          {bloodTypes.map((type) => (
                            <div key={type} className="relative flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id={`bloodType-${type}`}
                                  name="bloodTypesNeeded"
                                  type="checkbox"
                                  value={type}
                                  checked={formData.bloodTypesNeeded.includes(type)}
                                  onChange={handleChange}
                                  className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor={`bloodType-${type}`} className="font-medium text-gray-700">
                                  {type}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingCampaign(null)
                      }}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : editingCampaign ? "Update Campaign" : "Create Campaign"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">All Campaigns</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">A list of all blood donation campaigns.</p>
            </div>
            <div className="border-t border-gray-200">
              {campaigns.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <li key={campaign._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{campaign.title}</h3>
                            <span
                              className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(campaign.startDate).toLocaleDateString()} to{" "}
                            {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">Location: {campaign.location}</p>
                          <p className="text-sm text-gray-500">
                            Progress: {campaign.participants?.length || 0} / {campaign.goal} donors
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(campaign)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(campaign._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {campaign.participants && campaign.participants.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700">
                            Participants ({campaign.participants.length})
                          </h4>
                          <div className="mt-2 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Donor
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Blood Type
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Signed Up
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {campaign.participants.map((participant) => (
                                  <tr key={participant._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                          {participant.donor.name ? participant.donor.name.charAt(0) : "?"}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {participant.donor.name}
                                            {participant.donor.isVerified && (
                                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {participant.donor.bloodType || "Unknown"}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          participant.status === "donated"
                                            ? "bg-green-100 text-green-800"
                                            : participant.status === "signed"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {new Date(participant.signupDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <select
                                        value={participant.status}
                                        onChange={(e) =>
                                          handleUpdateParticipantStatus(
                                            campaign._id,
                                            participant.donor._id,
                                            e.target.value,
                                          )
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                      >
                                        <option value="signed">Signed</option>
                                        <option value="donated">Donated</option>
                                        <option value="cancelled">Cancelled</option>
                                      </select>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-center">
                  <p className="text-sm text-gray-500">No campaigns found. Create your first campaign!</p>
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

export default AdminCampaigns

