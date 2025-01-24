'use client'

import { motion } from 'framer-motion'

export const FloatingShapes = () => {
  const shapes = Array(6).fill(null)
  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window?.innerWidth,
            y: Math.random() * window?.innerHeight,
            scale: 0,
            rotate: 0
          }}
          animate={{
            x: [
              Math.random() * window?.innerWidth,
              Math.random() * window?.innerWidth,
              Math.random() * window?.innerWidth
            ],
            y: [
              Math.random() * window?.innerHeight,
              Math.random() * window?.innerHeight,
              Math.random() * window?.innerHeight
            ],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        >
          <div className={`
            w-32 h-32 opacity-10 
            ${i % 2 === 0 ? 'bg-green-400' : 'bg-green-600'} 
            ${i % 3 === 0 ? 'rounded-full' : 'rounded-lg'}
          `} />
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingShapes 