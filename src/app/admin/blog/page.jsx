'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const AdminBlogView = dynamic(() => import('@/components/admin-view/blog'), {
  ssr: false
})

const initialFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  tags: [],
  status: 'Draft',
  author: '',
  readTime: 0
}

export default function AdminBlog() {
  const [formData, setFormData] = useState(initialFormData)
  const [blogData, setBlogData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogData()
  }, [])

  const fetchBlogData = async () => {
    try {
      const response = await fetch('/api/blog/get')
      const data = await response.json()

      if (data.success) {
        setBlogData(data.data)
      }
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveData = async () => {
    try {
      const response = await fetch('/api/blog/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Blog post added successfully!')
        setFormData(initialFormData)
        fetchBlogData()
      } else {
        alert(data.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Error saving blog post. Please try again.')
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <AdminBlogView 
          formData={formData}
          setFormData={setFormData}
          handleSaveData={handleSaveData}
          data={blogData}
        />
      </div>
    </AdminLayout>
  )
} 