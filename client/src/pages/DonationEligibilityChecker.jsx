import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DonationEligibilityChecker = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    lastDonation: '',
    healthConditions: 'no',
    pregnancy: 'no',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { age, weight, lastDonation, healthConditions, pregnancy } = formData;

    // Basic eligibility criteria (simplified for this example)
    const ageNum = parseInt(age);
    const weightNum = parseInt(weight);
    const lastDonationDays = parseInt(lastDonation);

    let isEligible = true;
    let message = '';

    // Check age (must be 18-65)
    if (ageNum < 18 || ageNum > 65) {
      isEligible = false;
      message += 'You must be between 18 and 65 years old to donate blood. ';
    }

    // Check weight (must be at least 110 lbs / ~50 kg)
    if (weightNum < 50) {
      isEligible = false;
      message += 'You must weigh at least 50 kg (110 lbs) to donate blood. ';
    }

    // Check last donation (must be at least 56 days ago)
    if (lastDonationDays !== '' && lastDonationDays < 56) {
      isEligible = false;
      message += 'You must wait at least 56 days since your last donation. ';
    }

    // Check health conditions
    if (healthConditions === 'yes') {
      isEligible = false;
      message += 'Certain health conditions may prevent you from donating. Please consult a doctor. ';
    }

    // Check pregnancy
    if (pregnancy === 'yes') {
      isEligible = false;
      message += 'You cannot donate blood if you are pregnant or have given birth in the last 6 weeks. ';
    }

    if (isEligible) {
      message = 'You are likely eligible to donate blood! Please register and schedule an appointment.';
    }

    setResult(message);
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Donation Eligibility Checker
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Answer a few questions to see if you’re eligible to donate blood.
          </p>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age (years)
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="lastDonation" className="block text-sm font-medium text-gray-700">
                Days since last donation (if applicable)
              </label>
              <input
                type="number"
                id="lastDonation"
                name="lastDonation"
                value={formData.lastDonation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="Enter 0 if you've never donated"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Do you have any major health conditions? (e.g., heart disease, diabetes, recent surgery)
              </label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="healthConditions"
                    value="yes"
                    checked={formData.healthConditions === 'yes'}
                    onChange={handleChange}
                    className="form-radio text-red-600"
                  />
                  <span className="ml-2 text-gray-600">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="healthConditions"
                    value="no"
                    checked={formData.healthConditions === 'no'}
                    onChange={handleChange}
                    className="form-radio text-red-600"
                  />
                  <span className="ml-2 text-gray-600">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Are you pregnant or have you given birth in the last 6 weeks?
              </label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="pregnancy"
                    value="yes"
                    checked={formData.pregnancy === 'yes'}
                    onChange={handleChange}
                    className="form-radio text-red-600"
                  />
                  <span className="ml-2 text-gray-600">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="pregnancy"
                    value="no"
                    checked={formData.pregnancy === 'no'}
                    onChange={handleChange}
                    className="form-radio text-red-600"
                  />
                  <span className="ml-2 text-gray-600">No</span>
                </label>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
              >
                Check Eligibility
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Result</h2>
              <p className={`text-gray-600 ${result.includes('eligible') ? 'text-green-600' : 'text-red-600'}`}>
                {result}
              </p>
              {result.includes('eligible') && (
                <div className="mt-4 text-center">
                  <Link
                    to="/register"
                    className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
                  >
                    Register as a Donor
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonationEligibilityChecker;