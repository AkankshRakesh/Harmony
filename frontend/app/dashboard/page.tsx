"use client"

import Header from '@/components/dashboard/dashboard-header'
import EmrDashboard from '@/components/dashboard/emr-dashboard'
import Sidebar from '@/components/dashboard/sidebar'
import { useState } from 'react'


export default function DashboardPage() {
const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <>
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <EmrDashboard />
      </div>
    </div>
    </>
  )
}
