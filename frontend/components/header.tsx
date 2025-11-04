"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <img src="/logo-white.png" alt="Harmony Logo" className="w-6 h-6" />
          </div>
          <span className="text-xl font-semibold text-foreground">Harmony</span>
        </div> 

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
            Features
          </a>
          <a href="#community" className="text-sm text-muted-foreground hover:text-foreground transition">
            Community
          </a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-sm">
            Sign In
          </Button>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
