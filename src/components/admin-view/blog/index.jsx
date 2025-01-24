'use client'

import { useState, useRef } from 'react'
import { Input, TextArea, Select, FileInput } from "../form-controls/index.jsx"
import { FaTrash, FaEdit, FaCloudUploadAlt, FaSpinner, FaMagic } from 'react-icons/fa'
import { Dialog } from '@headlessui/react'
import { uploadImage } from '@/utils/cloudinary'
import { analyzeBlogImage } from '@/services'
import Image from 'next/image'

const controls = [
  {
    name: 'title',
    placeholder: 'Blog post title',
    type: 'text',
    label: 'Title*',
    required: true
  },
  {
    name: 'slug',
    placeholder: 'URL-friendly slug (auto-generated if empty)',
    type: 'text',
    label: 'Slug'
  },
  {
    name: 'excerpt',
    placeholder: 'Brief summary of the post',
    type: 'textarea',
    label: 'Excerpt*',
    required: true
  },
  {
    name: 'content',
    placeholder: 'Full blog post content',
    type: 'textarea',
    label: 'Content*',
    required: true
  },
  {
    name: 'category',
    placeholder: 'Post category',
    type: 'text',
    label: 'Category*',
    required: true
  },
  {
    name: 'tags',
    placeholder: 'Tags (comma-separated)',
    type: 'text',
    label: 'Tags'
  },
  {
    name: 'author',
    placeholder: 'Author name',
    type: 'text',
    label: 'Author*',
    required: true
  },
  {
    name: 'readTime',
    placeholder: 'Estimated read time in minutes',
    type: 'number',
    label: 'Read Time*',
    required: true
  },
  {
    name: 'status',
    type: 'select',
    label: 'Status*',
    required: true,
    options: ['Draft', 'Published']
  }
]

export default function AdminBlogView({ formData, setFormData, handleSaveData, data }) {
  const [activeTab, setActiveTab] = useState('form')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  const handleCoverImageUpload = async (file) => {
    if (!file) return

    try {
      setUploading(true)
      const result = await uploadImage(file)
      
      if (result.success) {
        setFormData({ ...formData, coverImage: result.url })
        
        // Automatically start AI analysis
        setAnalyzing(true)
        const analysis = await analyzeBlogImage(result.url)
        
        if (analysis.success) {
          // Update form with AI-generated content
          setFormData(prev => ({
            ...prev,
            ...analysis.data // This now includes all required fields including slug and default values
          }))

          // Optional: Automatically save as draft after AI generation
          if (window.confirm('AI has generated the content. Would you like to save it as a draft?')) {
            await handleSaveData()
          }
        } else {
          alert('Failed to analyze image: ' + analysis.message)
        }
      } else {
        alert('Failed to upload image: ' + result.error)
      }
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }

  // Add a new function for re-analyzing existing images
  const handleReanalyze = async () => {
    if (!formData.coverImage) return

    try {
      setAnalyzing(true)
      const analysis = await analyzeBlogImage(formData.coverImage)
      
      if (analysis.success) {
        // Keep existing coverImage and any other fields you want to preserve
        setFormData(prev => ({
          ...prev,
          ...analysis.data,
          coverImage: prev.coverImage // Preserve the existing image
        }))

        // Optional: Automatically save as draft after AI generation
        if (window.confirm('AI has generated new content. Would you like to save it as a draft?')) {
          await handleSaveData()
        }
      } else {
        alert('Failed to analyze image: ' + analysis.message)
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
      alert('Error analyzing image. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/blog/delete?id=${itemToDelete._id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        setIsDeleteModalOpen(false)
        setItemToDelete(null)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Error deleting blog post. Please try again.')
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
      const response = await fetch(`/api/blog/update?id=${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Blog post updated successfully!')
        setIsEditing(false)
        setEditingId(null)
        setFormData({})
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating blog post:', error)
      alert('Error updating blog post. Please try again.')
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
            {isEditing ? 'Edit Blog Post' : 'Add New Post'}
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold ${
              activeTab === 'list' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('list')}
          >
            View Posts
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'form' ? (
            <div className="space-y-6">
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {formData.coverImage ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={formData.coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, coverImage: '' })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FaTrash size={12} />
                        </button>
                        {!analyzing && (
                          <button
                            onClick={handleReanalyze}
                            className="absolute top-2 left-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                            title="Analyze with AI"
                          >
                            <FaMagic size={12} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={(e) => handleCoverImageUpload(e.target.files[0])}
                          accept="image/*"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading || analyzing}
                          className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-green-500 transition-colors"
                        >
                          {uploading || analyzing ? (
                            <>
                              <FaSpinner className="animate-spin h-8 w-8 text-green-500" />
                              <p className="mt-2 text-sm text-gray-500">
                                {uploading ? 'Uploading...' : 'Analyzing with AI...'}
                              </p>
                            </>
                          ) : (
                            <>
                              <FaCloudUploadAlt className="h-8 w-8 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500">Click to upload cover image</p>
                              <p className="text-xs text-gray-400">AI will help generate content</p>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                {controls.map((control, index) => {
                  let Component;
                  switch (control.type) {
                    case 'text':
                    case 'number':
                    case 'url':
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
                      Update Post
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleSaveData}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Publish Post
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-500 transition duration-300">
                    <div className="flex gap-6">
                      {item.coverImage && (
                        <div className="relative w-48 h-32 flex-shrink-0">
                          <Image
                            src={item.coverImage}
                            alt={item.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
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
                        <p className="text-gray-600 mt-2">{item.excerpt}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <span>{item.author}</span>
                          <span>•</span>
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{item.readTime} min read</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No blog posts added yet.</p>
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
                Are you sure you want to delete this blog post? This action cannot be undone.
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