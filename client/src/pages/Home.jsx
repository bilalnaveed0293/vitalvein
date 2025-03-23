import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import pic1 from "../../assets/pic1.jpg"
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-red-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Donate Blood,</span>
                  <span className="block text-red-600">Save Lives</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your donation can save up to 3 lives. Join our community of donors and make a difference today.
                </p>
                <div className="mt-8 sm:flex">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10"
                    >
                      Register as Donor
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/donation-centers"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Find Centers
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <img
                  className="h-auto w-full object-cover rounded-lg shadow-xl"
                  src={pic1}
                  alt="Blood donation"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Blood Types Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Blood Types</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Know Your Blood Type
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Understanding blood types is crucial for successful transfusions and donations.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { type: "A+", canDonateTo: "A+, AB+", canReceiveFrom: "A+, A-, O+, O-" },
                  { type: "A-", canDonateTo: "A+, A-, AB+, AB-", canReceiveFrom: "A-, O-" },
                  { type: "B+", canDonateTo: "B+, AB+", canReceiveFrom: "B+, B-, O+, O-" },
                  { type: "B-", canDonateTo: "B+, B-, AB+, AB-", canReceiveFrom: "B-, O-" },
                  { type: "AB+", canDonateTo: "AB+", canReceiveFrom: "All Blood Types" },
                  { type: "AB-", canDonateTo: "AB+, AB-", canReceiveFrom: "A-, B-, AB-, O-" },
                  { type: "O+", canDonateTo: "A+, B+, AB+, O+", canReceiveFrom: "O+, O-" },
                  { type: "O-", canDonateTo: "All Blood Types", canReceiveFrom: "O-" },
                ].map((blood) => (
                  <div key={blood.type} className="bg-red-50 p-6 rounded-lg shadow-md">
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center p-3 bg-red-600 rounded-md shadow-lg">
                        <h3 className="text-2xl font-bold text-white">{blood.type}</h3>
                      </span>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900">Can Donate To:</p>
                        <p className="text-sm text-gray-500">{blood.canDonateTo}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">Can Receive From:</p>
                        <p className="text-sm text-gray-500">{blood.canReceiveFrom}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-red-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Blood Donation Facts</h2>
              <p className="mt-3 text-xl text-red-200 sm:mt-4">
                Every donation counts. Here's why your contribution matters.
              </p>
            </div>
            <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-red-200">
                  of people will need blood in their lifetime
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-white">70%</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-red-200">
                  lives saved by a single donation
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-white">3</dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-red-200">seconds someone needs blood</dt>
                <dd className="order-1 text-5xl font-extrabold text-white">2</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home

