import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GuideRegisterDonationCenter = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Guide to Register a Donation Center
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Follow these steps to register a new blood donation center and help save lives.
          </p>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Log In as an Admin</h2>
              <p className="text-gray-600">
                Only users with admin privileges can register a donation center. Log in to your admin account via the <a href="/login" className="text-red-600 hover:underline">Login</a> page.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Navigate to Admin Dashboard</h2>
              <p className="text-gray-600">
                Once logged in, go to the <a href="/admin" className="text-red-600 hover:underline">Admin Dashboard</a>. From there, select "Manage Donation Centers" (or a similar option, depending on your setup).
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Add a New Donation Center</h2>
              <p className="text-gray-600">
                Click the "Add New Center" button. Fill in the required details, such as the center's name, address, city, state, and contact information. Ensure all information is accurate.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 4: Submit and Verify</h2>
              <p className="text-gray-600">
                Submit the form to register the donation center. You may need to verify the center's details with the platform team to ensure it meets the necessary standards for blood donation.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/admin"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
            >
              Go to Admin Dashboard
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuideRegisterDonationCenter;