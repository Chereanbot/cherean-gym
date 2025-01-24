'use client'

import { useMemo, useRef, useEffect, useState } from "react"
import AnimationWrapper from "../animation-wrapper"
import { motion } from 'framer-motion'
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa"
import { FaCode, FaPalette, FaDatabase, FaCogs, FaLaptopCode, FaBrain, FaRocket, FaTools, FaUserTie } from "react-icons/fa"
import Image from "next/image"
import home from "../../../assets/download.png"
import portfolio2 from "../../../assets/portfolio2.png"
import portfolio3 from "../../../assets/portfolio3.png"
import { getData } from "@/services"
import { useRouter } from 'next/navigation'

function variants() {
  return {
    offscreen: {
      y: 150,
      opacity: 0
    },
    onscreen: ({ duration = 2 } = {}) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration,
      }
    })
  }
}

const socialIcons = [
  {
    id: "facebook",
    icon: <FaFacebookF color="rgba(13, 183, 96, 1)" className="w-[40px] h-[40px]" />
  },
  {
    id: "twitter",
    icon: <FaTwitter color="rgba(13, 183, 96, 1)" className="w-[40px] h-[40px]" />
  },
  {
    id: "linkedin",
    icon: <FaLinkedinIn color="rgba(13, 183, 96, 1)" className="w-[40px] h-[40px]" />
  },
  {
    id: "instagram",
    icon: <FaInstagram color="rgba(13, 183, 96, 1)" className="w-[40px] h-[40px]" />
  }
]

