'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AdminServicesView = dynamic(() => import('@/components/admin-view/services'), {
  ssr: false
})

const initialFormData = {
  title: '',
  description: '',
  icon: '',
  technologies: '',
  status: 'Active',
  order: 0
}

export default function AdminServices() {
  const [formData, setFormData] = useState(initialFormData)
  const [servicesData, setServicesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServicesData()
  }, [])

  const fetchServicesData = async () => {
    try {
      const response = await fetch('/api/services/get')
      const data = await response.json()

      if (data.success) {
        setServicesData(data.data)
      }
    } catch (error) {
      console.error('Error fetching services data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveData = async () => {
    try {
      const response = await fetch('/api/services/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Service added successfully!')
        setFormData(initialFormData)
        fetchServicesData()
      } else {
        alert(data.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service. Please try again.')
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <AdminServicesView 
          formData={formData}
          setFormData={setFormData}
          handleSaveData={handleSaveData}
          data={servicesData}
        />
      </div>
    </AdminLayout>
  )
} 