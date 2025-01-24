'use client'

import { useState, useEffect } from 'react'
import { Input, TextArea, Select, FileInput } from "../form-controls/index.jsx"
import { FaTrash, FaEdit, FaMagic } from 'react-icons/fa'
import { Dialog } from '@headlessui/react'
import { serviceTypes } from '@/utils/serviceTypes'
import { analyzeServiceType, enhanceServiceDescription, suggestServiceTechnologies } from '@/utils/serviceGemini'

const controls = [
  {
    name: 'serviceType',
    type: 'select',
    label: 'Service Type*',
    required: true,
    options: serviceTypes.map(type => type.title)
  },
  {
    name: 'title',
    placeholder: 'Service title',
    type: 'text',
    label: 'Title*',
    required: true
  },
  {
    name: 'description',
    placeholder: 'Service description',
    type: 'textarea',
    label: 'Description*',
    required: true
  },
  {
    name: 'icon',
    placeholder: 'Icon name (e.g., FaCode)',
    type: 'text',
    label: 'Icon*',
    required: true
  },
  {
    name: 'technologies',
    placeholder: 'Technologies (comma-separated)',
    type: 'text',
    label: 'Technologies*',
    required: true
  },
  {
    name: 'status',
    type: 'select',
    label: 'Status*',
    required: true,
    options: ['Active', 'Inactive']
  },
  {
    name: 'order',
    placeholder: 'Display order (0-99)',
    type: 'number',
    label: 'Order',
  }
]

export default function AdminServicesView({ formData, setFormData, handleSaveData, data }) {
  const [activeTab, setActiveTab] = useState('form')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleServiceTypeChange = async (type) => {
    try {
      setIsAnalyzing(true)
      
      // First try to find in predefined types
      const predefinedService = serviceTypes.find(s => s.title === type)
      
      if (predefinedService) {
        setFormData({
          ...formData,
          serviceType: type,
          title: predefinedService.title,
          description: predefinedService.description,
          icon: predefinedService.icon,
          technologies: predefinedService.technologies,
          status: 'Active'
        })
      } else {
        // If not found in predefined types, use Gemini to analyze
        const analysis = await analyzeServiceType(type)
        setFormData({
          ...formData,
          serviceType: type,
          title: analysis.title,
          description: analysis.description,
          icon: analysis.icon,
          technologies: analysis.technologies,
          status: analysis.status
        })
      }
    } catch (error) {
      console.error('Error analyzing service type:', error)
      alert('Error analyzing service type. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleEnhanceDescription = async () => {
    if (!formData.description) return
    
    try {
      setIsAnalyzing(true)
      const enhancedDescription = await enhanceServiceDescription(formData.description)
      setFormData({
        ...formData,
        description: enhancedDescription
      })
    } catch (error) {
      console.error('Error enhancing description:', error)
      alert('Error enhancing description. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSuggestTechnologies = async () => {
    try {
      setIsAnalyzing(true)
      const suggestedTech = await suggestServiceTechnologies(
        formData.serviceType || formData.title,
        formData.technologies
      )
      setFormData({
        ...formData,
        technologies: suggestedTech
      })
    } catch (error) {
      console.error('Error suggesting technologies:', error)
      alert('Error suggesting technologies. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/services/delete?id=${itemToDelete._id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        setIsDeleteModalOpen(false)
        setItemToDelete(null)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service. Please try again.')
    }
  }

  const handleEditClick = async (item) => {
    setFormData(item)
    setIsEditing(true)
    setEditingId(item._id)
    setActiveTab('form')
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/services/update?id=${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Service updated successfully!')
        setIsEditing(false)
        setEditingId(null)
        setFormData({})
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating service:', error)
      alert('Error updating service. Please try again.')
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold ${
              activeTab === 'form' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('form')}
          >
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold ${
              activeTab === 'list' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('list')}
          >
            View Services
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'form' ? (
            <div className="space-y-6">
              {/* Service Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.serviceType || ''}
                  onChange={(e) => handleServiceTypeChange(e.target.value)}
                  disabled={isAnalyzing}
                >
                  <option value="">Select a service type...</option>
                  {serviceTypes.map((type, index) => (
                    <option key={index} value={type.title}>
                      {type.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {controls.filter(c => c.name !== 'serviceType').map((control, index) => {
                  let Component;
                  switch (control.type) {
                    case 'text':
                    case 'number':
                      Component = Input;
                      break;
                    case 'textarea':
                      Component = TextArea;
                      break;
                    case 'select':
                      Component = Select;
                      break;
                    case 'file':
                      Component = FileInput;
                      break;
                    default:
                      console.warn(`Unknown control type: ${control.type}`);
                      return null;
                  }

                  if (!Component) return null;

                  return (
                    <Component
                      key={index}
                      {...control}
                      value={formData[control.name] || ''}
                      onChange={(value) => setFormData({ ...formData, [control.name]: value })}
                    />
                  );
                })}
              </div>

              {/* AI Enhancement Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleEnhanceDescription}
                  disabled={!formData.description || isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
                >
                  <FaMagic /> Enhance Description
                </button>
                <button
                  onClick={handleSuggestTechnologies}
                  disabled={!formData.serviceType && !formData.title || isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                >
                  <FaMagic /> Suggest Technologies
                </button>
              </div>

              {isAnalyzing && (
                <div className="text-center text-sm text-gray-500">
                  Analyzing... Please wait...
                </div>
              )}

              <div className="mt-6 flex justify-end">
                {isEditing ? (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setIsEditing(false)
                        setEditingId(null)
                        setFormData({})
                      }}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdate}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Update Service
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleSaveData}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Add Service
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-500 transition duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-600">Technologies:</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.technologies.split(',').map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No services added yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md mx-auto p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Confirm Delete
            </Dialog.Title>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 