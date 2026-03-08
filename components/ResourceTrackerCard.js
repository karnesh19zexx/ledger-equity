import { motion } from 'framer-motion';
import { FaBook, FaLaptop, FaGlobe, FaTshirt, FaPencilAlt, FaArrowUp } from 'react-icons/fa';

const resourceIcons = {
  books: FaBook,
  laptop: FaLaptop,
  internet: FaGlobe,
  uniform: FaTshirt,
  supplies: FaPencilAlt,
};

export default function ResourceTrackerCard({ students }) {
  // Mock resource data (in production, this would come from blockchain)
  const resourceData = students.map((student) => {
    const progress = (parseFloat(student.receivedAmount) / parseFloat(student.targetAmount)) * 100;
    
    // Generate mock before/after data based on progress
    const resources = student.needs.split(',').map((need) => {
      const needTrimmed = need.trim().toLowerCase();
      let type = 'supplies';
      
      if (needTrimmed.includes('book')) type = 'books';
      else if (needTrimmed.includes('laptop') || needTrimmed.includes('computer')) type = 'laptop';
      else if (needTrimmed.includes('internet')) type = 'internet';
      else if (needTrimmed.includes('uniform')) type = 'uniform';
      
      return {
        type,
        name: need.trim(),
        before: 0,
        after: Math.floor((progress / 100) * 10),
      };
    });

    return {
      studentId: student.id,
      studentName: student.name,
      location: student.location,
      resources,
    };
  });

  const getIcon = (type) => {
    const Icon = resourceIcons[type] || FaPencilAlt;
    return <Icon />;
  };

  const getImprovementColor = (before, after) => {
    const improvement = after - before;
    if (improvement >= 8) return 'text-success-600';
    if (improvement >= 5) return 'text-warning-600';
    return 'text-primary-600';
  };

  return (
    <div className="space-y-6">
      <div className="glass-effect p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          Resource Impact Tracker
        </h2>
        <p className="text-gray-600 mb-6">
          See the tangible before and after impact of donations on student resources
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-lg text-white">
            <h3 className="text-sm font-semibold mb-1 opacity-90">Total Resources Provided</h3>
            <p className="text-3xl font-bold">
              {resourceData.reduce((sum, student) => 
                sum + student.resources.reduce((s, r) => s + r.after, 0), 0
              )}
            </p>
          </div>
          <div className="bg-gradient-to-r from-success-500 to-success-600 p-4 rounded-lg text-white">
            <h3 className="text-sm font-semibold mb-1 opacity-90">Students Impacted</h3>
            <p className="text-3xl font-bold">{students.length}</p>
          </div>
        </div>
      </div>

      {resourceData.map((data, index) => (
        <motion.div
          key={data.studentId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-effect rounded-xl overflow-hidden"
        >
          {/* Student Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 text-white">
            <h3 className="text-lg font-bold">{data.studentName}</h3>
            <p className="text-sm opacity-90">{data.location}</p>
          </div>

          {/* Resources */}
          <div className="p-6">
            <div className="space-y-4">
              {data.resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="bg-white/50 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                        {getIcon(resource.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{resource.name}</h4>
                        <p className="text-xs text-gray-600">Resource provided</p>
                      </div>
                    </div>
                    {resource.after > resource.before && (
                      <div className="flex items-center gap-1 text-success-600 font-semibold">
                        <FaArrowUp />
                        <span>{((resource.after - resource.before) / Math.max(resource.before, 1) * 100).toFixed(0)}% improvement</span>
                      </div>
                    )}
                  </div>

                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Before</p>
                      <div className="bg-gray-200 rounded-lg p-3">
                        <p className="text-2xl font-bold text-gray-600">{resource.before}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">After</p>
                      <div className="bg-gradient-to-r from-success-100 to-success-200 rounded-lg p-3">
                        <p className={`text-2xl font-bold ${getImprovementColor(resource.before, resource.after)}`}>
                          {resource.after}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {resourceData.length === 0 && (
        <div className="text-center py-12">
          <div className="glass-effect p-12 rounded-2xl max-w-md mx-auto">
            <FaPencilAlt className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Resources Yet</h3>
            <p className="text-gray-600">
              Resource tracking data will appear here as students receive donations
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
