'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

export default function CTAManagement() {
  const [ctas, setCTAs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCTA, setEditingCTA] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    primaryButton: {
      text: '',
      url: ''
    },
    secondaryButton: {
      text: '',
      url: ''
    },
    backgroundImage: '',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    position: 'bottom',
    isActive: true
  })

  useEffect(() => {
    fetchCTAs()
  }, [])

  const fetchCTAs = async () => {
    try {
      const response = await fetch('/api/home/cta')
      const data = await response.json()
      if (data.success) {
        setCTAs(Array.isArray(data.data) ? data.data : [data.data].filter(Boolean))
      }
    } catch (error) {
      console.error('Error fetching CTAs:', error)
      toast.error('Failed to fetch CTAs')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingCTA 
        ? `/api/home/cta/${editingCTA._id}`
        : '/api/home/cta'
      
      const method = editingCTA ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        toast.success(editingCTA ? 'CTA updated successfully' : 'CTA added successfully')
        fetchCTAs()
        resetForm()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error saving CTA:', error)
      toast.error('Failed to save CTA')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this CTA?')) return

    try {
      const response = await fetch(`/api/home/cta/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        toast.success('CTA deleted successfully')
        fetchCTAs()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error deleting CTA:', error)
      toast.error('Failed to delete CTA')
    }
  }

  const handleEdit = (cta) => {
    setEditingCTA(cta)
    setFormData({
      title: cta.title,
      subtitle: cta.subtitle || '',
      description: cta.description,
      primaryButton: {
        text: cta.primaryButton.text,
        url: cta.primaryButton.url
      },
      secondaryButton: {
        text: cta.secondaryButton?.text || '',
        url: cta.secondaryButton?.url || ''
      },
      backgroundImage: cta.backgroundImage || '',
      backgroundColor: cta.backgroundColor,
      textColor: cta.textColor,
      position: cta.position,
      isActive: cta.isActive
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setEditingCTA(null)
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      primaryButton: {
        text: '',
        url: ''
      },
      secondaryButton: {
        text: '',
        url: ''
      },
      backgroundImage: '',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      position: 'bottom',
      isActive: true
    })
    setShowForm(false)
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
          <h1 className="text-2xl font-bold text-gray-800">Call to Action Sections</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaPlus />
            Add New CTA
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingCTA ? 'Edit CTA' : 'Add New CTA'}
            </h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={formData.primaryButton.text}
                    onChange={(e) => setFormData({
                      ...formData,
                      primaryButton: { ...formData.primaryButton, text: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button URL</label>
                  <input
                    type="url"
                    value={formData.primaryButton.url}
                    onChange={(e) => setFormData({
                      ...formData,
                      primaryButton: { ...formData.primaryButton, url: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={formData.secondaryButton.text}
                    onChange={(e) => setFormData({
                      ...formData,
                      secondaryButton: { ...formData.secondaryButton, text: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button URL</label>
                  <input
                    type="url"
                    value={formData.secondaryButton.url}
                    onChange={(e) => setFormData({
                      ...formData,
                      secondaryButton: { ...formData.secondaryButton, url: e.target.value }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
                  <input
                    type="url"
                    value={formData.backgroundImage}
                    onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-green-500 focus:ring-green-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {editingCTA ? 'Update CTA' : 'Add CTA'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* CTAs List */}
        <div className="grid grid-cols-1 gap-6">
          {ctas.map((cta, index) => (
            <motion.div
              key={cta._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                {cta.backgroundImage && (
                  <div className="absolute inset-0">
                    <Image
                      src={cta.backgroundImage}
                      alt="Background"
                      fill
                      className="object-cover opacity-50"
                    />
                  </div>
                )}
                <div
                  className="relative p-6"
                  style={{
                    backgroundColor: cta.backgroundImage ? 'rgba(0,0,0,0.6)' : cta.backgroundColor,
                    color: cta.textColor
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{cta.title}</h3>
                      {cta.subtitle && (
                        <p className="mt-1 opacity-90">{cta.subtitle}</p>
                      )}
                      <p className="mt-2">{cta.description}</p>
                      <div className="flex gap-4 mt-4">
                        <a
                          href={cta.primaryButton.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          {cta.primaryButton.text}
                        </a>
                        {cta.secondaryButton?.text && (
                          <a
                            href={cta.secondaryButton.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {cta.secondaryButton.text}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cta)}
                        className="p-2 text-white hover:text-green-200"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cta._id)}
                        className="p-2 text-white hover:text-red-200"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        cta.isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {cta.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm opacity-75">Position: {cta.position}</span>
                    </div>
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