import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCheckCircle, FaDonate } from 'react-icons/fa';
import useWeb3Store from '../store/useWeb3Store';
import { toast } from 'react-toastify';

export default function StudentCard({ student }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const { donate, isLoading } = useWeb3Store();

  const progress = (parseFloat(student.receivedAmount) / parseFloat(student.targetAmount)) * 100;

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await donate(student.id, amount, message);
      toast.success(`Successfully donated ${amount} ETH to ${student.name}!`);
      setShowModal(false);
      setAmount('');
      setMessage('');
    } catch (error) {
      toast.error('Donation failed: ' + error.message);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="glass-effect rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
      >
        {/* Student Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-bold">{student.name}</h3>
            {student.verified && (
              <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                <FaCheckCircle />
                <span>Verified</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <FaMapMarkerAlt />
            <span>{student.location}</span>
          </div>
        </div>

        {/* Student Details */}
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Needs:</h4>
            <p className="text-gray-700">{student.needs}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-primary-600">
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-600">
              <span>{parseFloat(student.receivedAmount).toFixed(4)} ETH</span>
              <span>Goal: {parseFloat(student.targetAmount).toFixed(4)} ETH</span>
            </div>
          </div>

          {/* Donate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <FaDonate />
            Donate Now
          </motion.button>
        </div>
      </motion.div>

      {/* Donation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-4">
                Donate to {student.name}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a message of support..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonate}
                  disabled={isLoading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner" />
                      Processing...
                    </span>
                  ) : (
                    'Confirm Donation'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
