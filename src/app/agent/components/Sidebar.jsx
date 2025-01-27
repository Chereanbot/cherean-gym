'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  CpuChipIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    section: 'Chat',
    items: [
      {
        title: 'Current Chat',
        icon: ChatBubbleLeftRightIcon,
        path: '/agent'
      },
      {
        title: 'Chat History',
        icon: ClockIcon,
        path: '/agent/history'
      }
    ]
  },
  {
    section: 'Resources',
    items: [
      {
        title: 'Documentation',
        icon: DocumentTextIcon,
        path: '/agent/docs'
      },
      {
        title: 'Code Snippets',
        icon: CodeBracketIcon,
        path: '/agent/snippets'
      },
      {
        title: 'API References',
        icon: CpuChipIcon,
        path: '/agent/api'
      }
    ]
  },
  {
    section: 'Tools',
    items: [
      {
        title: 'Code Generator',
        icon: BeakerIcon,
        path: '/agent/generator'
      },
      {
        title: 'Utilities',
        icon: WrenchScrewdriverIcon,
        path: '/agent/tools'
      }
    ]
  }
];

export default function Sidebar({ collapsed = false, onCollapse = () => {} }) {
  const pathname = usePathname();

  return (
    <div 
      className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } fixed left-0 top-0 z-30 overflow-y-auto`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-800">ChereanAgent</span>
          </div>
        )}
        <button
          onClick={() => onCollapse(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg
            className={`w-6 h-6 text-gray-600 transform transition-transform ${
              collapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            {!collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center ${
                      collapsed ? 'justify-center' : 'justify-between'
                    } p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : ''}`} />
                      {!collapsed && (
                        <span className={`${isActive ? 'font-medium' : ''}`}>
                          {item.title}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
} 