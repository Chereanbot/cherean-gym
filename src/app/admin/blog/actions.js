import { createBlogNotification } from '@/utils/notificationHelpers'

export const createBlogPost = async (blogData) => {
  try {
    // Your existing blog post creation logic here
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Create notification after successful blog post creation
      await createBlogNotification('create', blogData.title)
    }
    
    return data
  } catch (error) {
    console.error('Error creating blog post:', error)
    return { success: false, error: 'Failed to create blog post' }
  }
}

export const updateBlogPost = async (id, blogData) => {
  try {
    // Your existing blog post update logic here
    const response = await fetch(`/api/blog/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Create notification after successful blog post update
      await createBlogNotification('update', blogData.title)
    }
    
    return data
  } catch (error) {
    console.error('Error updating blog post:', error)
    return { success: false, error: 'Failed to update blog post' }
  }
}

export const deleteBlogPost = async (id, title) => {
  try {
    // Your existing blog post deletion logic here
    const response = await fetch(`/api/blog/${id}`, {
      method: 'DELETE',
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Create notification after successful blog post deletion
      await createBlogNotification('delete', title)
    }
    
    return data
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return { success: false, error: 'Failed to delete blog post' }
  }
}

export const publishBlogPost = async (id, title) => {
  try {
    // Your existing blog post publish logic here
    const response = await fetch(`/api/blog/${id}/publish`, {
      method: 'PUT',
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Create notification after successful blog post publish
      await createBlogNotification('publish', title)
    }
    
    return data
  } catch (error) {
    console.error('Error publishing blog post:', error)
    return { success: false, error: 'Failed to publish blog post' }
  }
} 