import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaWallet, FaGraduationCap, FaHandHoldingHeart, FaChartLine, FaMap } from 'react-icons/fa';
import useWeb3Store from '../store/useWeb3Store';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3Store();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet: ' + error.message);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold gradient-text">EduChain</span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                <FaHandHoldingHeart />
                <span className="font-medium">Donate</span>
              </motion.div>
            </Link>
            
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                <FaChartLine />
                <span className="font-medium">Dashboard</span>
              </motion.div>
            </Link>
            
            <Link href="/impact-map">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                <FaMap />
                <span className="font-medium">Impact Map</span>
              </motion.div>
            </Link>
          </div>

          {/* Connect Wallet Button */}
          <div>
            {isConnected ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectWallet}
                className="flex items-center space-x-2 bg-gradient-to-r from-success-500 to-success-600 text-white px-4 py-2 rounded-lg shadow-lg"
              >
                <FaWallet />
                <span className="font-medium">{formatAddress(account)}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnect}
                className="flex items-center space-x-2 btn-primary"
              >
                <FaWallet />
                <span>Connect Wallet</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
