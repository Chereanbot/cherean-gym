'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AdminAboutView = dynamic(() => import('@/components/admin-view/about'), {
  ssr: false
})

const initialFormData = {
  aboutme: '',
  noofprojects: '',
  yearofexperience: '',
  noofclients: '',
  skills: '',
  education: [],
  certifications: [],
  languages: [],
  achievements: [],
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    portfolio: ''
  },
  deviceImages: {
    iPhone: '',
    macBook: ''
  }
}

export default function AdminAbout() {
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about/get')
        const data = await response.json()

        if (data.success && data.data) {
          setFormData(prev => ({
            ...initialFormData,
            ...data.data
          }))
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  const handleSaveData = async () => {
    try {
      const response = await fetch('/api/about/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Data saved successfully!')
        // Update form data with the saved data
        if (data.data) {
          setFormData(data.data)
        }
      } else {
        alert(data.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving data. Please try again.')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <AdminAboutView 
          formData={formData}
          setFormData={setFormData}
          handleSaveData={handleSaveData}
        />
      </div>
    </AdminLayout>
  )
} 