const PlanetarySystem = ({ data }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const orbitVariants = {
    animate: (custom) => ({
      rotate: 360,
      transition: {
        duration: 60 + custom * 15,
        repeat: Infinity,
        ease: "linear"
      }
    })
  };

  const imageVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const nodeVariants = {
    initial: { scale: 0.95, opacity: 0.95 },
    hover: { 
      scale: 1.5, 
      opacity: 1,
      boxShadow: "0 0 30px rgba(13, 183, 96, 0.8)"
    }
  };

  const orbitalNodes = [
    { 
      icon: <FaCode />, 
      label: "Next.js", 
      color: "bg-blue-500",
      gradient: "from-blue-400 to-blue-600",
      description: "Modern Framework",
      size: "56px",
      iconSize: "28px",
      orbitSize: 400,
      iconColor: "#3B82F6"
    },
    { 
      icon: <FaDatabase />, 
      label: "MongoDB", 
      color: "bg-purple-500",
      gradient: "from-purple-400 to-purple-600",
      description: "Database",
      size: "52px",
      iconSize: "26px",
      orbitSize: 480,
      iconColor: "#8B5CF6"
    },
    { 
      icon: <FaPalette />, 
      label: "TypeScript", 
      color: "bg-pink-500",
      gradient: "from-pink-400 to-pink-600",
      description: "Type Safety",
      size: "48px",
      iconSize: "24px",
      orbitSize: 560,
      iconColor: "#EC4899"
    },
    { 
      icon: <FaLaptopCode />, 
      label: "React", 
      color: "bg-cyan-500",
      gradient: "from-cyan-400 to-cyan-600",
      description: "UI Library",
      size: "44px",
      iconSize: "22px",
      orbitSize: 640,
      iconColor: "#06B6D4"
    },
    { 
      icon: <FaBrain />, 
      label: "Node.js", 
      color: "bg-green-500",
      gradient: "from-green-400 to-green-600",
      description: "Backend Runtime",
      size: "40px",
      iconSize: "20px",
      orbitSize: 720,
      iconColor: "#22C55E"
    },
    { 
      icon: <FaRocket />, 
      label: "Express", 
      color: "bg-red-500",
      gradient: "from-red-400 to-red-600",
      description: "Web Framework",
      size: "36px",
      iconSize: "18px",
      orbitSize: 800,
      iconColor: "#EF4444"
    },
    { 
      icon: <FaTools />, 
      label: "REST API", 
      color: "bg-yellow-500",
      gradient: "from-yellow-400 to-yellow-600",
      description: "API Design",
      size: "32px",
      iconSize: "16px",
      orbitSize: 880,
      iconColor: "#EAB308"
    },
    { 
      icon: <FaCogs />, 
      label: "GraphQL", 
      color: "bg-indigo-500",
      gradient: "from-indigo-400 to-indigo-600",
      description: "Query Language",
      size: "28px",
      iconSize: "14px",
      orbitSize: 960,
      iconColor: "#6366F1"
    },
    { 
      icon: <FaUserTie />, 
      label: "TailwindCSS", 
      color: "bg-orange-500",
      gradient: "from-orange-400 to-orange-600",
      description: "Styling",
      size: "24px",
      iconSize: "12px",
      orbitSize: 1040,
      iconColor: "#F97316"
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Image Grid */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] grid grid-cols-2 gap-8 z-50">
        {/* Main Image */}
        <motion.div
          className="col-span-1 row-span-2 relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#0DB760]/20 to-transparent p-[2px]"
          variants={imageVariants}
          initial="initial"
          whileHover="hover"
          onHoverStart={() => setHoveredImage(0)}
          onHoverEnd={() => setHoveredImage(null)}
        >
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <Image
              src={portfolio2}
              alt="Portfolio 1"
              className="w-full h-full object-cover"
              width={400}
              height={800}
              priority
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              animate={{
                opacity: hoveredImage === 0 ? 0.7 : 0.8
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: hoveredImage === 0 ? 1 : 0,
                y: hoveredImage === 0 ? 0 : 20
              }}
            >
              <h3 className="text-2xl font-bold mb-2">Cherinet Aman</h3>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-[#0DB760]">Full Stack Developer</p>
                <p className="text-sm opacity-90 leading-relaxed">
                  Passionate about creating innovative web solutions with modern technologies.
                  Specialized in Next.js, React, and Node.js development.
                </p>
                <div className="flex gap-3 mt-3">
                  <span className="px-3 py-1 bg-[#0DB760]/20 rounded-full text-xs font-medium">Next.js</span>
                  <span className="px-3 py-1 bg-[#0DB760]/20 rounded-full text-xs font-medium">React</span>
                  <span className="px-3 py-1 bg-[#0DB760]/20 rounded-full text-xs font-medium">Node.js</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Secondary Images */}
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#0DB760]/20 to-transparent p-[2px]"
          variants={imageVariants}
          initial="initial"
          whileHover="hover"
          onHoverStart={() => setHoveredImage(1)}
          onHoverEnd={() => setHoveredImage(null)}
        >
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <Image
              src={portfolio3}
              alt="Portfolio 2"
              className="w-full h-full object-cover"
              width={300}
              height={300}
              priority
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              animate={{
                opacity: hoveredImage === 1 ? 0.7 : 0.8
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-5 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: hoveredImage === 1 ? 1 : 0,
                y: hoveredImage === 1 ? 0 : 20
              }}
            >
              <h3 className="text-xl font-bold mb-2">Backend Expert</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#0DB760]">API Development & Database Design</p>
                <p className="text-xs opacity-90 leading-relaxed">
                  Experienced in building scalable backend systems and RESTful APIs.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-[#0DB760]/20 rounded-full text-xs font-medium">MongoDB</span>
                  <span className="px-2 py-1 bg-[#0DB760]/20 rounded-full text-xs font-medium">Express</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#0DB760]/20 to-transparent p-[2px]"
          variants={imageVariants}
          initial="initial"
          whileHover="hover"
          onHoverStart={() => setHoveredImage(2)}
          onHoverEnd={() => setHoveredImage(null)}
        >
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <Image
              src={home}
              alt="Portfolio 3"
              className="w-full h-full object-cover"
              width={300}
              height={300}
              priority
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              animate={{
                opacity: hoveredImage === 2 ? 0.7 : 0.8
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-5 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: hoveredImage === 2 ? 1 : 0,
                y: hoveredImage === 2 ? 0 : 20
              }}
            >
              <h3 className="text-xl font-bold mb-2">Frontend Specialist</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#0DB760]">UI/UX Development</p>
                <p className="text-xs opacity-90 leading-relaxed">
                  Creating beautiful, responsive, and user-friendly interfaces.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-[#0DB760]/20 rounded-full text-xs font-medium">TailwindCSS</span>
                  <span className="px-2 py-1 bg-[#0DB760]/20 rounded-full text-xs font-medium">TypeScript</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Orbital System */}
      <div className="absolute inset-0 animate-spin-slow">
        {orbitalNodes.map((node, index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${500 + index * 80}px`,
              height: `${500 + index * 80}px`,
              border: `1px solid ${node.iconColor}25`,
              transform: `rotate(${index * 40}deg) translateZ(0)`,
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            <motion.div
              className={`absolute p-4 rounded-full bg-gradient-to-r ${node.gradient} text-white cursor-pointer shadow-xl backdrop-blur-sm`}
              style={{
                top: "0%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(-${index * 40}deg)`,
                width: node.size,
                height: node.size,
                transformStyle: 'preserve-3d'
              }}
              variants={nodeVariants}
              initial="initial"
              whileHover="hover"
              onHoverStart={() => setHoveredPlanet(index)}
              onHoverEnd={() => setHoveredPlanet(null)}
            >
              <div className="relative flex items-center justify-center h-full">
                <div 
                  className="transform-gpu" 
                  style={{ 
                    color: node.iconColor,
                    fontSize: node.iconSize
                  }}
                >
                  {node.icon}
                </div>
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-5 py-2.5 rounded-lg text-xs shadow-2xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ 
                    opacity: hoveredPlanet === index ? 1 : 0,
                    y: hoveredPlanet === index ? 0 : 10,
                    scale: hoveredPlanet === index ? 1 : 0.8,
                    rotateX: hoveredPlanet === index ? 0 : -20
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                  style={{ 
                    top: "130%", 
                    marginTop: "12px",
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'top',
                    backgroundColor: `${node.iconColor}CC`
                  }}
                >
                  <div className="font-medium text-sm">{node.label}</div>
                  <div className="text-xs opacity-95">{node.description}</div>
                </motion.div>
              </div>
            </motion.div>
            {/* Planet Label */}
            <div 
              className="absolute text-xs font-medium tracking-wider"
              style={{
                top: "50%",
                left: "-40px",
                transform: `rotate(-${index * 40}deg)`,
                color: node.iconColor
              }}
            >
              {node.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0DB760] via-transparent to-transparent opacity-[0.1] animate-pulse pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-conic from-[#0DB760] via-transparent to-[#0DB760] opacity-[0.05] animate-pulse pointer-events-none"></div>
      
      {/* Additional Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0DB760]/10 to-transparent animate-pulse pointer-events-none transform rotate-45"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-[#0DB760]/10 to-transparent animate-pulse pointer-events-none transform -rotate-45"></div>
    </div>
  );
};

export default function ClientHomeView() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const setVariants = useMemo(() => variants(), [])
  const containerRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData('home')
        if (response.success && response.data) {
          setData(response.data)
        }
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-main"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto" id="home">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to My Portfolio</h1>
          <p className="text-gray-600 mt-4">Please add some content in the admin panel.</p>
        </div>
      </div>
    )
  }

  const headingWords = data.heading ? data.heading.split(' ') : []

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto" id="home">
            <AnimationWrapper>
              <motion.div className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16" variants={setVariants}>
                <div className="flex flex-col justify-center items-start row-start-2 sm:row-start-1">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-black-600 leading-normal">
                    {headingWords.map((item, index) => (
                      <span key={index} className={`${index === 2 || index === 3 ? "text-green-main" : "text-gray-800"}`}>
                        {item}{" "}
                      </span>
                    ))}
                  </h1>
                  <p className="text-gray-700 mt-4 mb-6 text-lg leading-relaxed">
                    {data.summary}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div className="flex gap-4">
                      {socialIcons.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ scale: 0 }}
                          animate={{ rotate: 360, scale: 1 }}
                          transition={{
                            type: "spring",
                            damping: 10,
                            stiffness: 100,
                            duration: 1.5,
                          }}
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          whileTap={{ scale: 0.9, rotate: -360, borderRadius: "100%" }}
                          className="cursor-pointer p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                        >
                          {item.icon}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                <motion.div 
                  ref={containerRef} 
                  className="flex w-full justify-center items-center relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="relative w-full max-w-[600px] aspect-square">
                    <PlanetarySystem data={data} />
                  </div>
                </motion.div>
              </motion.div>
            </AnimationWrapper>
          </div>
        </motion.div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-green-main opacity-5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-green-main opacity-5 rounded-full filter blur-3xl"></div>
        </div>
      </div>
    </>
  )
}