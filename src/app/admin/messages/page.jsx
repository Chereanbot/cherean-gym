'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaSpinner, FaExclamation, FaReply } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { createContactNotification } from '@/utils/notificationHelpers'
import { createSystemNotification } from '@/utils/notificationHelpers'

// Date formatting helper functions
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Date not available'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Date not available'
  }
}

const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Date not available'
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Date not available'
  }
}

const isToday = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

const isYesterday = (dateString) => {
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
}

const getRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Date not available'

    if (isToday(dateString)) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `Today at ${hours}:${minutes}`
    }

    if (isYesterday(dateString)) {
      return 'Yesterday'
    }

    return formatDate(dateString)
  } catch (error) {
    console.error('Error getting relative time:', error)
    return 'Date not available'
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    hasMore: false
  })
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get('filter') || 'all'

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: 10,
        ...(filter === 'unread' && { read: false })
      })
      
      const response = await fetch(`/api/contact/messages?${queryParams}`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.messages)
        setPagination(data.pagination)
        setError(null)
      } else {
        setError('Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  // Mark message as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      })
      
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, read: true } : msg
        ))
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  // Delete message
  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== id))
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  // Load messages on mount and when filter changes
  useEffect(() => {
    fetchMessages()
  }, [filter, pagination.page])

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600">Messages</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin/messages')}
            className={`px-6 py-2.5 rounded-lg transition-all duration-300 ${
              filter === 'all' 
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5' 
                : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 border border-slate-200'
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => router.push('/admin/messages?filter=unread')}
            className={`px-6 py-2.5 rounded-lg transition-all duration-300 ${
              filter === 'unread' 
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5' 
                : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 border border-slate-200'
            }`}
          >
            Unread Messages
          </button>
        </div>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-12">
          <FaSpinner className="w-8 h-8 text-indigo-500 animate-spin" />
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants} className="flex items-center justify-center py-12 text-rose-500 bg-rose-50/80 backdrop-blur-sm rounded-xl border border-rose-100">
          <FaExclamation className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="divide-y divide-slate-200/50">
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  variants={itemVariants}
                  onClick={() => {
                    setSelectedMessage(message)
                    if (!message.read) markAsRead(message._id)
                  }}
                  className={`p-5 cursor-pointer transition-all duration-300 ${
                    selectedMessage?._id === message._id
                      ? 'bg-indigo-50/80 backdrop-blur-sm'
                      : 'hover:bg-slate-50/80'
                  } ${!message.read ? 'bg-blue-50/50 hover:bg-blue-50/80' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {message.read ? (
                        <FaEnvelopeOpen className="w-5 h-5 text-slate-400" />
                      ) : (
                        <FaEnvelope className="w-5 h-5 text-indigo-500" />
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {message.name}
                        </h3>
                        <p className="text-sm text-slate-500">{message.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100/80 px-2 py-1 rounded-full">
                      {getRelativeTime(message.date)}
                    </span>
                  </div>
                  <h4 className="mt-3 font-medium text-slate-800">
                    {message.subject}
                  </h4>
                  <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                    {message.message}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-slate-200/50 bg-slate-50/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50 hover:bg-white/80 rounded-lg transition-all duration-300 disabled:hover:bg-transparent"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-slate-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasMore}
                    className="px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50 hover:bg-white/80 rounded-lg transition-all duration-300 disabled:hover:bg-transparent"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/50 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {selectedMessage.subject}
                    </h2>
                    <p className="text-slate-500 mt-2">
                      From: {selectedMessage.name} ({selectedMessage.email})
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="p-2.5 text-indigo-500 hover:bg-indigo-50/80 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                      title="Reply to message"
                    >
                      <FaReply className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="p-2.5 text-rose-500 hover:bg-rose-50/80 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                      title="Delete message"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full">
                      Received: {formatDateTime(selectedMessage.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        selectedMessage.read 
                          ? 'bg-emerald-50/80 text-emerald-600 border border-emerald-200/50' 
                          : 'bg-amber-50/80 text-amber-600 border border-amber-200/50'
                      }`}>
                        {selectedMessage.read ? 'Read' : 'Unread'}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex items-center justify-center h-[400px] bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/50"
              >
                <div className="text-center">
                  <FaEnvelope className="w-14 h-14 text-indigo-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Select a message to view
                  </h3>
                  <p className="text-slate-500 text-sm max-w-[240px]">
                    Choose a message from the list to view its contents
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
} 