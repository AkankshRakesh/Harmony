"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Signup } from "@/components/signup"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Create your HealthSync account</h1>
              <p className="text-sm text-muted-foreground">Start a secure, interoperable EMR for your clinic or team. Invite colleagues, configure integrations, and import patient data.</p>
            </div>
          </div>

          <div>
            <Signup />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
