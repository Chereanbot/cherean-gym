'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBell, FaCheck, FaTimes, FaProjectDiagram, FaBlog, FaUser, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'project',
      title: 'New Project Comment',
      message: 'John Doe commented on your Portfolio Website project',
      time: '2 minutes ago',
      read: false,
      icon: FaProjectDiagram,
      priority: 'high'
    },
    {
      id: 2,
      type: 'blog',
      title: 'Blog Post Published',
      message: 'Your blog post "Getting Started with Next.js" is now live',
      time: '1 hour ago',
      read: false,
      icon: FaBlog,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'The system will undergo maintenance in 2 hours',
      time: '3 hours ago',
      read: true,
      icon: FaExclamationTriangle,
      priority: 'low'
    }
  ])

  const [filter, setFilter] = useState('all')

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.read
    return notif.type === filter
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <FaBell className="text-green-500 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-gray-500">Stay updated with your latest activities</p>
            </div>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <FaCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'unread', 'project', 'blog', 'system'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === filterType
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                  !notification.read ? 'border-l-4 border-green-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${getPriorityColor(notification.priority)}/10 flex items-center justify-center flex-shrink-0`}>
                        <notification.icon className={`w-5 h-5 ${getPriorityColor(notification.priority)} text-opacity-80`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <span className="text-sm text-gray-400 mt-2 block">{notification.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition-colors"
                          title="Mark as read"
                        >
                          <FaCheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        title="Delete notification"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FaBell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 