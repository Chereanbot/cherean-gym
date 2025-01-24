'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/layout'
import Link from 'next/link'
import { FiLayers, FiHome } from 'react-icons/fi'

const sections = [
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Manage your homepage hero section content',
    icon: <FiHome className="w-8 h-8" />,
    href: '/admin/home'
  },
  {
    id: 'background',
    title: 'Background',
    description: 'Manage your website background animations',
    icon: <FiLayers className="w-8 h-8" />,
    href: '/admin/home/background'
  }
]

export default function HomeAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Home Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your website's home page sections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(section => (
            <Link
              key={section.id}
              href={section.href}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 bg-green-100 rounded-lg">
                  {section.icon}
                </div>
              </div>
              <h2 className="text-lg font-semibold mt-4">{section.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
} 