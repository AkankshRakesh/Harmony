"use client"

import type React from "react"
import { Poppins, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/dashboard/dashboard-header"
import Sidebar from "@/components/dashboard/sidebar"
import { useState } from "react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
})

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={`${poppins.variable} ${inter.variable} flex min-h-screen bg-background font-sans`}> 
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 flex flex-col overflow-hidden transition-[padding-left] duration-300 ease-in-out ${
        sidebarOpen ? 'md:pl-64' : 'md:pl-0'
      }`}>
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl w-full mx-auto p-6">{children}</div>
        </main>

        <Analytics />
      </div>
    </div>
  )
}
