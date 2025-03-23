"use client"

import { useState, useContext, useEffect } from "react"
import { toast } from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const RecipientProfile = () => {
  const { user, updateProfile } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
      })
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
            <h1 className="text-3xl font-bold text-gray-900">Recipient Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update your profile information and manage your blood requests.
            </p>
          </div>

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

            {/* Blood Type Information */}
            <div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Blood Type Information</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Blood type compatibility guide.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need A+ blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: A+, A-, O+, O-</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need A- blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: A-, O-</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need B+ blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: B+, B-, O+, O-</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need B- blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: B-, O-</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need AB+ blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: All blood types</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need AB- blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: AB-, A-, B-, O-</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need O+ blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: O+, O-</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">If you need O- blood:</h3>
                      <p className="mt-1 text-sm text-gray-500">You can receive from: O- only</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/blood-requests/new"
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Create Blood Request
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default RecipientProfile

