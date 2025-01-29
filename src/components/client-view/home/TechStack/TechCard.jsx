'use client';

import { motion, AnimatePresence } from 'framer-motion';

const TechCard = ({ 
  category, 
  technologies, 
  categoryColor, 
  categoryTitle,
  hoveredTech,
  setHoveredTech 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${categoryColor} 
        backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 
        rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
        border border-gray-200 dark:border-gray-700`}
      role="tabpanel"
      id={`${category}-tech-panel`}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {categoryTitle}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {technologies.map((tech) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={tech.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredTech(tech.name)}
              onHoverEnd={() => setHoveredTech(null)}
              className="group relative flex flex-col items-center justify-center p-3 
                rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 
                transition-all duration-300"
              role="button"
              tabIndex={0}
              aria-label={`${tech.name}: ${tech.description}`}
            >
              <Icon className={`text-3xl ${tech.color} mb-2 
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
                    role="tooltip"
                  >
                    <div className="font-medium mb-1">{tech.name}</div>
                    <div className="opacity-90">{tech.description}</div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                      w-2 h-2 bg-black/90 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TechCard; 