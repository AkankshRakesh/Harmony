"use client"

import Link from "next/link"
import { Bell, Menu, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onSidebarToggle: () => void
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="inline-flex">
          <Menu className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </Button>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search patients, codes..." className="pl-10 h-9 bg-input" />
        </div>
      </div>

      <div className="flex items-center gap-4">

        
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <img src="/logo-white.png" alt="HealthSync" className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-foreground">HealthSync</span>
        </Link>

        <button
          aria-label="Open user menu"
          className="w-9 h-9 rounded-full bg-gradient-blue-purple flex items-center justify-center"
        >
          <span className="text-white text-sm font-semibold">DR</span>
        </button>
      </div>
    </header>
  )
}
