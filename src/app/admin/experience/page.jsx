'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AdminExperienceView = dynamic(() => import('@/components/admin-view/experience'), {
  ssr: false
})

const initialFormData = {
  position: '',
  company: '',
  duration: '',
  location: '',
  jobprofile: ''
}

export default function AdminExperience() {
  const [formData, setFormData] = useState(initialFormData)
  const [experienceData, setExperienceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExperienceData()
  }, [])

  const fetchExperienceData = async () => {
    try {
      const response = await fetch('/api/experience/get')
      const data = await response.json()

      if (data.success) {
        setExperienceData(data.data)
      }
    } catch (error) {
      console.error('Error fetching experience data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveData = async () => {
    try {
      const response = await fetch('/api/experience/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Experience added successfully!')
        setFormData(initialFormData)
        fetchExperienceData() // Refresh the list
      } else {
        alert(data.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      console.error('Error saving experience:', error)
      alert('Error saving experience. Please try again.')
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <AdminExperienceView 
          formData={formData}
          setFormData={setFormData}
          handleSaveData={handleSaveData}
          data={experienceData}
        />
      </div>
    </AdminLayout>
  )
} 