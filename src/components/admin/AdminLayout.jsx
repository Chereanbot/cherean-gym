'use client'

import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBlog, FaProjectDiagram, FaBriefcase, FaGraduationCap, FaCog, FaList, 
  FaTachometerAlt, FaBars, FaTimes, FaSignOutAlt, FaBell, FaSearch, FaUserCircle,
  FaChevronDown, FaChevronRight, FaHome, FaUser, FaKey, FaGlobe, FaCheckCircle, FaExclamationTriangle, FaCheck, FaEnvelope, FaInbox, FaStar } from 'react-icons/fa'
import Image from 'next/image'

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const [recentNotifications, setRecentNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)

  const notificationTypes = {
    project: {
      icon: FaProjectDiagram,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-500'
    },
    blog: {
      icon: FaBlog,
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-500'
    },
    system: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500'
    }
  }

  const NotificationIcon = ({ type, read, className }) => {
    const Icon = notificationTypes[type]?.icon
    return Icon ? <Icon className={className} /> : null
  }

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/get')
      const data = await response.json()
      
      if (data.success) {
        setRecentNotifications(data.data)
        setUnreadCount(data.data.filter(n => !n.read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }, [])

  // Helper functions for notification formatting
  const getNotificationTitle = (notification) => {
    switch (notification.category) {
      case 'blog':
        return 'Blog Update'
      case 'project':
        return 'Project Update'
      case 'service':
        return 'Service Update'
      case 'experience':
        return 'Experience Update'
      case 'education':
        return 'Education Update'
      default:
        return 'System Notification'
    }
  }

  const formatNotificationDate = (date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return notificationDate.toLocaleDateString()
  }

  const getDefaultLink = (notification) => {
    switch (notification.category) {
      case 'blog':
        return '/admin/blog'
      case 'project':
        return '/admin/project'
      case 'service':
        return '/admin/services'
      case 'experience':
        return '/admin/experience'
      case 'education':
        return '/admin/education'
      default:
        return '/admin'
    }
  }

  const getActionLabel = (notification) => {
    switch (notification.category) {
      case 'blog':
        return 'View Blog'
      case 'project':
        return 'View Project'
      case 'service':
        return 'View Service'
      case 'experience':
        return 'View Experience'
      case 'education':
        return 'View Education'
      default:
        return 'View Details'
    }
  }

  // Handle marking notification as read
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (data.success) {
        setRecentNotifications(recentNotifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
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
        setRecentNotifications(recentNotifications.map(notif => ({ ...notif, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
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
        const updatedNotifications = recentNotifications.filter(notif => notif.id !== id)
        setRecentNotifications(updatedNotifications)
        setUnreadCount(updatedNotifications.filter(n => !n.read).length)
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
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
        setRecentNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every minute
    const pollInterval = setInterval(fetchNotifications, 60000)
    
    return () => clearInterval(pollInterval)
  }, [fetchNotifications])

  const notificationsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      setIsSidebarOpen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Add function to fetch unread messages count
  const fetchUnreadMessagesCount = useCallback(async () => {
    try {
      const response = await fetch('/api/contact/messages?read=false')
      const data = await response.json()
      
      if (data.success) {
        setUnreadMessages(data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error)
    }
  }, [])

  // Add effect to fetch unread messages count
  useEffect(() => {
    fetchUnreadMessagesCount()
    const interval = setInterval(fetchUnreadMessagesCount, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [fetchUnreadMessagesCount])

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FaTachometerAlt,
      path: '/admin'
    },
    {
      title: 'Home Management',
      icon: FaHome,
      submenu: [
        { title: 'Hero Section', path: '/admin/home' },
        { title: 'Featured Projects', path: '/admin/home/featured' },
        { title: 'Background', path: '/admin/home/background' },
        { title: 'Skills & Tech', path: '/admin/home/skills' },
        { title: 'Call to Action', path: '/admin/home/cta' },
      ]
    },
    {
      title: 'Reviews',
      icon: FaStar,
      submenu: [
        { title: 'All Reviews', path: '/admin/reviews' },
        { title: 'Pending Reviews', path: '/admin/reviews?status=pending' },
        { title: 'Review Settings', path: '/admin/reviews/settings' },
      ]
    },
    {
      title: 'About Management',
      icon: FaUser,
      submenu: [
        { title: 'Personal Info', path: '/admin/about' },
        { title: 'Bio & Story', path: '/admin/about/bio' },
        { title: 'Skills & Expertise', path: '/admin/about/skills' },
        { title: 'Achievements', path: '/admin/about/achievements' },
        { title: 'Resume', path: '/admin/about/resume' },
      ]
    },
    {
      title: 'Blog Management',
      icon: FaBlog,
      submenu: [
        { title: 'All Posts', path: '/admin/blog' },
        { title: 'Add New Post', path: '/admin/blog?action=new' },
        { title: 'Categories', path: '/admin/blog/categories' },
      ]
    },
    {
      title: 'Project Management',
      icon: FaProjectDiagram,
      submenu: [
        { title: 'All Projects', path: '/admin/project' },
        { title: 'Add New Project', path: '/admin/project?action=new' },
        { title: 'Categories', path: '/admin/project/categories' },
      ]
    },
    {
      title: 'Services',
      icon: FaList,
      submenu: [
        { title: 'All Services', path: '/admin/services' },
        { title: 'Add Service', path: '/admin/services?action=new' },
        { title: 'Service Categories', path: '/admin/services/categories' },
      ]
    },
    {
      title: 'Experience',
      icon: FaBriefcase,
      submenu: [
        { title: 'Work History', path: '/admin/experience' },
        { title: 'Add Experience', path: '/admin/experience?action=new' },
      ]
    },
    {
      title: 'Education',
      icon: FaGraduationCap,
      submenu: [
        { title: 'Education History', path: '/admin/education' },
        { title: 'Add Education', path: '/admin/education?action=new' },
      ]
    },
    {
      title: 'Messages',
      icon: FaEnvelope,
      submenu: [
        { title: 'Inbox', path: '/admin/messages', icon: FaInbox },
        { title: 'Unread Messages', path: '/admin/messages?filter=unread' },
        { title: 'All Messages', path: '/admin/messages?filter=all' },
      ]
    },
    {
      title: 'Settings',
      icon: FaCog,
      submenu: [
        { title: 'General Settings', path: '/admin/settings' },
        { title: 'Profile Settings', path: '/admin/settings/profile' },
        { title: 'SEO Settings', path: '/admin/settings/seo', icon: FaGlobe },
        { title: 'API Keys', path: '/admin/settings/api-keys', icon: FaKey },
      ]
    }
  ]

  const MenuItem = ({ item, isSubmenuItem = false }) => {
    const isActive = pathname === item.path
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const isDropdownActive = activeDropdown === item.title
    
    return (
      <>
        <div
          className={`
            ${isSubmenuItem ? 'pl-12' : 'pl-4'} 
            ${isActive ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800/60'} 
            flex items-center py-3 px-4 cursor-pointer rounded-lg transition-all duration-200
          `}
          onClick={() => {
            if (hasSubmenu) {
              setActiveDropdown(isDropdownActive ? null : item.title)
            }
          }}
        >
          {!isSubmenuItem && item.icon && <item.icon className="w-5 h-5 mr-4" />}
          <span className="flex-1">{item.title}</span>
          {item.title === 'Messages' && unreadMessages > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-rose-500 text-white rounded-full mr-2">
              {unreadMessages > 99 ? '99+' : unreadMessages}
            </span>
          )}
          {hasSubmenu && (
            <motion.div
              animate={{ rotate: isDropdownActive ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </div>
        
        {hasSubmenu && isDropdownActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.submenu.map((subItem) => (
              <Link key={subItem.path} href={subItem.path}>
                <div className="relative">
                  <MenuItem item={subItem} isSubmenuItem={true} />
                  {subItem.title === 'Unread Messages' && unreadMessages > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium bg-rose-500 text-white rounded-full">
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.2 }}
            className={`
              fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50
              transform transition-transform duration-200 ease-in-out overflow-y-auto
              ${isMobile ? 'shadow-2xl' : ''}
            `}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <Link href="/admin" className="flex items-center gap-2">
                <Image
                  src="/download.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-slate-700"
                />
                <span className="text-xl font-bold text-white/90">Cherinet Afewerk</span>
              </Link>
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-800/80"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Sidebar Menu */}
            <div className="py-4 px-2 space-y-1">
              {menuItems.map((item) => (
                <div key={item.title}>
                  {item.path ? (
                    <Link href={item.path}>
                      <MenuItem item={item} />
                    </Link>
                  ) : (
                    <MenuItem item={item} />
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 w-full p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
              <Link href="/api/auth/signout">
                <div className="flex items-center text-red-400 hover:text-red-300 transition-colors">
                  <FaSignOutAlt className="w-5 h-5 mr-4" />
                  <span>Sign Out</span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-72' : ''} transition-all duration-200`}>
        {/* Top Navbar */}
        <nav className="fixed top-0 right-0 left-0 bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-100 z-40 transition-all duration-200" 
             style={{ left: isSidebarOpen ? '18rem' : '0' }}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-slate-100/80"
                >
                  <FaBars className="w-6 h-6 text-slate-600" />
                </button>
                {/* Search bar - Hidden on mobile */}
                <div className="relative hidden md:block">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <FaSearch className="absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Visit Website Button */}
                <Link 
                  href="/" 
                  target="_blank" 
                  className="flex items-center gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 text-xs sm:text-sm md:text-base shadow-sm hover:shadow-md"
                >
                  <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="inline sm:hidden md:inline">Site</span>
                  <span className="hidden sm:inline md:hidden">Visit</span>
                  <span className="hidden md:inline">Visit Website</span>
                </Link>

                {/* Quick Actions Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-slate-100/80 text-slate-700 rounded-lg hover:bg-slate-200/80 transition-all duration-300 text-xs sm:text-sm md:text-base">
                    <FaList className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline md:inline">Actions</span>
                    <FaChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                      <Link href="/admin/project?action=new" className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50">
                        <FaProjectDiagram className="w-4 h-4 text-indigo-500" />
                        <span>New Project</span>
                      </Link>
                      <Link href="/admin/blog?action=new" className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50">
                        <FaBlog className="w-4 h-4 text-violet-500" />
                        <span>New Blog Post</span>
                      </Link>
                      <Link href="/admin/services?action=new" className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50">
                        <FaList className="w-4 h-4 text-amber-500" />
                        <span>New Service</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
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
                                  {recentNotifications.filter(n => !n.read).length} unread notifications
                                </p>
                              </div>
                            </div>
                            <Link 
                              href="/admin/notifications" 
                              className="text-sm text-indigo-500 hover:text-indigo-600 font-medium hover:underline flex items-center gap-1"
                            >
                              View All
                              <FaChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50">
                          {isLoading ? (
                            <div className="py-8 text-center">
                              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                              <p className="text-slate-500 text-sm mt-2">Loading notifications...</p>
                            </div>
                          ) : recentNotifications.length > 0 ? (
                            recentNotifications.map((notification) => (
                              <motion.div
                                key={notification.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                className={`p-4 hover:bg-slate-50/80 transition-all duration-200 border-l-4 ${
                                  !notification.read 
                                    ? notificationTypes[notification.type].borderColor
                                    : 'border-transparent'
                                } group cursor-pointer`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-full ${
                                    notification.read 
                                      ? 'bg-gray-100' 
                                      : notificationTypes[notification.type].bgColor
                                  } flex items-center justify-center flex-shrink-0 transition-colors duration-200`}>
                                    <NotificationIcon 
                                      type={notification.type}
                                      read={notification.read}
                                      className={`w-5 h-5 ${
                                        notification.read 
                                          ? 'text-gray-500' 
                                          : notificationTypes[notification.type].textColor
                                      }`}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-medium ${
                                      notification.read ? 'text-gray-600' : 'text-gray-900'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="text-xs text-gray-400">
                                        {notification.time}
                                      </span>
                                      <Link 
                                        href={notification.link}
                                        className={`text-xs ${
                                          notification.read 
                                            ? 'text-gray-500 hover:text-gray-700' 
                                            : `${notificationTypes[notification.type].textColor} hover:underline`
                                        } font-medium`}
                                      >
                                        {notification.actionLabel}
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    {!notification.read && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(notification.id);
                                        }}
                                        className="p-1 hover:bg-green-50 rounded-full text-green-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        title="Mark as read"
                                      >
                                        <FaCheckCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(notification.id);
                                      }}
                                      className="p-1 hover:bg-red-50 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                      title="Remove notification"
                                    >
                                      <FaTimes className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="py-12 px-4 text-center"
                            >
                              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                <FaBell className="w-8 h-8 text-slate-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-slate-800 mb-1">All Caught Up!</h3>
                              <p className="text-slate-500 text-sm">No new notifications to show.</p>
                            </motion.div>
                          )}
                        </div>

                        {recentNotifications.length > 0 && (
                          <div className="p-3 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={handleMarkAllAsRead}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow group"
                              >
                                <FaCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Mark all read
                              </button>
                              <button
                                onClick={handleClearAll}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                              >
                                <FaTimes className="w-4 h-4" />
                                Clear all
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200">
                  <div className="relative group">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <div className="relative">
                        <Image
                          src="/profile.jpg"
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-slate-200 sm:w-[40px] sm:h-[40px]"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="hidden sm:block">
                        <h3 className="font-medium text-slate-800 line-clamp-1 text-sm sm:text-base">Cherinet Afewerk</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Administrator</p>
                      </div>
                      <FaChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                    
                    {/* Profile Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="sm:hidden px-4 py-2 border-b border-slate-100">
                        <h3 className="font-medium text-slate-800">Cherinet Afewerk</h3>
                        <p className="text-xs text-slate-500">Administrator</p>
                      </div>
                      <div className="py-2">
                        <Link href="/admin/settings/profile" className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50">
                          <FaUserCircle className="w-4 h-4 text-indigo-500" />
                          <span>My Profile</span>
                        </Link>
                        <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50">
                          <FaCog className="w-4 h-4 text-violet-500" />
                          <span>Settings</span>
                        </Link>
                        <hr className="my-1 border-slate-100" />
                        <Link href="/api/auth/signout" className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50">
                          <FaSignOutAlt className="w-4 h-4" />
                          <span>Sign Out</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-4 mt-20">
          {children}
        </main>
      </div>
    </div>
  )
} 