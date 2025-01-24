'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/layout'
import { FiEye, FiTrash2, FiEdit, FiPower, FiLayers } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const backgroundTypes = [
  {
    id: 'canvas3d',
    label: '3D Canvas',
    description: 'Interactive 3D scene with customizable objects and lighting',
    defaultConfig: {
      scene: {
        background: '#000000',
        fog: { color: '#000000', near: 1, far: 1000 }
      },
      camera: {
        fov: 75,
        position: [0, 0, 5]
      },
      lights: [
        { type: 'ambient', color: '#ffffff', intensity: 0.5 },
        { type: 'point', color: '#ffffff', intensity: 1, position: [0, 0, 2] }
      ],
      objects: [
        {
          type: 'cube',
          material: { type: 'standard', color: '#00ff00', metalness: 0.5, roughness: 0.5 },
          position: [0, 0, 0],
          scale: [1, 1, 1],
          animation: { rotate: true, speed: 0.01 }
        }
      ]
    }
  },
  {
    id: 'coding',
    label: 'Matrix Code Rain',
    description: 'Classic Matrix-style falling code animation',
    defaultConfig: {
      characters: {
        set: '01',
        size: 14,
        font: 'monospace',
        color: '#0F0'
      },
      rain: {
        opacity: 0.05,
        density: 0.975,
        speed: 1
      }
    }
  },
  {
    id: 'particles',
    label: 'Particles Network',
    description: 'Interactive particle system with connecting lines',
    defaultConfig: {
      particles: {
        number: 100,
        size: 3,
        color: '#ffffff'
      },
      movement: {
        speed: 1
      },
      background: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      interactivity: {
        links: {
          enable: true,
          distance: 100,
          color: '#ffffff',
          width: 1
        }
      }
    }
  }
]

export default function BackgroundManager() {
  const [backgrounds, setBackgrounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    type: 'coding',
    instructions: '',
    isActive: false
  })
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [generatingConfig, setGeneratingConfig] = useState(false)

  useEffect(() => {
    fetchBackgrounds()
  }, [])

  async function fetchBackgrounds() {
    try {
      const response = await fetch('/api/background')
      const data = await response.json()
      if (data.success) {
        setBackgrounds(data.data)
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error)
      toast.error('Failed to fetch backgrounds')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateConfig() {
    if (!formData.type || !formData.instructions) {
      toast.error('Please select a type and provide instructions')
      return
    }

    setGeneratingConfig(true)
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
        setFormData(prev => ({ ...prev, config: data.config }))
        toast.success('Configuration generated successfully')
      } else {
        toast.error(data.message || 'Failed to generate configuration')
      }
    } catch (error) {
      console.error('Error generating config:', error)
      toast.error('Failed to generate configuration')
    } finally {
      setGeneratingConfig(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.title || !formData.type || !formData.instructions) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const url = editingId 
        ? `/api/background/${editingId}`
        : '/api/background'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success) {
        toast.success(editingId ? 'Background updated successfully' : 'Background saved successfully')
        setShowForm(false)
        setEditingId(null)
        setFormData({
          title: '',
          type: 'coding',
          instructions: '',
          isActive: false
        })
        fetchBackgrounds()
      } else {
        toast.error(data.message || 'Failed to save background')
      }
    } catch (error) {
      console.error('Error saving background:', error)
      toast.error('Failed to save background')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this background?')) return

    try {
      const response = await fetch(`/api/background/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Background deleted successfully')
        fetchBackgrounds()
      } else {
        toast.error(data.message || 'Failed to delete background')
      }
    } catch (error) {
      console.error('Error deleting background:', error)
      toast.error('Failed to delete background')
    }
  }

  function handleEdit(background) {
    setFormData({
      title: background.title,
      type: background.type,
      instructions: background.instructions,
      isActive: background.isActive,
      config: background.config
    })
    setEditingId(background._id)
    setShowForm(true)
  }

  async function handleToggleActive(background) {
    try {
      const response = await fetch(`/api/background/${background._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !background.isActive })
      })
      const data = await response.json()

      if (data.success) {
        toast.success(`Background ${!background.isActive ? 'activated' : 'deactivated'} successfully`)
        fetchBackgrounds()
      } else {
        toast.error(data.message || 'Failed to toggle background status')
      }
    } catch (error) {
      console.error('Error toggling background:', error)
      toast.error('Failed to toggle background status')
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Background Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your website's dynamic backgrounds
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({
                title: '',
                type: 'coding',
                instructions: '',
                isActive: false
              })
              setEditingId(null)
              setShowForm(true)
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Background
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Background' : 'Add New Background'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    title: '',
                    type: 'coding',
                    instructions: '',
                    isActive: false
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter background title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={e => {
                    const selectedType = backgroundTypes.find(t => t.id === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      type: e.target.value,
                      config: selectedType?.defaultConfig
                    }))
                  }}
                  className="w-full p-2 border rounded"
                  disabled={editingId}
                >
                  {backgroundTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {backgroundTypes.find(t => t.id === formData.type)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={e => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows="4"
                  placeholder="Describe how you want the background to look..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Set as active background</label>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleGenerateConfig}
                  disabled={generatingConfig}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generatingConfig ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      {editingId ? 'Regenerate Config' : 'Generate Config'}
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  {editingId ? 'Update Background' : 'Save Background'}
                </button>
              </div>
            </div>

            {formData.config && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Generated Configuration</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(formData.config, null, 2)}
                </pre>
              </div>
            )}
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backgrounds.map(bg => (
            <div key={bg._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{bg.title}</h3>
                  <p className="text-sm text-gray-500">{backgroundTypes.find(t => t.id === bg.type)?.label}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(bg)}
                    className={`p-2 rounded-full ${
                      bg.isActive 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={bg.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <FiPower size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(bg)}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(bg._id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Instructions</h4>
                <p className="text-sm text-gray-600">{bg.instructions}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full ${
                  bg.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {bg.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  Created: {new Date(bg.createdAt).toLocaleDateString()}
                </span>
              </div>

              {bg.config && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(bg.config, null, 2))
                      toast.success('Configuration copied to clipboard')
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FiEye size={14} />
                    View Configuration
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {backgrounds.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiLayers size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No backgrounds yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new background
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
            >
              Add Your First Background
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 