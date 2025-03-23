"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [bloodRequests, setBloodRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalRecipients: 0,
    totalAppointments: 0,
    completedDonations: 0,
    pendingRequests: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch all data in parallel
        const [usersRes, appointmentsRes, requestsRes] = await Promise.all([
          axios.get("/api/users/admin/all"),
          axios.get("/api/appointments/admin/all"),
          axios.get("/api/blood-requests/admin/all"),
        ])

        setUsers(usersRes.data)
        setAppointments(appointmentsRes.data)
        setBloodRequests(requestsRes.data)

        // Calculate stats
        const totalDonors = usersRes.data.filter((user) => user.userType === "donor").length
        const totalRecipients = usersRes.data.filter((user) => user.userType === "recipient").length
        const completedDonations = appointmentsRes.data.filter((app) => app.status === "completed").length
        const pendingRequests = requestsRes.data.filter((req) => req.status === "pending").length

        setStats({
          totalUsers: usersRes.data.length,
          totalDonors,
          totalRecipients,
          totalAppointments: appointmentsRes.data.length,
          completedDonations,
          pendingRequests,
        })
      } catch (error) {
        toast.error("Failed to load admin data")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleApproveRequest = async (id) => {
    try {
      await axios.put(`/api/blood-requests/${id}`, { status: "approved" })

      // Update the status in the UI
      setBloodRequests(bloodRequests.map((req) => (req._id === id ? { ...req, status: "approved" } : req)))

      toast.success("Request approved")
    } catch (error) {
      toast.error("Failed to approve request")
      console.error(error)
    }
  }

  const handleRejectRequest = async (id) => {
    try {
      await axios.put(`/api/blood-requests/${id}`, { status: "rejected" })

      // Update the status in the UI
      setBloodRequests(bloodRequests.map((req) => (req._id === id ? { ...req, status: "rejected" } : req)))

      toast.success("Request rejected")
    } catch (error) {
      toast.error("Failed to reject request")
      console.error(error)
    }
  }

  const handleCompleteAppointment = async (id) => {
    try {
      await axios.put(`/api/appointments/admin/${id}`, { status: "completed" })

      // Update the status in the UI
      setAppointments(appointments.map((app) => (app._id === id ? { ...app, status: "completed" } : app)))

      toast.success("Appointment marked as completed")
    } catch (error) {
      toast.error("Failed to update appointment")
      console.error(error)
    }
  }

  const handleCancelAppointment = async (id) => {
    try {
      await axios.put(`/api/appointments/admin/${id}`, { status: "cancelled" })

      // Update the status in the UI
      setAppointments(appointments.map((app) => (app._id === id ? { ...app, status: "cancelled" } : app)))

      toast.success("Appointment cancelled")
    } catch (error) {
      toast.error("Failed to cancel appointment")
      console.error(error)
    }
  }

  const handleDeleteAppointment = async (id, donorName) => {
    if (!window.confirm(`Are you sure you want to delete this appointment for ${donorName || "this donor"}?`)) {
      return
    }

    try {
      await axios.delete(`/api/appointments/admin/${id}`)

      // Remove the appointment from the UI
      setAppointments(appointments.filter((app) => app._id !== id))

      toast.success("Appointment deleted")
    } catch (error) {
      toast.error("Failed to delete appointment")
      console.error(error)
    }
  }

  const handleDeleteUser = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user ${name}? This will also delete all their appointments and blood requests.`,
      )
    ) {
      return
    }

    try {
      await axios.delete(`/api/users/admin/${id}`)

      // Remove the user from the UI
      setUsers(users.filter((user) => user._id !== id))

      toast.success("User deleted successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user")
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Manage users, appointments, and blood requests.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="text-gray-500">Donors: {stats.totalDonors}</span>
                  <span className="text-gray-500 ml-4">Recipients: {stats.totalRecipients}</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalAppointments}</dd>
                </dl>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="text-gray-500">Completed Donations: {stats.completedDonations}</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Blood Requests</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingRequests}</dd>
                </dl>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="text-gray-500">Total Requests: {bloodRequests.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`${
                  activeTab === "users"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`${
                  activeTab === "appointments"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab("bloodRequests")}
                className={`${
                  activeTab === "bloodRequests"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Blood Requests
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {activeTab === "users" && (
              <div>
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Users</h2>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
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
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Joined
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
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.userType === "donor" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.bloodType || "N/A"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "appointments" && (
              <div>
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Appointments</h2>
                </div>
                <div className="border-t border-gray-200">
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
                          Donation Center
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date & Time
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
                          Blood Type
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
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.donor?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">{appointment.donor?.email || "Unknown"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.donationCenter?.name || "Unknown"}</div>
                            <div className="text-sm text-gray-500">
                              {appointment.donationCenter?.city || ""}, {appointment.donationCenter?.state || ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === "scheduled"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : appointment.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.donor?.bloodType || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {appointment.status !== "completed" && (
                              <button
                                onClick={() => handleCompleteAppointment(appointment._id)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Complete
                              </button>
                            )}
                            {appointment.status !== "cancelled" && appointment.status !== "completed" && (
                              <button
                                onClick={() => handleCancelAppointment(appointment._id)}
                                className="text-orange-600 hover:text-orange-900 mr-3"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAppointment(appointment._id, appointment.donor?.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "bloodRequests" && (
              <div>
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Blood Requests</h2>
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Recipient
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
                          Hospital
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Urgency
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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bloodRequests.map((request) => (
                        <tr key={request._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.recipient?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">{request.recipient?.email || "Unknown"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {request.bloodType}
                            </span>
                            <div className="text-sm text-gray-500 mt-1">Units: {request.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{request.hospital}</div>
                            <div className="text-sm text-gray-500">{request.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.urgency === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : request.urgency === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : request.urgency === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : request.status === "fulfilled"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(request._id)}
                                  className="text-green-600 hover:text-green-900 mr-3"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AdminDashboard

