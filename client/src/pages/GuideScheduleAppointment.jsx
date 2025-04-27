import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GuideScheduleAppointment = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Guide to Schedule an Appointment
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Schedule your blood donation appointment in a few easy steps.
          </p>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Log In to Your Account</h2>
              <p className="text-gray-600">
                Log in to your account via the <a href="/login" className="text-red-600 hover:underline">Login</a> page. You must be a registered donor to schedule an appointment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Navigate to Appointments</h2>
              <p className="text-gray-600">
                Go to the <a href="/appointments" className="text-red-600 hover:underline">Appointments</a> page from the navigation bar or your dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 3: Choose a Donation Center</h2>
              <p className="text-gray-600">
                Select a donation center from the list. You can find centers near your location by visiting the <a href="/donation-centers" className="text-red-600 hover:underline">Donation Centers</a> page.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 4: Select Date and Time</h2>
              <p className="text-gray-600">
                Choose a date and time for your appointment. Confirm your selection and submit the appointment request. You’ll receive a confirmation once it’s scheduled.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/appointments"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
            >
              Schedule an Appointment
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuideScheduleAppointment;