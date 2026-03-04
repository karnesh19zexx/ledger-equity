import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaGraduationCap, FaSchool } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import useWeb3Store from '../store/useWeb3Store';

// Dynamically import map component (client-side only)
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] glass-effect rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function ImpactMap() {
  const { students, isConnected, loadStudents } = useWeb3Store();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadStudents();
    }
    setMapReady(true);
  }, [isConnected]);

  const totalImpact = students.reduce((sum, student) => {
    return sum + parseFloat(student.receivedAmount);
  }, 0);

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'text-success-600';
    if (progress >= 50) return 'text-warning-600';
    return 'text-primary-600';
  };

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
            Global <span className="gradient-text">Impact Map</span>
          </h1>
          <p className="text-gray-600">
            See the real-time impact of donations across the globe
          </p>
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="glass-effect p-12 rounded-2xl max-w-md mx-auto">
              <FaMapMarkerAlt className="text-6xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-gray-600">
                Connect your wallet to view the global impact map
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="glass-effect p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FaGraduationCap className="text-2xl text-primary-600" />
                  <h3 className="text-sm font-semibold text-gray-600">Students Supported</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                <p className="text-xs text-gray-500 mt-1">Across {new Set(students.map(s => s.location)).size} locations</p>
              </div>

              <div className="glass-effect p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FaSchool className="text-2xl text-secondary-600" />
                  <h3 className="text-sm font-semibold text-gray-600">Total Impact</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalImpact.toFixed(4)} ETH</p>
                <p className="text-xs text-gray-500 mt-1">Distributed globally</p>
              </div>

              <div className="glass-effect p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FaMapMarkerAlt className="text-2xl text-success-600" />
                  <h3 className="text-sm font-semibold text-gray-600">Active Regions</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{new Set(students.map(s => s.location.split(',')[1]?.trim())).size}</p>
                <p className="text-xs text-gray-500 mt-1">Countries reached</p>
              </div>
            </motion.div>

            {/* Map and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2"
              >
                {mapReady && students.length > 0 && (
                  <MapComponent
                    students={students}
                    selectedStudent={selectedStudent}
                    onStudentSelect={setSelectedStudent}
                  />
                )}
              </motion.div>

              {/* Student List / Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect p-6 rounded-xl max-h-[600px] overflow-y-auto"
              >
                {selectedStudent ? (
                  <div>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
                    >
                      ← Back to list
                    </button>
                    
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-lg text-white mb-4">
                      <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                      <p className="text-sm opacity-90">{selectedStudent.location}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Needs:</h4>
                        <p className="text-gray-700">{selectedStudent.needs}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Progress:</h4>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full"
                            style={{
                              width: `${Math.min((parseFloat(selectedStudent.receivedAmount) / parseFloat(selectedStudent.targetAmount)) * 100, 100)}%`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {parseFloat(selectedStudent.receivedAmount).toFixed(4)} ETH
                          </span>
                          <span className="text-gray-600">
                            Goal: {parseFloat(selectedStudent.targetAmount).toFixed(4)} ETH
                          </span>
                        </div>
                      </div>

                      <button className="w-full btn-primary">
                        Donate Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold mb-4">All Students</h3>
                    <div className="space-y-3">
                      {students.map((student) => {
                        const progress = (parseFloat(student.receivedAmount) / parseFloat(student.targetAmount)) * 100;
                        return (
                          <motion.div
                            key={student.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedStudent(student)}
                            className="p-4 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70 transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary-600" />
                                <span className="font-semibold">{student.name}</span>
                              </div>
                              <span className={`text-xs font-semibold ${getProgressColor(progress)}`}>
                                {progress.toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{student.location}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect p-6 rounded-xl mt-6"
            >
              <h3 className="text-lg font-bold mb-4">Map Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-success-500 to-success-600"></div>
                  <span className="text-sm text-gray-700">75-100% Funded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-warning-500 to-warning-600"></div>
                  <span className="text-sm text-gray-700">50-75% Funded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"></div>
                  <span className="text-sm text-gray-700">25-50% Funded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500"></div>
                  <span className="text-sm text-gray-700">0-25% Funded</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
}
