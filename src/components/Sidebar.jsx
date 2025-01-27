import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  CodeBracketIcon,
  CpuChipIcon,
  BeakerIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    section: "Chat",
    items: [
      {
        title: "Current Chat",
        icon: ChatBubbleLeftRightIcon,
        path: "/agent/chat",
      },
      {
        title: "Chat History",
        icon: ClockIcon,
        path: "/agent/history",
      }
    ]
  },
  {
    section: "Resources",
    items: [
      {
        title: "Documentation",
        icon: BookOpenIcon,
        path: "/agent/docs",
      },
      {
        title: "Code Snippets",
        icon: CodeBracketIcon,
        path: "/agent/snippets",
      },
      {
        title: "API References",
        icon: DocumentTextIcon,
        path: "/agent/api-refs",
      }
    ]
  },
  {
    section: "Tools",
    items: [
      {
        title: "Code Generator",
        icon: CpuChipIcon,
        path: "/agent/generator",
      },
      {
        title: "Debugging Tools",
        icon: WrenchScrewdriverIcon,
        path: "/agent/debug",
      },
      {
        title: "Performance",
        icon: ChartBarIcon,
        path: "/agent/performance",
      },
      {
        title: "Settings",
        icon: CogIcon,
        path: "/agent/settings",
      }
    ]
  }
];

export default function Sidebar({ collapsed, onCollapse }) {
  const pathname = usePathname();

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-black transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
        {!collapsed && (
          <div className="flex items-center">
            <BeakerIcon className="w-8 h-8 text-yellow-500" />
            <span className="ml-2 text-xl font-bold text-yellow-500">DevAgent</span>
          </div>
        )}
        <button
          onClick={() => onCollapse(!collapsed)}
          className="p-2 rounded-lg hover:bg-black text-yellow-500 border border-gray-800 hover:border-yellow-500/50"
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="w-6 h-6" />
          ) : (
            <ChevronDoubleLeftIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-8 overflow-y-auto max-h-[calc(100vh-10rem)] bg-black">
        {menuItems.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <h2 className="mb-4 text-sm font-semibold text-yellow-500/70 uppercase tracking-wider">
                {section.section}
              </h2>
            )}
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-black border border-yellow-500/50 text-yellow-500'
                        : 'text-yellow-500/80 hover:bg-black hover:border hover:border-yellow-500/30 hover:text-yellow-500'
                    }`}
                  >
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                    {!collapsed && (
                      <span className="ml-3 text-sm font-medium">{item.title}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 bg-black">
        <button
          className={`flex items-center w-full p-2 rounded-lg text-yellow-500/80 hover:bg-black hover:border hover:border-yellow-500/30 hover:text-yellow-500 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
} 