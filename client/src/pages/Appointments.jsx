"use client"

import { useState, useEffect, useContext } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const Appointments = () => {
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [donationCenters, setDonationCenters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    donationCenterId: "",
    date: "",
    time: "",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [appointmentsRes, centersRes] = await Promise.all([
          axios.get("/api/appointments"),
          axios.get("/api/donation-centers"),
        ])

        setAppointments(appointmentsRes.data)
        setDonationCenters(centersRes.data)
      } catch (error) {
        toast.error("Failed to load data")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`)

      const res = await axios.post("/api/appointments", {
        donationCenterId: formData.donationCenterId,
        date: dateTime,
        notes: formData.notes,
      })

      setAppointments([res.data, ...appointments])
      setShowForm(false)
      setFormData({
        donationCenterId: "",
        date: "",
        time: "",
        notes: "",
      })

      toast.success("Appointment scheduled successfully!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule appointment")
      console.error(error)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    try {
      await axios.delete(`/api/appointments/${id}`)

      // Update the status in the UI
      setAppointments(appointments.map((app) => (app._id === id ? { ...app, status: "cancelled" } : app)))

      toast.success("Appointment cancelled")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment")
      console.error(error)
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  // Get today's date in YYYY-MM-DD format for min date in form
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="mt-2 text-sm text-gray-600">Schedule and manage your blood donation appointments.</p>
            </div>
            {user.userType === "donor" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {showForm ? "Cancel" : "Schedule Donation"}
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Schedule New Appointment</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Fill out the form below to schedule your donation.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="donationCenterId" className="block text-sm font-medium text-gray-700">
                        Donation Center
                      </label>
                      <select
                        id="donationCenterId"
                        name="donationCenterId"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        value={formData.donationCenterId}
                        onChange={handleChange}
                      >
                        <option value="">Select a donation center</option>
                        {donationCenters.map((center) => (
                          <option key={center._id} value={center._id}>
                            {center.name} - {center.city}, {center.state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        min={today}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        id="time"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        value={formData.time}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Any special requirements or information"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Your Appointments</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                A list of all your scheduled and past appointments.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {appointments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {appointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.date)
                    const isPast = appointmentDate < new Date()
                    const isCancellable = !isPast && appointment.status === "scheduled"

                    return (
                      <li key={appointment._id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.donationCenter?.name || "Unknown Center"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointmentDate.toLocaleDateString()} at{" "}
                              {appointmentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {appointment.notes && (
                              <p className="text-sm text-gray-500 mt-1">Notes: {appointment.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                appointment.status === "scheduled"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : appointment.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>

                            {isCancellable && (
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                className="ml-4 text-sm text-red-600 hover:text-red-900"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-center">
                  <p className="text-sm text-gray-500">You don't have any appointments yet.</p>
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

export default Appointments

