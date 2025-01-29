'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { techStacks, stackCategories } from '@/constants/techStack';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import RotatingCorners from '../RotatingCorners';
import CategoryNav from './CategoryNav';
import TechCard from './TechCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

const TechStack = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredTech, setHoveredTech] = useState(null);
  const [error, setError] = useState(null);

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

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-red-500 font-semibold">Error loading tech stack</h2>
        <button
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative p-8 my-16">
        {/* Rotating Corners */}
        <div className="relative">
          <RotatingCorners 
            size="w-20 h-20"
            duration={30}
            borderColor="border-green-500"
            borderWidth="border-2"
            className="opacity-70"
            glowColor="rgba(13, 183, 96, 0.5)"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-12"
        >
          {/* Title Section */}
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
          <div className="relative">
            <CategoryNav 
              categories={stackCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {/* Tech Cards Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="wait">
              {Object.entries(techStacks)
                .filter(([category]) => !selectedCategory || category === selectedCategory)
                .map(([category, technologies]) => (
                  <div key={category} className="relative">
                    <TechCard
                      category={category}
                      technologies={technologies}
                      categoryColor={getCategoryColor(category)}
                      categoryTitle={stackCategories[category]}
                      hoveredTech={hoveredTech}
                      setHoveredTech={setHoveredTech}
                    />
                  </div>
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
    </ErrorBoundary>
  );
};

export default TechStack; 