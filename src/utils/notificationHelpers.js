// Function to create a notification
export const createNotification = async ({ message, category, type = 'info', link = null }) => {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        category,
        type,
        link,
        read: false,
        date: new Date()
      }),
    })
    
    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Error creating notification:', error)
    return false
  }
}

// Example notification creators for different actions
export const createBlogNotification = async (action, title) => {
  const messages = {
    create: `New blog post "${title}" has been created`,
    update: `Blog post "${title}" has been updated`,
    delete: `Blog post "${title}" has been deleted`,
    publish: `Blog post "${title}" has been published`,
  }
  
  return createNotification({
    message: messages[action],
    category: 'blog',
    type: action === 'delete' ? 'warning' : 'success',
    link: action !== 'delete' ? `/admin/blog` : null
  })
}

export const createProjectNotification = async (action, title) => {
  const messages = {
    create: `New project "${title}" has been created`,
    update: `Project "${title}" has been updated`,
    delete: `Project "${title}" has been deleted`,
    launch: `Project "${title}" has been launched`,
  }
  
  return createNotification({
    message: messages[action],
    category: 'project',
    type: action === 'delete' ? 'warning' : 'success',
    link: action !== 'delete' ? `/admin/project` : null
  })
}

export const createServiceNotification = async (action, title) => {
  const messages = {
    create: `New service "${title}" has been created`,
    update: `Service "${title}" has been updated`,
    delete: `Service "${title}" has been deleted`,
  }
  
  return createNotification({
    message: messages[action],
    category: 'service',
    type: action === 'delete' ? 'warning' : 'success',
    link: action !== 'delete' ? `/admin/services` : null
  })
}

export const createSystemNotification = async (message, type = 'info', link = '/admin/settings') => {
  return createNotification({
    message,
    category: 'system',
    type,
    link
  })
}

export const createContactNotification = async (name, email, subject) => {
  return createNotification({
    message: `New contact message from ${name} (${email}): "${subject}"`,
    category: 'contact',
    type: 'info',
    link: '/admin/messages'  // Link to your admin messages page
  })
} 