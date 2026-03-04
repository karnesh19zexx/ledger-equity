import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSchool, FaUsers, FaClock, FaDonate } from 'react-icons/fa';
import useWeb3Store from '../store/useWeb3Store';
import { toast } from 'react-toastify';

export default function SchoolPoolCard({ pool }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const { contributeToPool, isLoading } = useWeb3Store();

  const progress = (parseFloat(pool.currentAmount) / parseFloat(pool.targetAmount)) * 100;
  const deadline = new Date(pool.deadline * 1000);
  const now = new Date();
  const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  const handleContribute = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await contributeToPool(pool.id, amount);
      toast.success(`Successfully contributed ${amount} ETH to ${pool.schoolName}!`);
      setShowModal(false);
      setAmount('');
    } catch (error) {
      toast.error('Contribution failed: ' + error.message);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="glass-effect rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
      >
        {/* Pool Header */}
        <div className="bg-gradient-to-r from-success-600 to-success-700 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FaSchool className="text-2xl" />
            <h3 className="text-xl font-bold">{pool.schoolName}</h3>
          </div>
          <p className="text-sm opacity-90">{pool.goal}</p>
        </div>

        {/* Pool Details */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <FaUsers className="text-primary-600" />
              <span className="text-gray-600">{pool.contributorCount} Contributors</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaClock className="text-warning-600" />
              <span className="text-gray-600">{daysLeft} days left</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Funding Progress</span>
              <span className="font-semibold text-success-600">
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-success-500 to-success-600 h-full rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-600">
              <span>{parseFloat(pool.currentAmount).toFixed(4)} ETH</span>
              <span>Goal: {parseFloat(pool.targetAmount).toFixed(4)} ETH</span>
            </div>
          </div>

          {/* Status Badge */}
          {pool.completed && (
            <div className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
              ✓ Funded Successfully
            </div>
          )}

          {/* Contribute Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            disabled={pool.completed}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaDonate />
            {pool.completed ? 'Fully Funded' : 'Contribute Now'}
          </motion.button>
        </div>
      </motion.div>

      {/* Contribution Modal */}
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
              <h3 className="text-2xl font-bold mb-2">
                Contribute to Pool
              </h3>
              <p className="text-gray-600 mb-6">{pool.schoolName}</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
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
                  onClick={handleContribute}
                  disabled={isLoading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner" />
                      Processing...
                    </span>
                  ) : (
                    'Confirm'
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
