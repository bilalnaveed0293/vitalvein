"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [bloodRequests, setBloodRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch appointments if user is a donor
        if (user.userType === "donor") {
          const appointmentsRes = await axios.get("/api/appointments")
          setAppointments(appointmentsRes.data)
        }

        // Fetch blood requests if user is a recipient
        if (user.userType === "recipient") {
          const requestsRes = await axios.get("/api/blood-requests")
          setBloodRequests(requestsRes.data)
        }
      } catch (error) {
        toast.error("Failed to load dashboard data")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Welcome back, {user.name}!</p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Your Profile</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.location}</dd>
                </div>
                {user.userType === "donor" && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.bloodType}</dd>
                  </div>
                )}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">User Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{user.userType}</dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Link
                to={user.userType === "donor" ? "/donor-profile" : "/recipient-profile"}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {user.userType === "donor" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Your Appointments</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent and upcoming donation appointments.</p>
                </div>
                <Link
                  to="/appointments"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  View All
                </Link>
              </div>
              <div className="border-t border-gray-200">
                {appointments.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {appointments.slice(0, 3).map((appointment) => (
                      <li key={appointment._id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900">{appointment.donationCenter.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleDateString()} at{" "}
                              {new Date(appointment.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
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
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-sm text-gray-500">You don't have any appointments yet.</p>
                    <Link
                      to="/appointments"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Schedule Donation
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.userType === "recipient" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Your Blood Requests</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent blood donation requests.</p>
                </div>
                <Link
                  to="/blood-requests"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  View All
                </Link>
              </div>
              <div className="border-t border-gray-200">
                {bloodRequests.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {bloodRequests.slice(0, 3).map((request) => (
                      <li key={request._id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="px-2 mr-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                {request.bloodType}
                              </span>
                              <p className="text-sm font-medium text-gray-900">{request.hospital}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                              Requested on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : request.status === "fulfilled"
                                    ? "bg-blue-100 text-blue-800"
                                    : request.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-sm text-gray-500">You don't have any blood requests yet.</p>
                    <Link
                      to="/blood-requests"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Create Request
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">What would you like to do today?</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {user.userType === "donor" ? (
                  <>
                    <Link
                      to="/appointments"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Schedule Donation
                    </Link>
                    <Link
                      to="/blood-requests/available"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Blood Requests
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/blood-requests/new"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Request Blood
                    </Link>
                    <Link
                      to="/donation-centers"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Find Donation Centers
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard

