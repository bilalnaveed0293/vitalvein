"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

const DonationHistory = ({ userId }) => {
  const [donations, setDonations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDonations: 0,
    lastDonation: null,
    nextEligibleDate: null,
    isEligible: true,
  })

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get("/api/appointments/history")
        setDonations(res.data)

        // Calculate stats
        if (res.data.length > 0) {
          const lastDonation = new Date(res.data[0].date)

          // Calculate next eligible date (8 weeks after last donation)
          const nextEligibleDate = new Date(lastDonation)
          nextEligibleDate.setDate(nextEligibleDate.getDate() + 56) // 8 weeks = 56 days

          // Check if eligible now
          const isEligible = new Date() >= nextEligibleDate

          setStats({
            totalDonations: res.data.length,
            lastDonation,
            nextEligibleDate,
            isEligible,
          })
        }
      } catch (error) {
        toast.error("Failed to load donation history")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonationHistory()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Donation History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your blood donation records</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">Total Donations</p>
          <p className="text-2xl font-bold text-red-600">{stats.totalDonations}</p>
        </div>
      </div>

      {stats.lastDonation && (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Donation</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {stats.lastDonation.toLocaleDateString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Next Eligible Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {stats.nextEligibleDate.toLocaleDateString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Current Status</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    stats.isEligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {stats.isEligible ? "Eligible to donate" : "Not eligible yet"}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="border-t border-gray-200">
        <div className="px-4 py-3 bg-gray-50 text-left sm:px-6">
          <h4 className="text-sm font-medium text-gray-500">Donation Records</h4>
        </div>
        {donations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {donations.map((donation) => (
              <li key={donation._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {donation.donationCenter?.name || "Unknown Center"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.date).toLocaleDateString()} at{" "}
                      {new Date(donation.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {donation.notes && <p className="text-sm text-gray-500 mt-1">Notes: {donation.notes}</p>}
                  </div>
                  <div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Completed
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 sm:px-6 text-center">
            <p className="text-sm text-gray-500">You haven't completed any donations yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DonationHistory

