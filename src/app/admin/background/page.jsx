'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaPlay, FaPause, FaMagic } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { addData, getData, handleDelete } from '@/services'

export default function BackgroundManager() {
  const [backgrounds, setBackgrounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'canvas3d',
    instructions: '',
    config: {},
    isActive: false
  })

  useEffect(() => {
    fetchBackgrounds()
  }, [])

  const fetchBackgrounds = async () => {
    try {
      const response = await getData('background')
      if (response.success) {
        setBackgrounds(response.data)
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error)
      toast.error('Failed to fetch backgrounds')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateConfig = async () => {
    if (!formData.type || !formData.instructions) {
      toast.error('Please provide type and instructions')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/background/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          instructions: formData.instructions
        })
      })

      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          config: data.data.config
        }))
        toast.success('Background configuration generated!')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error generating config:', error)
      toast.error('Failed to generate configuration')
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.config || Object.keys(formData.config).length === 0) {
      toast.error('Please generate configuration first')
      return
    }

    try {
      const response = await addData('background', formData)
      if (response.success) {
        toast.success('Background saved successfully')
        fetchBackgrounds()
        setShowForm(false)
        setFormData({
          title: '',
          type: 'canvas3d',
          instructions: '',
          config: {},
          isActive: false
        })
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Error saving background:', error)
      toast.error('Failed to save background')
    }
  }

  const toggleActive = async (id, currentState) => {
    try {
      const response = await fetch(`/api/background/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState })
      })

      const data = await response.json()
      if (data.success) {
        fetchBackgrounds()
        toast.success(`Background ${!currentState ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      console.error('Error toggling background:', error)
      toast.error('Failed to update background')
    }
  }

  const handleDeleteBackground = async (id) => {
    if (!confirm('Are you sure you want to delete this background?')) return

    try {
      const response = await handleDelete('background', id)
      if (response.success) {
        toast.success('Background deleted successfully')
        fetchBackgrounds()
      }
    } catch (error) {
      console.error('Error deleting background:', error)
      toast.error('Failed to delete background')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Website Backgrounds</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaPlus />
            Add New Background
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Background</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="canvas3d">3D Canvas</option>
                    <option value="coding">Coding Rain</option>
                    <option value="particles">Particles</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  required
                  placeholder="Describe how you want the background to look..."
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleGenerateConfig}
                  disabled={generating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <FaMagic />
                  {generating ? 'Generating...' : 'Generate with AI'}
                </button>
                {Object.keys(formData.config).length > 0 && (
                  <span className="text-green-500">✓ Configuration generated</span>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      title: '',
                      type: 'canvas3d',
                      instructions: '',
                      config: {},
                      isActive: false
                    })
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save Background
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Backgrounds List */}
        <div className="grid grid-cols-1 gap-6">
          {backgrounds.map((background, index) => (
            <motion.div
              key={background._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{background.title}</h3>
                    <p className="text-gray-600 mt-2">{background.instructions}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {background.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        background.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {background.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(background._id, background.isActive)}
                      className={`p-2 ${
                        background.isActive ? 'text-green-500 hover:text-green-600' : 'text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      {background.isActive ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      onClick={() => handleDeleteBackground(background._id)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
} 