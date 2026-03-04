import { motion } from 'framer-motion';
import { FaAward, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

export default function NFTCertificateCard({ certificate }) {
  const formattedDate = new Date(certificate.timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-effect rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
    >
      {/* Certificate Header with NFT Badge */}
      <div className="relative">
        <div className="bg-gradient-to-br from-primary-600 via-secondary-600 to-pink-600 p-8 text-white">
          <div className="absolute top-4 right-4">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
              NFT #{certificate.tokenId}
            </div>
          </div>
          
          <div className="text-center">
            <FaAward className="text-6xl mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold mb-2">Impact Certificate</h3>
            <p className="text-sm opacity-90">Blockchain Verified</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="p-6 bg-white">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Donated to:</h4>
          <p className="text-lg font-bold text-gray-900">{certificate.studentName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-600 mb-1">Amount</h4>
            <p className="text-lg font-bold text-primary-600">
              {parseFloat(certificate.donationAmount).toFixed(4)} ETH
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-600 mb-1">Date</h4>
            <p className="text-sm text-gray-900">{formattedDate}</p>
          </div>
        </div>

        {certificate.impactDescription && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-600 mb-1">Impact</h4>
            <p className="text-sm text-gray-700">{certificate.impactDescription}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-semibold">
            <FaDownload />
            Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold">
            <FaExternalLinkAlt />
            View on Chain
          </button>
        </div>
      </div>
    </motion.div>
  );
}
