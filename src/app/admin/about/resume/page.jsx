'use client'

import { useState } from 'react'
import { FaUpload, FaDownload, FaSpinner, FaMagic, FaRobot, FaUser, FaGlobe, FaFileAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import PDFPreview from '@/components/admin/resume/PDFPreview'

function CVGenerator() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [formData, setFormData] = useState({
    photo: null,
    websiteUrl: '',
    fullName: '',
    phone: '',
    email: '',
    websites: {
      portfolio: '',
      linkedin: '',
      github: ''
    },
    experience: [],
    education: []
  })
  const [photoPreview, setPhotoPreview] = useState(null)

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
        setFormData(prev => ({ ...prev, photo: file }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleWebsiteAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/about/resume/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: formData.websiteUrl })
      })
      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          fullName: data.data.fullName || prev.fullName,
          email: data.data.email || prev.email,
          phone: data.data.phone || prev.phone,
          websites: {
            ...prev.websites,
            ...data.data.websites
          }
        }))
        setStep(3)
      }
    } catch (error) {
      console.error('Error analyzing website:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      data.append('fullName', formData.fullName)
      data.append('email', formData.email)
      data.append('phone', formData.phone)
      data.append('websites', JSON.stringify(formData.websites))
      data.append('experience', JSON.stringify(formData.experience))
      data.append('education', JSON.stringify(formData.education))
      if (formData.photo) {
        data.append('photo', formData.photo)
      }

      console.log('Submitting CV data...') // Debug log

      const response = await fetch('/api/about/resume/generate-cv', {
        method: 'POST',
        body: data
      })

      const result = await response.json()
      console.log('CV Generation Result:', result) // Debug log

      if (result.success && result.pdfUrl) {
        const pdfUrl = result.pdfUrl
        console.log('Generated PDF URL:', pdfUrl) // Debug log

        // Store the PDF URL in localStorage
        localStorage.removeItem('generatedPdfUrl') // Clear any existing URL
        localStorage.setItem('generatedPdfUrl', pdfUrl)
        
        // Verify storage
        const storedUrl = localStorage.getItem('generatedPdfUrl')
        console.log('Verified stored URL:', storedUrl) // Debug log
        
        // Set local state
        setPdfUrl(pdfUrl)
        
        // Navigate to preview page
        window.location.href = '/admin/about/resume/preview'
      } else {
        console.error('Failed to generate CV:', result.error || 'Unknown error')
        setError(result.error || 'Failed to generate CV')
      }
    } catch (error) {
      console.error('Error generating CV:', error)
      setError('Failed to generate CV: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: '', company: '', startDate: '', endDate: '', description: '' }
      ]
    }))
  }

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', year: '', description: '' }
      ]
    }))
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Resume Management</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step Progress */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= item ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {item}
                </div>
                {item < 4 && (
                  <div className={`w-24 h-1 ${
                    step > item ? 'bg-indigo-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          {/* Websites */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Online Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Portfolio URL</label>
                <input
                  type="url"
                  name="websites.portfolio"
                  value={formData.websites.portfolio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="websites.linkedin"
                  value={formData.websites.linkedin}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">GitHub URL</label>
                <input
                  type="url"
                  name="websites.github"
                  value={formData.websites.github}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Experience</h2>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].title = e.target.value
                        setFormData(prev => ({ ...prev, experience: newExp }))
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].company = e.target.value
                        setFormData(prev => ({ ...prev, experience: newExp }))
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].startDate = e.target.value
                        setFormData(prev => ({ ...prev, experience: newExp }))
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].endDate = e.target.value
                        setFormData(prev => ({ ...prev, experience: newExp }))
                      }}
                      className="w-full p-2 border rounded"
                      placeholder="Present"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...formData.experience]
                        newExp[index].description = e.target.value
                        setFormData(prev => ({ ...prev, experience: newExp }))
                      }}
                      className="w-full p-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Education</h2>
              <button
                type="button"
                onClick={handleAddEducation}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Education
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].degree = e.target.value
                        setFormData(prev => ({ ...prev, education: newEdu }))
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].institution = e.target.value
                        setFormData(prev => ({ ...prev, education: newEdu }))
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].year = e.target.value
                        setFormData(prev => ({ ...prev, education: newEdu }))
                      }}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2">Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => {
                        const newEdu = [...formData.education]
                        newEdu[index].description = e.target.value
                        setFormData(prev => ({ ...prev, education: newEdu }))
                      }}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Generating CV...
                </span>
              ) : (
                'Generate CV'
              )}
            </button>
          </div>
        </form>

        {/* PDF Preview Modal */}
        {pdfUrl && (
          <PDFPreview
            pdfUrl={pdfUrl}
            onEdit={() => setPdfUrl(null)}
            onClose={() => setPdfUrl(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default CVGenerator 