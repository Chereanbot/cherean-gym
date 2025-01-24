'use client'

import { useState } from 'react'
import { FaSpinner, FaMagic, FaDownload, FaArrowLeft, FaUpload } from 'react-icons/fa'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

function GeminiAIResume() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    skills: '',
    education: '',
    achievements: '',
    style: 'professional',
    additionalInfo: '',
    linkedinProfile: ''
  })
  const [generatedCV, setGeneratedCV] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/about/resume/generate-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          profileImage: uploadedImage
        })
      })
      const data = await response.json()
      if (data.success) {
        setGeneratedCV(data.data)
        setStep(2)
      }
    } catch (error) {
      console.error('Error generating CV:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/about/resume"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Options</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gemini AI Resume Generator</h1>
          <p className="text-slate-600 mt-1">Create a professional resume with Google's Gemini AI</p>
        </div>
      </div>

      {step === 1 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-6">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Profile Image
                <span className="text-xs text-slate-500 ml-2">(Optional)</span>
              </label>
              <div className="flex items-center gap-4">
                {uploadedImage && (
                  <img 
                    src={uploadedImage} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <label className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                  <FaUpload className="w-4 h-4 mr-2" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Desired Role/Position
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                LinkedIn Profile URL
                <span className="text-xs text-slate-500 ml-2">(Optional)</span>
              </label>
              <input
                type="url"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleInputChange}
                placeholder="e.g., https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 5 years"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Key Skills
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="List your key skills, separated by commas"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Education Background
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Describe your educational background"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Key Achievements
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                placeholder="List your major achievements and accomplishments"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Information
                <span className="text-xs text-slate-500 ml-2">(Optional)</span>
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like to include"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resume Style
              </label>
              <select
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
                <option value="executive">Executive</option>
                <option value="modern">Modern</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FaMagic className="w-5 h-5" />
                  Generate Resume
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {/* Preview and Download Section */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800">Generated Resume</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Edit Details
              </button>
              <button
                onClick={() => {/* Handle download */}}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaDownload className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="prose max-w-none">
            {/* Render the generated CV content here */}
            {generatedCV && (
              <div dangerouslySetInnerHTML={{ __html: generatedCV }} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function GeminiAIResumePage() {
  return (
    <AdminLayout>
      <GeminiAIResume />
    </AdminLayout>
  )
} 