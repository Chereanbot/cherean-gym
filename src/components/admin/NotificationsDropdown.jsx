import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaBell, FaChevronRight, FaCheck, FaTimes, FaCalendar, 
  FaVolumeMute, FaVolumeUp, FaCog, FaFilter, FaTrash,
  FaExclamationCircle, FaInfoCircle, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { format, isToday, isYesterday } from 'date-fns'
import { getNotificationTypeDetails, getNotificationCategoryDetails } from '@/utils/notificationTypes'

const NOTIFICATION_TYPES = {
  info: { icon: FaInfoCircle, color: 'blue' },
  success: { icon: FaCheckCircle, color: 'green' },
  warning: { icon: FaExclamationTriangle, color: 'yellow' },
  error: { icon: FaExclamationCircle, color: 'red' }
}

const NOTIFICATION_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'system', label: 'System' },
  { id: 'blog', label: 'Blog' },
  { id: 'project', label: 'Project' },
  { id: 'service', label: 'Service' },
  { id: 'auth', label: 'Auth' }
]

export default function NotificationsDropdown() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [preferences, setPreferences] = useState({
    sound: true,
    desktop: true,
    showUnreadOnly: false,
    autoMarkRead: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const notificationsRef = useRef(null)
  const audioRef = useRef(new Audio('/notification.mp3'))
  const wsRef = useRef(null)

  // Filter notifications based on preferences and category
  const filteredNotifications = notifications.filter(notification => {
    if (preferences.showUnreadOnly && notification.read) return false
    if (selectedCategory !== 'ALL' && notification.category !== selectedCategory) return false
    return true
  })

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt)
    let groupKey = 'Older'
    
    if (isToday(date)) {
      groupKey = 'Today'
    } else if (isYesterday(date)) {
      groupKey = 'Yesterday'
    } else if (date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      groupKey = format(date, 'EEEE')
    }
    
    if (!groups[groupKey]) groups[groupKey] = []
    groups[groupKey].push(notification)
    return groups
  }, {})

  // WebSocket connection
  useEffect(() => {
    wsRef.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000')
    
    wsRef.current.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Play sound if enabled
      if (preferences.sound) {
        audioRef.current.play().catch(err => console.error('Error playing sound:', err))
      }
      
      // Show desktop notification if enabled and permission granted
      if (preferences.desktop && Notification.permission === 'granted') {
        new Notification('New Notification', {
          body: notification.message,
          icon: '/favicon.ico'
        })
      }

      // Auto mark as read if enabled
      if (preferences.autoMarkRead) {
        handleMarkAsRead(notification._id)
      }
    }
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      toast.error('Connection lost. Retrying...')
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [preferences])

  // Save preferences to localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notificationPreferences')
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences))
  }, [preferences])

  // Request notification permission
  useEffect(() => {
    if (preferences.desktop && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [preferences.desktop])

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications/get')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data.notifications)
        setUnreadCount(data.data.unreadCount)
      } else {
        console.error('Failed to fetch notifications:', data.error)
        toast.error('Failed to fetch notifications')
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to fetch notifications')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch and polling
  useEffect(() => {
    fetchNotifications()
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
        setShowPreferences(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle marking notification as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(prev => 
          prev.map(notif => notif._id === id ? { ...notif, read: true } : notif)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
        toast.success('Notification marked as read')
      } else {
        toast.error('Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }

  // Handle marking all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
        setUnreadCount(0)
        toast.success('All notifications marked as read')
      } else {
        toast.error('Failed to mark all as read')
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to mark all as read')
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
        if (!notifications.find(n => n._id === id)?.read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        toast.success('Notification deleted')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  // Handle clearing all notifications
  const handleClearAll = async () => {
    try {
      const response = await fetch('/api/notifications/clear-all', {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setNotifications([])
        setUnreadCount(0)
        toast.success('All notifications cleared')
      }
    } catch (error) {
      console.error('Error clearing notifications:', error)
      toast.error('Failed to clear notifications')
    }
  }

  // Toggle preferences
  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="relative" ref={notificationsRef}>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300"
        >
          <FaBell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => togglePreference('sound')}
          className="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300"
          title={`Sound ${preferences.sound ? 'enabled' : 'disabled'}`}
        >
          {preferences.sound ? (
            <FaVolumeUp className="w-4 h-4 text-gray-600" />
          ) : (
            <FaVolumeMute className="w-4 h-4 text-gray-600" />
          )}
        </button>
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-300"
          title="Notification preferences"
        >
          <FaCog className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Preferences Dropdown */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white/95 rounded-xl shadow-xl border border-gray-200/50 z-50 backdrop-blur-lg"
          >
            <div className="p-4 border-b border-gray-200/50">
              <h3 className="font-semibold text-gray-800">Notification Preferences</h3>
            </div>
            <div className="p-4 space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Sound notifications</span>
                <button
                  onClick={() => togglePreference('sound')}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.sound ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    preferences.sound ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Desktop notifications</span>
                <button
                  onClick={() => togglePreference('desktop')}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.desktop ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    preferences.desktop ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show unread only</span>
                <button
                  onClick={() => togglePreference('showUnreadOnly')}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.showUnreadOnly ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    preferences.showUnreadOnly ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Auto mark as read</span>
                <button
                  onClick={() => togglePreference('autoMarkRead')}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.autoMarkRead ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    preferences.autoMarkRead ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            ref={notificationsRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white/95 rounded-xl shadow-xl border border-gray-200/50 z-50 backdrop-blur-lg"
          >
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <FaBell className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <p className="text-xs text-gray-500">
                      {unreadCount} unread notifications
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                      title="Clear all notifications"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowPreferences(!showPreferences)}
                    className="p-2 hover:bg-gray-100/80 rounded-lg text-gray-600"
                    title="Notification preferences"
                  >
                    <FaCog className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                {Object.entries(getNotificationCategoryDetails()).map(([key, { label, icon: Icon }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length > 0 ? (
                Object.entries(groupedNotifications).map(([date, items]) => (
                  <div key={date}>
                    <div className="px-4 py-2 bg-gray-50/80 border-y border-gray-200/50">
                      <h4 className="text-xs font-medium text-gray-500">{date}</h4>
                    </div>
                    {items.map((notification) => {
                      const { color, icon: Icon } = getNotificationTypeDetails(notification.type)

                      return (
                        <div
                          key={notification._id}
                          className={`p-4 hover:bg-gray-50/80 transition-all duration-200 border-l-4 ${
                            !notification.read ? `border-${color}-500` : 'border-transparent'
                          } group relative`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-4 h-4 text-${color}-500`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700">{notification.message}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-400">
                                  {format(new Date(notification.createdAt), 'h:mm a')}
                                </span>
                                {notification.category && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full bg-${color}-50 text-${color}-600`}>
                                    {notification.category}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className={`p-1 hover:bg-${color}-50 rounded text-${color}-500`}
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
                      )
                    })}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100/90 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium">No notifications</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCategory !== 'ALL' 
                      ? `No ${selectedCategory} notifications found`
                      : preferences.showUnreadOnly
                        ? 'No unread notifications'
                        : "You're all caught up!"
                    }
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 