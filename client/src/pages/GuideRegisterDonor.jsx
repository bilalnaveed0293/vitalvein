import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GuideRegisterDonor = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Guide to Register as a Donor
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Become a blood donor and make a difference in someone's life today.
          </p>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Sign Up</h2>
              <p className="text-gray-600">
                Visit the <a href="/register" className="text-red-600 hover:underline">Register</a> page and create an account. Select "Donor" as your user type during registration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Complete Your Profile</h2>             <p className="text-gray-600">
                After registering, log in and go to your <a href="/donor-profile" className="text-red-600 hover:underline">Donor Profile</a>. Fill in your personal details, including your blood type, location, and contact information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Verify Eligibility</h2>
              <p className="text-gray-600">
                Ensure you meet the eligibility criteria for blood donation (e.g., age, weight, health conditions). You may need to confirm your eligibility with a health questionnaire.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 4: Schedule Your First Donation</h2>
              <p className="text-gray-600">
                Once your profile is complete, go to the <a href="/appointments" className="text-red-600 hover:underline">Appointments</a> page to schedule your first blood donation at a nearby center.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/register"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
            >
              Register as a Donor
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuideRegisterDonor;