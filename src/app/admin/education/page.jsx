'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AdminEducationView = dynamic(() => import('@/components/admin-view/education'), {
  ssr: false
})

const initialFormData = {
  degree: '',
  year: '',
  college: ''
}

export default function AdminEducation() {
  const [formData, setFormData] = useState(initialFormData)
  const [educationData, setEducationData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEducationData()
  }, [])

  const fetchEducationData = async () => {
    try {
      const response = await fetch('/api/education/get')
      const data = await response.json()

      if (data.success) {
        setEducationData(data.data)
      }
    } catch (error) {
      console.error('Error fetching education data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveData = async () => {
    try {
      const response = await fetch('/api/education/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Education added successfully!')
        setFormData(initialFormData)
        fetchEducationData() // Refresh the list
      } else {
        alert(data.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      console.error('Error saving education:', error)
      alert('Error saving education. Please try again.')
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <AdminEducationView 
          formData={formData}
          setFormData={setFormData}
          handleSaveData={handleSaveData}
          data={educationData}
        />
      </div>
    </AdminLayout>
  )
} 