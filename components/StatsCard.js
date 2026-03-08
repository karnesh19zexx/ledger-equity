import { motion } from 'framer-motion';

export default function StatsCard({ icon, title, value, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-effect rounded-xl p-6 relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
      <div className="relative z-10">
        <div className={`text-3xl mb-3 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}
