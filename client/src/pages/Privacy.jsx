import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Last updated: March 2023</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                  At BloodDonate, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our service.
                </p>

                <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Health information (blood type, donation history)</li>
                  <li>Location information</li>
                  <li>Account credentials</li>
                </ul>

                <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and manage appointments and blood requests</li>
                  <li>Communicate with you about our services</li>
                  <li>Monitor and analyze usage patterns</li>
                  <li>Protect against, identify, and prevent fraud and other illegal activity</li>
                </ul>

                <h2 className="text-xl font-semibold mb-4">4. Sharing of Information</h2>
                <p className="mb-4">We may share your information with:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Donation centers and hospitals (with your consent)</li>
                  <li>Service providers who perform services on our behalf</li>
                  <li>Law enforcement or other third parties when required by law</li>
                </ul>

                <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information. However, no method of
                  transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
                  security.
                </p>

                <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
                <p className="mb-4">
                  Depending on your location, you may have certain rights regarding your personal information,
                  including:
                </p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your information</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                </ul>

                <h2 className="text-xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
                <p className="mb-4">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date.
                </p>

                <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@blooddonate.org" className="text-red-600 hover:text-red-800">
                    privacy@blooddonate.org
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Privacy

