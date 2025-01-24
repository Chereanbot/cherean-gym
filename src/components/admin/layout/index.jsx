'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiSettings, FiUser, FiBook, FiGrid, FiLayers, FiMessageSquare, FiBox } from 'react-icons/fi'

const menuItems = [
  {
    title: 'Home Management',
    items: [
      {
        title: 'Hero Section',
        href: '/admin/home',
        icon: <FiHome className="w-5 h-5" />
      },
      {
        title: 'Background',
        href: '/admin/home/background',
        icon: <FiLayers className="w-5 h-5" />
      }
    ]
  },
  {
    title: 'Content',
    items: [
      {
        title: 'About',
        href: '/admin/about',
        icon: <FiUser className="w-5 h-5" />
      },
      {
        title: 'Services',
        href: '/admin/services',
        icon: <FiGrid className="w-5 h-5" />
      },
      {
        title: 'Experience',
        href: '/admin/experience',
        icon: <FiBook className="w-5 h-5" />
      },
      {
        title: 'Projects',
        href: '/admin/projects',
        icon: <FiBox className="w-5 h-5" />
      },
      {
        title: 'Blog',
        href: '/admin/blog',
        icon: <FiMessageSquare className="w-5 h-5" />
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'General',
        href: '/admin/settings',
        icon: <FiSettings className="w-5 h-5" />
      }
    ]
  }
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="text-xl font-bold text-gray-800">
              Admin Panel
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100"
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {menuItems.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className={`lg:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-200 ${sidebarOpen ? '' : 'lg:pl-0'}`}>
        {/* Mobile header */}
        <div className="sticky top-0 z-40 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="text-xl font-bold text-gray-800">
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 