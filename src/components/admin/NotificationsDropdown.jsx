import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBell, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

export default function NotificationsDropdown() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const notificationsRef = useRef(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications/get')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data)
        setUnreadCount(data.data.filter(n => !n.read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle marking notification as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(notifications.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
        toast.success('Notification marked as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })))
        setUnreadCount(0)
        toast.success('All notifications marked as read')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }

  // Handle deleting a notification
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(notifications.filter(notif => notif._id !== id))
        setUnreadCount(prev => Math.max(0, prev - 1))
        toast.success('Notification deleted')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Poll every minute
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg hover:bg-slate-100/80 transition-all duration-300"
      >
        <FaBell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            ref={notificationsRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white/80 rounded-xl shadow-xl border border-slate-100 z-50 backdrop-blur-lg"
          >
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <FaBell className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    <p className="text-xs text-slate-500">
                      {unreadCount} unread notifications
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <Link 
                    href="/admin/notifications" 
                    className="text-sm text-indigo-500 hover:text-indigo-600 font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <FaChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-500 text-sm mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-slate-50/80 transition-all duration-200 border-l-4 ${
                      !notification.read ? 'border-indigo-500' : 'border-transparent'
                    } group cursor-pointer`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                        <span className="text-xs text-slate-400 mt-1 block">
                          {new Date(notification.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1 hover:bg-indigo-50 rounded text-indigo-500"
                            title="Mark as read"
                          >
                            <FaCheck className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-1 hover:bg-red-50 rounded text-red-500"
                          title="Delete"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBell className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">No notifications</p>
                  <p className="text-sm text-slate-500 mt-1">You're all caught up!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 