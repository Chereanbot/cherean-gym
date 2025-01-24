'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingShapes from '@/components/shared/FloatingShapes'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (response.ok && data.success) {
            // Store admin data
            localStorage.setItem('user', JSON.stringify({
                username: formData.username,
                role: 'admin'
            }))
            localStorage.setItem('token', 'admin-token')

            // Show success state
            setLoading(false)
            
            // Small delay for animation
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Redirect to admin
            router.push('/admin')
        } else {
            setError(data.message || 'Invalid credentials')
            setLoading(false)
            // Clear password field on error
            setFormData(prev => ({ ...prev, password: '' }))
        }
    } catch (error) {
        console.error('Login error:', error)
        setError('Network error. Please check your connection and try again.')
        setLoading(false)
        // Clear password field on error
        setFormData(prev => ({ ...prev, password: '' }))
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <FloatingShapes />
      
      {/* Decorative grid pattern */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, #e5e7eb 2%, transparent 0%),
              radial-gradient(circle at 75px 75px, #e5e7eb 2%, transparent 0%)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Top decorative bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        {/* Logo container with enhanced animations */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1 
            }}
            className="relative w-32 h-32 bg-white rounded-full p-1 shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="https://res.cloudinary.com/di7rpky2s/image/upload/t_My Logo/v1734069527/cherinet%40logo.jpg"
              alt="Logo"
              fill
              className="rounded-full object-cover"
              priority
            />
            {/* Pulsing effect */}
            <motion.div
              className="absolute -inset-1 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0 0px rgba(34, 197, 94, 0.2)',
                  '0 0 0 4px rgba(34, 197, 94, 0.2)',
                  '0 0 0 0px rgba(34, 197, 94, 0.2)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            {/* Additional glow effect */}
            <motion.div
              className="absolute -inset-2 rounded-full bg-green-400 opacity-20 blur-lg"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </div>

        {/* Welcome text with typing effect */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
        >
          Welcome Back
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2 text-center text-sm text-gray-600"
        >
          Please sign in to access the admin dashboard
        </motion.p>
      </motion.div>

      {/* Login form container with glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username field with enhanced animations */}
            <div>
              <motion.label
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </motion.label>
              <div className="mt-1 relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your username"
                />
                <motion.div
                  initial={false}
                  animate={formData.username ? { scale: 1 } : { scale: 0 }}
                  className="absolute right-2 top-2.5 text-green-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Password field with enhanced animations */}
            <div>
              <motion.label
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </motion.label>
              <div className="mt-1 relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <motion.div
                  initial={false}
                  animate={formData.password ? { scale: 1 } : { scale: 0 }}
                  className="absolute right-2 top-2.5 text-green-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Error message with enhanced animations */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-md bg-red-50 p-4"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button with enhanced animations */}
            <div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`
                  w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                  shadow-sm text-sm font-medium text-white relative overflow-hidden
                  ${loading ? 'bg-green-400' : 'bg-green-main hover:bg-green-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                `}
              >
                {loading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full mr-2"
                    />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign in</span>
                )}
                {/* Button highlight effect */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 2, opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </div>
          </form>

          {/* Bottom section with enhanced animations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="px-2 bg-white text-gray-500"
                >
                  Secure Admin Area
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom decorative bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-600 via-green-500 to-green-400"
      />

      {/* Add this after the form container div */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/register"
            className="font-medium text-green-main hover:text-green-700 transition-colors duration-200"
          >
            Register here
          </motion.a>
        </p>
      </motion.div>
    </div>
  )
} 