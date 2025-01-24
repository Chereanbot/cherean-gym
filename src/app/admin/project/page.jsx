'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AdminProjectView = dynamic(() => import('@/components/admin-view/project'), {
  ssr: false
})

const initialFormData = {
  name: '',
  description: '',
  shortDescription: '',
  technologies: '',
  category: 'Web App',
  status: 'In Progress',
  website: '',
  github: '',
  features: [],
  screenshots: [],
  challengesFaced: [],
  solutions: [],
  testimonials: []
}

export default function AdminProject() {
  const [formData, setFormData] = useState(initialFormData)
  const [projectData, setProjectData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectData()
  }, [])

  const fetchProjectData = async () => {
    try {
      const response = await fetch('/api/project/get')
      const data = await response.json()

      if (data.success) {
        setProjectData(data.data)
      }
    } catch (error) {
      console.error('Error fetching project data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveData = async () => {
    try {
      const response = await fetch('/api/project/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Project added successfully!')
        setFormData(initialFormData)
        fetchProjectData() // Refresh the list
      } else {
        alert(data.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project. Please try again.')
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <AdminProjectView 
          formData={formData}
          setFormData={setFormData}
          handleSaveData={handleSaveData}
          data={projectData}
        />
      </div>
    </AdminLayout>
  )
} 