'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AnimationWrapper from "../animation-wrapper"
import { FaCode, FaDesktop, FaMobile, FaServer, FaDatabase, FaCloud } from 'react-icons/fa'

const iconMap = {
  FaCode,
  FaDesktop,
  FaMobile,
  FaServer,
  FaDatabase,
  FaCloud
}

export default function ClientServicesView() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services/client')
      const data = await response.json()

      if (data.success) {
        setServices(data.data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent className="w-8 h-8" /> : <FaCode className="w-8 h-8" />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mt-24 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto">
      <AnimationWrapper className="grid grid-flow-row gap-8">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-black-600 leading-normal">
            My Services
          </h1>
          <p className="text-gray-500 mt-4 mb-8 text-center">
            Comprehensive solutions for your digital needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4 bg-green-50 rounded-full text-green-500 mb-4">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-center mb-6">{service.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {service.technologies?.split(',').map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No services available.
            </div>
          )}
        </div>
      </AnimationWrapper>
    </div>
  )
} 