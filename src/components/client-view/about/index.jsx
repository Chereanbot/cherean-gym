'use client'

import { useMemo, useRef, useEffect, useState } from "react"
import AnimationWrapper from "../animation-wrapper"
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from "next/image"
import about from "../../../assets/about.png"
import { getData } from "@/services"
import { FaUserGraduate, FaCode, FaUsers, FaLanguage, FaTrophy, FaCertificate, FaHome, FaGlobe, 
         FaGithub, FaLinkedin, FaTwitter, FaBriefcase, FaDownload, FaEnvelope, FaLightbulb,
         FaAward, FaStar, FaGraduationCap, FaBookReader, FaChartLine } from 'react-icons/fa'
import { DeviceFrames } from '@/components/common/device-frames'
import { Exo_2, Orbitron, Playfair_Display, Inter } from 'next/font/google'
import { BsArrowUpRight, BsStars, BsLightning, BsArrowDownCircle } from 'react-icons/bs'
import { RiRocketLine, RiAwardLine, RiMagicLine, RiSparklingLine, RiFlowChart } from 'react-icons/ri'

const exo2 = Exo_2({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

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

const skillItemVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

const iconComponents = {
  'Client': FaUsers,
  'Projects': FaCode,
  'Experience': FaUserGraduate
}

const proficiencyColors = {
  'Basic': 'bg-yellow-200',
  'Intermediate': 'bg-blue-200',
  'Advanced': 'bg-green-200',
  'Native': 'bg-purple-200'
}

const tabIcons = {
  basic: FaHome,
  education: FaUserGraduate,
  certifications: FaCertificate,
  languages: FaLanguage,
  achievements: FaTrophy,
  social: FaGlobe
}

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  portfolio: FaBriefcase
}

export default function ClientAboutView() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const setVariants = useMemo(() => variants(), [])
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Add floating animation for background elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about/get')
        const result = await response.json()
        console.log('About data response:', result)
        if (result.success && result.data) {
          setData(result.data)
        } else {
          console.error('Failed to fetch about data:', result.message)
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
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
      <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto" id="about">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-800">About Me</h1>
          <p className="text-gray-600 mt-4">No content available. Please add some information in the admin panel.</p>
        </div>
      </div>
    )
  }

  const aboutDataInfo = [
    {
      label: "Client",
      value: data.noofclients || "0",
      description: "Satisfied Clients"
    },
    {
      label: "Projects",
      value: data.noofprojects || "0",
      description: "Projects Completed"
    },
    {
      label: "Experience",
      value: data.yearofexerience || "0",
      description: "Years of Experience"
    }
  ]

  const downloadResume = () => {
    // Implement resume download functionality
    alert('Resume download functionality to be implemented')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-24">
        {/* Hero Section with Professional Headline and Short Bio */}
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-16 mb-20 overflow-hidden"
          style={{ perspective: "2000px" }}
        >
          {/* Enhanced Animated Background Elements */}
          <motion.div
            className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-[40rem] h-[40rem] bg-gradient-to-tr from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Enhanced Floating Icons */}
          <motion.div
            className="absolute top-20 right-20 text-green-400/20"
            animate={floatingAnimation}
          >
            <RiSparklingLine className="w-32 h-32" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-20 text-blue-400/20"
            animate={{
              ...floatingAnimation,
              transition: { ...floatingAnimation.transition, delay: 0.5 }
            }}
          >
            <RiFlowChart className="w-28 h-28" />
          </motion.div>

          {/* Enhanced Content Container */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-[2.5rem]" />
          <motion.div 
            className="relative z-10 max-w-5xl mx-auto"
            style={{ y: y1, opacity }}
          >
            {/* Enhanced Hero Title Section */}
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg"
              >
                <RiAwardLine className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1 
                className={`${orbitron.className} text-4xl font-bold`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {data.headline}
              </motion.h1>
        </div>

            {/* Short Bio */}
            <motion.p 
              className={`${playfair.className} text-xl text-gray-600 mb-8`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {data.shortBio}
            </motion.p>

            {/* About Me */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className={`${exo2.className} text-2xl font-bold text-gray-800`}>About Me</h2>
              <p className={`${inter.className} text-gray-600 leading-relaxed`}>
                {data.aboutme}
              </p>
            </motion.div>

            {/* Professional Vision */}
            <motion.div 
              className="mt-8 space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className={`${exo2.className} text-2xl font-bold text-gray-800`}>Professional Vision</h2>
              <p className={`${inter.className} text-gray-600 leading-relaxed`}>
                {data.vision}
              </p>
      </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-6 mb-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={downloadResume}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 30px rgba(0,0,0,0.12)"
                }}
                whileTap={{ scale: 0.95 }}
                className={`${inter.className} group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/25`}
              >
                <FaDownload className="group-hover:animate-bounce" />
                <span className="font-medium">Download Resume</span>
                <BsArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
              
              <motion.a
                href="mailto:contact@example.com"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 30px rgba(0,0,0,0.08)"
                }}
                whileTap={{ scale: 0.95 }}
                className={`${inter.className} group flex items-center gap-3 px-8 py-4 bg-white text-gray-800 rounded-2xl border-2 border-gray-100 hover:border-green-200 transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                <FaEnvelope className="group-hover:animate-pulse text-green-600" />
                <span className="font-medium">Let's Talk</span>
                <BsArrowUpRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </motion.div>

            {/* Enhanced Stats Preview */}
            <motion.div 
              className="grid grid-cols-3 gap-8 max-w-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { value: data.noofprojects, label: 'Projects Completed', icon: FaCode },
                { value: data.yearofexerience, label: 'Years Experience', icon: FaUserGraduate },
                { value: data.noofclients, label: 'Happy Clients', icon: FaUsers }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-green-600 mb-3" />
                    <motion.h3 
                      className={`${orbitron.className} text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {stat.value}+
                    </motion.h3>
                    <p className={`${inter.className} text-gray-600 mt-1 text-sm font-medium`}>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BsArrowDownCircle className="w-6 h-6 text-gray-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Device Frames Section */}
        {(data.deviceImages?.iPhone || data.deviceImages?.macBook) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative transform hover:scale-[1.02] transition-transform duration-300"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl transform -skew-y-3"></div>
            <motion.div
              whileHover={{ rotateY: 5, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative z-10"
            >
              <DeviceFrames
                iPhoneImage={data.deviceImages?.iPhone}
                macBookImage={data.deviceImages?.macBook}
                className="max-w-full"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Guiding Principles Section */}
        {data.principles && data.principles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <RiMagicLine className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Guiding Principles</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {data.principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{principle.title}</h3>
                  <p className="text-gray-600">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Professional Journey Section */}
        {data.journey && data.journey.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaChartLine className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Professional Journey</h2>
            </div>
            <div className="grid gap-6">
              {data.journey.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaLightbulb className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{milestone.title}</h3>
                      <p className="text-green-600 mt-1">{milestone.year}</p>
                      <p className="text-gray-600 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaUserGraduate className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Education</h2>
            </div>
            <div className="grid gap-6">
              {data.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-green-600 mt-2">{edu.institution}</p>
                  <p className="text-gray-600 mt-1">{edu.year}</p>
                  {edu.description && (
                    <p className="text-gray-600 mt-4 leading-relaxed">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certifications Section */}
        {data.certifications && data.certifications.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaCertificate className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Certifications</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {data.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{cert.name}</h3>
                  <p className="text-green-600 mt-2">{cert.issuer}</p>
                  <p className="text-gray-600 mt-1">{cert.year}</p>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Certificate <BsArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Languages Section */}
        {data.languages && data.languages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaLanguage className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Languages</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {data.languages.map((lang, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{lang.name}</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium
                    ${proficiencyColors[lang.proficiency] || 'bg-gray-100'} 
                    ${lang.proficiency === 'Native' ? 'text-purple-800' :
                      lang.proficiency === 'Advanced' ? 'text-green-800' :
                      lang.proficiency === 'Intermediate' ? 'text-blue-800' :
                      'text-yellow-800'}`}
                  >
                    {lang.proficiency}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Achievements Section */}
        {data.achievements && data.achievements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaTrophy className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Achievements</h2>
            </div>
            <div className="grid gap-6">
              {data.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <FaAward className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{achievement.title}</h3>
                      <p className="text-green-600 mt-1">{achievement.year}</p>
                      <p className="text-gray-600 mt-2">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Social Links Section */}
        {data.socialLinks && Object.values(data.socialLinks).some(link => link) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaGlobe className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Connect With Me</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(data.socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIcons[platform];
                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                          {platform}
                        </h3>
                        <p className="text-sm text-gray-500">View my {platform} profile</p>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="p-2 rounded-full hover:bg-gray-50"
                      >
                        →
                      </motion.div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Areas of Expertise Section */}
        {data.expertise && data.expertise.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <RiRocketLine className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Areas of Expertise</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {data.expertise.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.area}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.split(',').map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Unique Selling Points Section */}
        {data.uniqueSellingPoints && data.uniqueSellingPoints.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <RiSparklingLine className="w-8 h-8 text-green-600" />
              <h2 className={`${exo2.className} text-3xl font-bold text-gray-800`}>Why Choose Me</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {data.uniqueSellingPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <RiSparklingLine className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{point.title}</h3>
                  </div>
                  <p className="text-gray-600">{point.description}</p>
            </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl"
        >
          <h3 className={`${exo2.className} text-2xl font-bold text-gray-800 mb-4`}>Get in Touch</h3>
          <p className="text-gray-600 mb-6">
            Feel free to reach out for collaborations or just a friendly hello
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="mailto:contact@example.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-full hover:bg-gray-50 transition-all"
            >
              <FaEnvelope className="text-green-600" /> Send Email
            </motion.a>
            <motion.button
              onClick={downloadResume}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
            >
              <FaDownload /> Download Resume
            </motion.button>
        </div>
        </motion.div>
      </div>
    </div>
  )
}