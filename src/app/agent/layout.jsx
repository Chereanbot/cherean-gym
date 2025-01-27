'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AgentLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onCollapse={setSidebarCollapsed} 
      />
      <main 
        className={`transition-all duration-300 bg-black ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-8 bg-black">
          {children}
        </div>
      </main>
    </div>
  );
} 