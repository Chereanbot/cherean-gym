'use client';

import { motion } from 'framer-motion';

const CategoryNav = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100
          }
        }
      }}
      className="flex flex-wrap justify-center gap-4 mb-8"
    >
      {Object.entries(categories).map(([key, value]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
          className={`px-4 py-2 rounded-full font-medium transition-all
            ${selectedCategory === key 
              ? 'bg-green-500 text-white shadow-lg scale-105' 
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
          aria-pressed={selectedCategory === key}
          role="tab"
          aria-controls={`${key}-tech-panel`}
        >
          {value}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default CategoryNav; 