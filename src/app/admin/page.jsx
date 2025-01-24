'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { FaBlog, FaProjectDiagram, FaGraduationCap, FaBriefcase, FaList, FaPlus, FaUser, FaCode, FaEnvelope, FaChartLine, FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import DashboardSearch from '@/components/admin/DashboardSearch'
import MetricsDisplay from '@/components/admin/MetricsDisplay'
import ActivityTimeline from '@/components/admin/ActivityTimeline'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: { total: 0, draft: 0, published: 0, visible: true, order: 1 },
    projects: { total: 0, active: 0, completed: 0, visible: true, order: 2 },
    services: { total: 0, visible: true, order: 3 },
    experience: { total: 0, visible: true, order: 4 },
    education: { total: 0, visible: true, order: 5 },
    messages: { total: 0, unread: 0, visible: true, order: 6 }
  })
  const [settings, setSettings] = useState({
    theme: { mode: 'light', primaryColor: 'green', accentColor: 'blue' },
    layout: { compactMode: false, showGreeting: true, cardSize: 'medium', gridColumns: 3 },
    widgets: {
      blogs: {
        visible: true,
        order: 1,
        bgColor: 'blue',
        showDrafts: true,
        showPublished: true,
        showCount: true
      },
      projects: {
        visible: true,
        order: 2,
        bgColor: 'green',
        showActive: true,
        showCompleted: true,
        showCount: true
      },
      services: {
        visible: true,
        order: 3,
        bgColor: 'purple',
        showCount: true
      },
      experience: {
        visible: true,
        order: 4,
        bgColor: 'orange',
        showCount: true
      },
      education: {
        visible: true,
        order: 5,
        bgColor: 'pink',
        showCount: true
      },
      messages: {
        visible: true,
        order: 6,
        bgColor: 'yellow',
        showUnread: true,
        showTotal: true,
        showCount: true
      }
    },
    quickActions: {
      newBlog: { visible: true, order: 1, showDescription: true },
      newProject: { visible: true, order: 2, showDescription: true },
      manageServices: { visible: true, order: 3, showDescription: true },
      updateExperience: { visible: true, order: 4, showDescription: true },
      viewMessages: { visible: true, order: 5, showDescription: true },
      editProfile: { visible: true, order: 6, showDescription: true }
    },
    notifications: { showInDashboard: true, position: 'top-right', autoHide: true, duration: 5000 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, settingsResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/settings/dashboard')
      ])
      
      const [statsData, settingsData] = await Promise.all([
        statsResponse.json(),
        settingsResponse.json()
      ])

      if (statsData.success) {
        setStats(statsData.data)
      }
      if (settingsData.success) {
        setSettings(settingsData.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getCardSize = () => {
    switch (settings.layout.cardSize) {
      case 'small': return 'p-4'
      case 'large': return 'p-8'
      default: return 'p-6'
    }
  }

  const getGridColumns = () => {
    const cols = settings.layout.gridColumns
    return `grid-cols-1 md:grid-cols-${Math.min(cols, 2)} lg:grid-cols-${Math.min(cols, 3)} xl:grid-cols-${cols}`
  }

  const QuickAccessCard = ({ href, icon: Icon, title, count, subCount, bgColor }) => (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: settings.layout.compactMode ? 1.02 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`bg-${bgColor}-500 rounded-xl ${getCardSize()} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${settings.layout.compactMode ? 'mb-1' : 'mb-2'}`}>{title}</h3>
            <p className="text-2xl font-bold">{count || 0}</p>
            {subCount && !settings.layout.compactMode && (
              <p className="text-sm opacity-90 mt-1">{subCount}</p>
            )}
          </div>
          <Icon className={`${settings.layout.compactMode ? 'text-3xl' : 'text-4xl'} opacity-80`} />
        </div>
      </motion.div>
    </Link>
  )

  const QuickActionButton = ({ href, icon: Icon, label, description, showDescription }) => (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: settings.layout.compactMode ? 1.02 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-4 bg-white ${getCardSize()} rounded-xl shadow hover:shadow-md transition-all duration-300`}
      >
        <div className={`p-3 bg-${settings.theme.primaryColor}-50 rounded-lg`}>
          <Icon className={`text-${settings.theme.primaryColor}-500 ${settings.layout.compactMode ? 'text-xl' : 'text-2xl'}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{label}</h3>
          {showDescription && description && !settings.layout.compactMode && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </motion.div>
    </Link>
  )

  const SectionTitle = ({ children }) => (
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <FaChartLine className={`text-${settings.theme.primaryColor}-500`} />
      {children}
    </h2>
  )

  const quickActionConfigs = {
    newBlog: {
      href: "/admin/blog?action=new",
      icon: FaBlog,
      label: "New Blog Post",
      description: "Write and publish a new blog article"
    },
    newProject: {
      href: "/admin/project?action=new",
      icon: FaProjectDiagram,
      label: "New Project",
      description: "Add a new project to your portfolio"
    },
    manageServices: {
      href: "/admin/services",
      icon: FaCode,
      label: "Manage Services",
      description: "Update your service offerings"
    },
    updateExperience: {
      href: "/admin/experience",
      icon: FaBriefcase,
      label: "Update Experience",
      description: "Add or edit work experience"
    },
    viewMessages: {
      href: "/admin/messages",
      icon: FaEnvelope,
      label: "View Messages",
      description: "Check your contact form messages"
    },
    editProfile: {
      href: "/admin/about",
      icon: FaUser,
      label: "Edit Profile",
      description: "Update your personal information"
    }
  }

  const widgetConfigs = {
    blogs: {
      href: "/admin/blog",
      icon: FaBlog,
      title: "Blog Posts",
      bgColor: settings.widgets?.blogs?.bgColor || 'blue'
    },
    projects: {
      href: "/admin/project",
      icon: FaProjectDiagram,
      title: "Projects",
      bgColor: settings.widgets?.projects?.bgColor || 'green'
    },
    services: {
      href: "/admin/services",
      icon: FaCode,
      title: "Services",
      bgColor: settings.widgets?.services?.bgColor || 'purple'
    },
    messages: {
      href: "/admin/messages",
      icon: FaEnvelope,
      title: "Messages",
      bgColor: settings.widgets?.messages?.bgColor || 'yellow'
    },
    experience: {
      href: "/admin/experience",
      icon: FaBriefcase,
      title: "Experience",
      bgColor: settings.widgets?.experience?.bgColor || 'orange'
    },
    education: {
      href: "/admin/education",
      icon: FaGraduationCap,
      title: "Education",
      bgColor: settings.widgets?.education?.bgColor || 'pink'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    )
  }

  const visibleQuickActions = Object.entries(settings.quickActions || {})
    .filter(([, config]) => config.visible)
    .sort((a, b) => a[1].order - b[1].order)

  const visibleWidgets = Object.entries(stats)
    .filter(([key]) => key !== 'quickActions')
    .filter(([key]) => settings.widgets?.[key]?.visible)
    .sort((a, b) => (settings.widgets[a[0]]?.order || 0) - (settings.widgets[b[0]]?.order || 0))

  return (
    <AdminLayout>
      <div className={`p-6 space-y-${settings.layout.compactMode ? '6' : '8'}`}>
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            {settings.layout.showGreeting && (
              <p className="text-gray-600 mt-1">
                Welcome back! Here's your overview.
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {settings.notifications.showInDashboard && (
              <button className="text-gray-600 hover:text-gray-800">
                <FaBell className="text-xl" />
              </button>
            )}
            <Link 
              href="/admin/settings/dashboard"
              className={`text-${settings.theme.primaryColor}-500 hover:text-${settings.theme.primaryColor}-600 flex items-center gap-2`}
            >
              <FaList />
              <span>Customize Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl">
          <DashboardSearch />
        </div>

        {/* Metrics Display */}
        <MetricsDisplay />

        {/* Quick Actions */}
        <div>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className={`grid ${getGridColumns()} gap-4`}>
            {visibleQuickActions.map(([key, config]) => {
              const actionConfig = quickActionConfigs[key]
              return (
                <QuickActionButton
                  key={key}
                  href={actionConfig.href}
                  icon={actionConfig.icon}
                  label={actionConfig.label}
                  description={actionConfig.description}
                  showDescription={config.showDescription}
                />
              )
            })}
          </div>
        </div>

        {/* Content Stats */}
        <div>
          <SectionTitle>Content Overview</SectionTitle>
          <div className={`grid ${getGridColumns()} gap-6`}>
            {visibleWidgets.map(([key, data]) => {
              const config = widgetConfigs[key]
              const widget = settings.widgets[key]
              return (
                <QuickAccessCard
                  key={key}
                  href={config.href}
                  icon={config.icon}
                  title={config.title}
                  count={widget.showCount !== false ? data.total : undefined}
                  subCount={
                    key === 'blogs' && !settings.layout.compactMode
                      ? (widget.showDrafts || widget.showPublished)
                        ? `${widget.showPublished ? `${data.published || 0} published` : ''}${
                            widget.showDrafts && widget.showPublished ? ' · ' : ''
                          }${widget.showDrafts ? `${data.draft || 0} drafts` : ''}`
                        : undefined
                      : key === 'projects' && !settings.layout.compactMode
                      ? (widget.showActive || widget.showCompleted)
                        ? `${widget.showActive ? `${data.active || 0} active` : ''}${
                            widget.showActive && widget.showCompleted ? ' · ' : ''
                          }${widget.showCompleted ? `${data.completed || 0} completed` : ''}`
                        : undefined
                      : key === 'messages' && !settings.layout.compactMode
                      ? (widget.showUnread && data.unread > 0)
                        ? `${data.unread} unread`
                        : widget.showTotal
                        ? 'No new messages'
                        : undefined
                      : undefined
                  }
                  bgColor={config.bgColor}
                />
              )
            })}
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <SectionTitle>Recent Activity</SectionTitle>
          <div className="bg-white rounded-lg shadow p-6">
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
