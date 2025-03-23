import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              About BloodDonate
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Connecting donors with recipients to save lives through the gift of blood donation.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-gray-600 mb-4">
                At BloodDonate, our mission is to bridge the gap between blood donors and those in need. We believe that
                everyone should have access to safe blood when they need it most. Through our platform, we aim to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Increase awareness about the importance of blood donation</li>
                <li>Make the donation process simple and accessible</li>
                <li>Ensure timely delivery of blood to patients in critical need</li>
                <li>Build a community of regular donors committed to saving lives</li>
                <li>Provide education about blood types and compatibility</li>
              </ul>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-gray-600 mb-4">
                BloodDonate was founded in 2020 by a group of healthcare professionals who witnessed firsthand the
                challenges faced by hospitals in maintaining adequate blood supplies. After seeing patients suffer due
                to blood shortages, they decided to create a solution that would connect willing donors with those in
                need.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small local initiative has grown into a nationwide platform that has facilitated
                thousands of donations and helped save countless lives. Our team continues to innovate and improve our
                services, driven by the belief that no one should die due to lack of blood availability.
              </p>
              <p className="text-gray-600">
                Today, BloodDonate operates in partnership with hundreds of donation centers and hospitals across the
                country, making it easier than ever for donors to give the gift of life.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Team Member 1 */}
                <div className="text-center">
                  <div className="mx-auto h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Dr. Sarah Johnson</h3>
                    <p className="text-sm text-gray-500">Co-Founder & CEO</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Hematologist with 15 years of experience in blood banking and transfusion medicine.
                    </p>
                  </div>
                </div>

                {/* Team Member 2 */}
                <div className="text-center">
                  <div className="mx-auto h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Michael Chen</h3>
                    <p className="text-sm text-gray-500">Co-Founder & CTO</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Software engineer passionate about using technology to solve healthcare challenges.
                    </p>
                  </div>
                </div>

                {/* Team Member 3 */}
                <div className="text-center">
                  <div className="mx-auto h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Dr. James Rodriguez</h3>
                    <p className="text-sm text-gray-500">Medical Director</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Emergency medicine specialist with expertise in trauma care and blood transfusion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">Our Impact</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-red-600">50,000+</div>
                  <p className="mt-2 text-sm text-gray-600">Donations Facilitated</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-red-600">1,000+</div>
                  <p className="mt-2 text-sm text-gray-600">Partner Hospitals</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-red-600">150,000+</div>
                  <p className="mt-2 text-sm text-gray-600">Lives Impacted</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600">
                Every day, our platform helps connect donors with recipients, ensuring that blood is available when and
                where it's needed most. We're proud of the impact we've made, but we know there's still much work to be
                done. Join us in our mission to ensure that no one suffers due to blood shortages.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default About

