"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-red-600 font-bold text-xl">
                BloodDonate
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/donation-centers"
                className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Donation Centers
              </Link>
              <Link
                to="/campaigns"
                className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Campaigns
              </Link>
              <div className="relative group">
                <button
                  className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center mt-6 border-b-2 text-sm font-medium focus:outline-none"
                >
                  Guides
                </button>
                <div className="absolute z-10 left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    to="/guide-register-donation-center"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    Register a Donation Center
                  </Link>
                  <Link
                    to="/guide-register-donor"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    Register as a Donor
                  </Link>
                  <Link
                    to="/guide-schedule-appointment"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    Schedule an Appointment
                  </Link>
                  <Link
                    to="/guide-submit-blood-request"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    Submit a Blood Request
                  </Link>
                </div>
              </div>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/appointments"
                    className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/feedback"
                    className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Feedback
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="border-transparent text-gray-500 hover:border-red-500 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center text-red-600 font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    {user.isVerified && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-600 rounded-full">
                        ✓
                      </span>
                    )}
                  </button>
                </div>
                {isMenuOpen && (
                  <div className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {user.role === "admin" ? (
                      <>
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                          Admin Dashboard
                        </Link>
                        <Link to="/admin/campaigns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                          Manage Campaigns
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to={user.userType === "donor" ? "/donor-profile" : "/recipient-profile"}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/feedback"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                        >
                          Feedback
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-500 hover:text-red-700"
          >
            Home
          </Link>
          <Link
            to="/donation-centers"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-500 hover:text-red-700"
          >
            Donation Centers
          </Link>
          <Link
            to="/campaigns"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-500 hover:text-red-700"
          >
            Campaigns
          </Link>
          <div className="pl-3 pr-4 py-2">
            <div className="text-base font-medium text-gray-600">Guides</div>
            <div className="mt-1 space-y-1">
              <Link
                to="/guide-register-donation-center"
                className="block pl-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"
              >
                Register a Donation Center
              </Link>
              <Link
                to="/guide-register-donor"
                className="block pl-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"
              >
                Register as a Donor
              </Link>
              <Link
                to="/guide-schedule-appointment"
                className="block pl-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"
              >
                Schedule an Appointment
              </Link>
              <Link
                to="/guide-submit-blood-request"
                className="block pl-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700"
              >
                Submit a Blood Request
              </Link>
            </div>
          </div>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-500 hover:text-red-700"
              >
                Dashboard
              </Link>
              <Link
                to="/appointments"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-500 hover:text-red-700"
              >
                Appointments
              </Link>
              <Link
                to="/feedback"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-500 hover:text-red-700"
              >
                Feedback
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-red-500 hover:text-red-700"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-red-200 flex items-center justify-center text-red-600 font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  {user.isVerified && (
                    <span className="absolute inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-600 rounded-full">
                      ✓
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {user.role === "admin" ? (
                  <>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/campaigns"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Manage Campaigns
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={user.userType === "donor" ? "/donor-profile" : "/recipient-profile"}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/feedback"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Feedback
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1">
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;