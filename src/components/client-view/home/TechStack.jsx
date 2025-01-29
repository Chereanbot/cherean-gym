import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { techStacks, stackCategories } from '@/constants/techStack';
import RotatingCorners from './RotatingCorners';

const TechStack = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredTech, setHoveredTech] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'frontend': return 'from-blue-500/20 to-cyan-500/20';
      case 'backend': return 'from-green-500/20 to-emerald-500/20';
      case 'database': return 'from-purple-500/20 to-pink-500/20';
      case 'devops': return 'from-orange-500/20 to-red-500/20';
      case 'tools': return 'from-yellow-500/20 to-amber-500/20';
      default: return 'from-gray-500/20 to-slate-500/20';
    }
  };

  return (
    <div className="relative p-8 my-16">
      {/* Enhanced rotating corners with glow */}
      <RotatingCorners 
        size="w-20 h-20"
        duration={30}
        borderColor="border-green-500"
        borderWidth="border-2"
        className="opacity-70"
        glowColor="rgba(13, 183, 96, 0.5)"
      />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-12"
      >
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Modern technologies I work with
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {Object.entries(stackCategories).map(([key, value]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
              className={`px-4 py-2 rounded-full font-medium transition-all
                ${selectedCategory === key 
                  ? 'bg-green-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {value}
            </motion.button>
          ))}
        </motion.div>

        {/* Tech Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {Object.entries(techStacks)
              .filter(([category]) => !selectedCategory || category === selectedCategory)
              .map(([category, technologies]) => (
                <motion.div
                  key={category}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gradient-to-br ${getCategoryColor(category)} 
                    backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 
                    rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
                    border border-gray-200 dark:border-gray-700`}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {stackCategories[category]}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {technologies.map((tech) => (
                      <motion.div
                        key={tech.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => setHoveredTech(tech.name)}
                        onHoverEnd={() => setHoveredTech(null)}
                        className="group relative flex flex-col items-center justify-center p-3 
                          rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 
                          transition-all duration-300"
                      >
                        <tech.icon className={`text-3xl ${tech.color} mb-2 
                          transition-all duration-300 group-hover:scale-110 
                          group-hover:transform group-hover:rotate-[360deg]`} />
                        <span className="text-sm text-center font-medium">{tech.name}</span>
                        
                        {/* Enhanced Tooltip */}
                        <AnimatePresence>
                          {hoveredTech === tech.name && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                              className="absolute -bottom-2 transform translate-y-full w-48 p-3
                                bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg
                                shadow-xl z-50"
                            >
                              <div className="font-medium mb-1">{tech.name}</div>
                              <div className="opacity-90">{tech.description}</div>
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                                w-2 h-2 bg-black/90 rotate-45" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-conic from-green-500/5 via-transparent to-green-500/5" />
      </div>
    </div>
  );
};

export default TechStack; 