import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import RequestForm from '../components/RequestForm';
import { FaHandHoldingHeart, FaCheckCircle, FaUsers, FaShieldAlt } from 'react-icons/fa';

export default function RequestPage() {
  const benefits = [
    {
      icon: <FaHandHoldingHeart className="text-4xl text-primary-600" />,
      title: 'Direct Support',
      description: 'Receive donations directly from our global community of supporters'
    },
    {
      icon: <FaCheckCircle className="text-4xl text-success-600" />,
      title: 'Verified Requests',
      description: 'All requests are verified to ensure transparency and trust'
    },
    {
      icon: <FaUsers className="text-4xl text-secondary-600" />,
      title: 'Community Impact',
      description: 'Join a network of students and organizations creating real change'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-warning-600" />,
      title: 'Blockchain Security',
      description: 'All transactions are secured and transparent on the blockchain'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Request Support</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a student in need or an organization supporting education, 
            we're here to help you get the resources you need to succeed.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-effect rounded-xl p-6 text-center hover:shadow-xl transition-all card-hover"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16 glass-effect rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center gradient-text">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Submit Request</h3>
              <p className="text-sm text-gray-600">
                Fill out the form with your details and funding needs
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Verification</h3>
              <p className="text-sm text-gray-600">
                Our team verifies your request within 5-7 business days
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Get Support</h3>
              <p className="text-sm text-gray-600">
                Once approved, your request goes live and receives donations
              </p>
            </div>
          </div>
        </motion.div>

        {/* Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <RequestForm />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-16 glass-effect rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center gradient-text">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Who can submit a request?</h3>
              <p className="text-gray-600">
                Any student in need of educational support or any verified organization 
                working in the education sector can submit a request.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">How long does verification take?</h3>
              <p className="text-gray-600">
                Our team typically reviews and verifies requests within 5-7 business days. 
                You'll receive an email once your request is reviewed.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">What documents do I need?</h3>
              <p className="text-gray-600">
                For students: Student ID, enrollment proof, or school letter. 
                For organizations: Registration documents, tax-exempt status, and proof of educational activities.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Is there a fee to submit a request?</h3>
              <p className="text-gray-600">
                No! Submitting a request is completely free. We only charge a small platform 
                fee (5%) on successful donations to maintain the platform.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
