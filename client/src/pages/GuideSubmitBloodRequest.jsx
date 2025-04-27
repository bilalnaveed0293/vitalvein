import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GuideSubmitBloodRequest = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Guide to Submit a Blood Request
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Request blood for a patient in need with these simple steps.
          </p>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Log In as a Recipient</h2>
              <p className="text-gray-600">
                Log in to your account via the <a href="/login" className="text-red-600 hover:underline">Login</a> page. You must be registered as a recipient to submit a blood request.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Navigate to Blood Requests</h2>
              <p className="text-gray-600">
                Go to the <a href="/blood-requests" className="text-red-600 hover:underline">Blood Requests</a> page from the navigation bar or your dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Fill Out the Request Form</h2>
              <p className="text-gray-600">
                Provide details such as the required blood type, quantity, hospital name, location, and urgency level. Be as specific as possible to help admins process your request quickly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 4: Submit and Await Approval</h2>
              <p className="text-gray-600">
                Submit your request. An admin will review it and approve or reject it. You’ll be notified of the status on the <a href="/blood-requests" className="text-red-600 hover:underline">Blood Requests</a> page.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/blood-requests"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
            >
              Submit a Blood Request
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuideSubmitBloodRequest;