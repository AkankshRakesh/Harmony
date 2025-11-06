"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, BookOpen, Users, Stethoscope, Settings, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/icd11", label: "ICD-11 Codes", icon: BookOpen },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/namaste", label: "NAMASTE", icon: Stethoscope },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden ${
          open ? "w-64 translate-x-0" : "w-0 translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">EMR System</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Traditional Medicine Integrated</p>
        </div>

  <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60">v1.0.0</p>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-sidebar border-b border-sidebar-border flex items-center px-4 gap-4">
        <Button variant="ghost" size="sm" onClick={onToggle} className="text-sidebar-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search patients, codes..." className="pl-10 h-9 bg-input" />
        </div>
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <img src="/logo-white.png" alt="HealthSync" className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50">
          <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-6 border-b border-sidebar-border mt-16">
              <h1 className="text-xl font-bold text-sidebar-foreground">EMR System</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href} onClick={onToggle}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
