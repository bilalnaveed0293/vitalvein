"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Spinner from "../components/ui/Spinner"

const DonationCenters = () => {
  const [centers, setCenters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get("/api/donation-centers")
        setCenters(res.data)
      } catch (error) {
        toast.error("Failed to load donation centers")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCenters()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true)

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            console.log("User location obtained:", { latitude, longitude })
            setUserLocation({ lat: latitude, lng: longitude })

            // Fetch nearby centers
            console.log(`Fetching centers near [${latitude}, ${longitude}]`)
            const res = await axios.get(`/api/donation-centers/nearby?lat=${latitude}&lng=${longitude}`)
            console.log("Nearby centers response:", res.data)

            if (res.data.length === 0) {
              toast.info("No donation centers found near your location. Showing all centers instead.")
              // If no centers found nearby, fetch all centers
              const allCentersRes = await axios.get("/api/donation-centers")
              setCenters(allCentersRes.data)
            } else {
              setCenters(res.data)
              toast.success(`Found ${res.data.length} donation centers near you`)
            }
          } catch (error) {
            console.error("Error fetching nearby centers:", error)
            toast.error("Failed to find nearby centers: " + (error.response?.data?.message || error.message))

            // Fallback to all centers
            try {
              const allCentersRes = await axios.get("/api/donation-centers")
              setCenters(allCentersRes.data)
            } catch (fallbackError) {
              console.error("Fallback error:", fallbackError)
            }
          } finally {
            setIsLoadingLocation(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          let errorMessage = "Location access denied. Please enable location services."

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location services."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
            case error.UNKNOWN_ERROR:
              errorMessage = "An unknown error occurred while getting location."
              break
          }

          toast.error(errorMessage)
          setIsLoadingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      toast.error("Geolocation is not supported by your browser")
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
            <h1 className="text-3xl font-bold text-gray-900">Donation Centers</h1>
            <p className="mt-2 text-sm text-gray-600">Find blood donation centers near you.</p>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name, city, or state..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button
                className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm("")}
              >
                {searchTerm && "Clear"}
              </button>
            </div>
            <button
              onClick={getUserLocation}
              disabled={isLoadingLocation}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoadingLocation ? "Finding..." : "Find Centers Near Me"}
            </button>
          </div>

          {filteredCenters.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">No donation centers found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCenters.map((center) => (
                <div key={center._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{center.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {center.city}, {center.state}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {center.address}, {center.city}, {center.state} {center.zipCode}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{center.phone}</dd>
                      </div>
                      <div className="py-3 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{center.email}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <a
                      href={`https://maps.google.com/?q=${center.address}, ${center.city}, ${center.state}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-2"
                    >
                      Directions
                    </a>
                    <a
                      href={`tel:${center.phone}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DonationCenters

