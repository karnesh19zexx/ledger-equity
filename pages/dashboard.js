import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaChartBar, FaHistory, FaDownload } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import NFTCertificateCard from '../components/NFTCertificateCard';
import ResourceTrackerCard from '../components/ResourceTrackerCard';
import useWeb3Store from '../store/useWeb3Store';

export default function Dashboard() {
  const { isConnected, students, stats, certificates, account } = useWeb3Store();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts (in production, this would come from blockchain)
  const donationTrendData = [
    { month: 'Jan', donations: 12 },
    { month: 'Feb', donations: 19 },
    { month: 'Mar', donations: 25 },
    { month: 'Apr', donations: 32 },
    { month: 'May', donations: 45 },
    { month: 'Jun', donations: 58 },
  ];

  const impactByRegion = [
    { name: 'Africa', value: 45, color: '#667eea' },
    { name: 'Asia', value: 35, color: '#764ba2' },
    { name: 'South America', value: 20, color: '#f093fb' },
  ];

  const resourceDistribution = [
    { category: 'Books', count: 450 },
    { category: 'Laptops', count: 89 },
    { category: 'Internet', count: 120 },
    { category: 'Uniforms', count: 230 },
    { category: 'Supplies', count: 340 },
  ];

  if (!isConnected) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="glass-effect p-12 rounded-2xl">
              <FaChartBar className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600">
                Connect your wallet to view your donation history and impact dashboard
              </p>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Your <span className="gradient-text">Impact Dashboard</span>
          </h1>
          <p className="text-gray-600">
            Track your contributions and see the real-world impact you're making
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="glass-effect p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'certificates'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              NFT Certificates
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'resources'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resource Tracker
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-effect p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">My Donations</h3>
                  <FaHistory className="text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{certificates.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total contributions</p>
              </div>

              <div className="glass-effect p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Total Impact</h3>
                  <FaAward className="text-secondary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {certificates.reduce((sum, cert) => sum + parseFloat(cert.donationAmount), 0).toFixed(4)}
                </p>
                <p className="text-xs text-gray-500 mt-1">ETH donated</p>
              </div>

              <div className="glass-effect p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Students Helped</h3>
                  <FaChartBar className="text-success-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(certificates.map(c => c.studentId)).size}
                </p>
                <p className="text-xs text-gray-500 mt-1">Unique students</p>
              </div>

              <div className="glass-effect p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">NFTs Earned</h3>
                  <FaDownload className="text-pink-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{certificates.length}</p>
                <p className="text-xs text-gray-500 mt-1">Impact certificates</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donation Trend */}
              <div className="glass-effect p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Donation Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={donationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="donations" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Impact by Region */}
              <div className="glass-effect p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Impact by Region</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactByRegion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {impactByRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Resource Distribution */}
              <div className="glass-effect p-6 rounded-xl lg:col-span-2">
                <h3 className="text-xl font-bold mb-4">Resource Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="url(#colorGradient)" />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-effect p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {certificates.slice(0, 5).map((cert, index) => (
                  <motion.div
                    key={cert.tokenId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-full">
                        <FaAward className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{cert.studentName}</p>
                        <p className="text-sm text-gray-600">
                          Donated {parseFloat(cert.donationAmount).toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(cert.timestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <NFTCertificateCard key={cert.tokenId} certificate={cert} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="glass-effect p-12 rounded-2xl max-w-md mx-auto">
                  <FaAward className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No Certificates Yet</h3>
                  <p className="text-gray-600">
                    Make your first donation to receive an NFT certificate!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ResourceTrackerCard students={students} />
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
