'use client'

import { motion } from "framer-motion"

function variants() {
  return {
    offscreen: {
      y: 150,
      opacity: 0,
    },
    onscreen: ({ duration = 2 } = {}) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration,
      },
    }),
  }
}

export default function AnimationWrapper({ children, className = "" }) {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
      variants={variants()}
    >
      {children}
    </motion.div>
  )
} 