import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaCheckCircle, FaUsers, FaGlobe, FaArrowRight } from 'react-icons/fa';
import Layout from '../components/Layout';
import StudentCard from '../components/StudentCard';
import SchoolPoolCard from '../components/SchoolPoolCard';
import StatsCard from '../components/StatsCard';
import useWeb3Store from '../store/useWeb3Store';

export default function Home() {
  const { students, pools, stats, isConnected, loadStudents, loadPools, loadStats } = useWeb3Store();
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    if (isConnected) {
      loadStudents();
      loadPools();
      loadStats();
    }
  }, [isConnected]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                🌍 Supporting SDG 4 & 10
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Empower Education Through{' '}
              <span className="gradient-text">Blockchain</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Make transparent, traceable micro-donations directly to students in need. 
              Every contribution is tracked on blockchain, ensuring 90%+ reaches beneficiaries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
                onClick={() => document.getElementById('donate-section').scrollIntoView({ behavior: 'smooth' })}
              >
                <FaHandHoldingHeart />
                Start Donating
                <FaArrowRight className="ml-2" />
              </motion.button>

              <motion.a
                href="/impact-map"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center gap-2"
              >
                <FaGlobe />
                View Impact Map
              </motion.a>
            </div>

            {/* Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              <motion.div variants={itemVariants} className="glass-effect p-6 rounded-xl">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">100% Transparent</h3>
                <p className="text-gray-600">Every transaction tracked on blockchain</p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-effect p-6 rounded-xl">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Instant Impact</h3>
                <p className="text-gray-600">Direct donations to verified students</p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-effect p-6 rounded-xl">
                <div className="text-4xl mb-4">🎖️</div>
                <h3 className="text-xl font-bold mb-2">NFT Certificates</h3>
                <p className="text-gray-600">Receive impact proof as unique NFTs</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {isConnected && stats && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <StatsCard
                icon={<FaHandHoldingHeart />}
                title="Total Donated"
                value={`${parseFloat(stats.totalDonated).toFixed(4)} ETH`}
                gradient="from-primary-500 to-primary-700"
              />
              <StatsCard
                icon={<FaCheckCircle />}
                title="Donations"
                value={stats.donationCount}
                gradient="from-success-500 to-success-700"
              />
              <StatsCard
                icon={<FaUsers />}
                title="Students Helped"
                value={stats.studentCount}
                gradient="from-secondary-500 to-secondary-700"
              />
              <StatsCard
                icon={<FaGlobe />}
                title="Schools"
                value={stats.schoolCount}
                gradient="from-pink-500 to-pink-700"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section id="donate-section" className="py-12 px-4">
        <div className="container mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="glass-effect p-1 rounded-lg inline-flex">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'students'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Individual Students
              </button>
              <button
                onClick={() => setActiveTab('pools')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'pools'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                School Pools
              </button>
            </div>
          </div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="glass-effect p-12 rounded-2xl max-w-md mx-auto">
                <FaHandHoldingHeart className="text-6xl text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-6">
                  Connect your MetaMask wallet to start making a difference
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {activeTab === 'students' ? (
                students.length > 0 ? (
                  students.map((student) => (
                    <motion.div key={student.id} variants={itemVariants}>
                      <StudentCard student={student} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">No students available at the moment.</p>
                  </div>
                )
              ) : (
                pools.length > 0 ? (
                  pools.map((pool) => (
                    <motion.div key={pool.id} variants={itemVariants}>
                      <SchoolPoolCard pool={pool} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">No active school pools at the moment.</p>
                  </div>
                )
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect p-12 rounded-2xl text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              Join the <span className="gradient-text">Revolution</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Together, we can bridge the education gap and create equal opportunities for all children.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-700">
                <FaCheckCircle className="text-success-500" />
                <span>Transparent Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaCheckCircle className="text-success-500" />
                <span>Smart Contract Security</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaCheckCircle className="text-success-500" />
                <span>Real-Time Impact</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
