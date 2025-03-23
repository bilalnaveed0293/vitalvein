import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Last updated: March 2023</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing or using the BloodDonate service, you agree to be bound by these Terms of Service. If you
                  do not agree to these terms, please do not use our service.
                </p>

                <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
                <p className="mb-4">
                  BloodDonate is a platform that connects blood donors with recipients and donation centers. We
                  facilitate the process of blood donation by providing information, scheduling appointments, and
                  managing blood requests.
                </p>

                <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                <p className="mb-4">
                  To use certain features of our service, you must register for an account. You agree to provide
                  accurate, current, and complete information during the registration process and to update such
                  information to keep it accurate, current, and complete.
                </p>

                <h2 className="text-xl font-semibold mb-4">4. User Responsibilities</h2>
                <p className="mb-4">
                  You are responsible for maintaining the confidentiality of your account information, including your
                  password. You agree to notify us immediately of any unauthorized use of your account or any other
                  breach of security.
                </p>

                <h2 className="text-xl font-semibold mb-4">5. Medical Disclaimer</h2>
                <p className="mb-4">
                  The information provided on BloodDonate is for general informational purposes only and is not intended
                  as medical advice. Always consult with a qualified healthcare provider before making decisions about
                  your health.
                </p>

                <h2 className="text-xl font-semibold mb-4">6. Privacy</h2>
                <p className="mb-4">
                  Your use of BloodDonate is also governed by our Privacy Policy, which can be found{" "}
                  <a href="/privacy" className="text-red-600 hover:text-red-800">
                    here
                  </a>
                  .
                </p>

                <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
                <p className="mb-4">
                  BloodDonate and its affiliates, officers, employees, agents, partners, and licensors shall not be
                  liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting
                  from your use or inability to use the service.
                </p>

                <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
                <p className="mb-4">
                  We reserve the right to modify these Terms of Service at any time. We will provide notice of
                  significant changes by posting the new Terms of Service on this page and updating the "Last updated"
                  date.
                </p>

                <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="mailto:support@blooddonate.org" className="text-red-600 hover:text-red-800">
                    support@blooddonate.org
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

export default Terms

