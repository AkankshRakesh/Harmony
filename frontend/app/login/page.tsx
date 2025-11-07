"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Login } from "@/components/login"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            {/* Small marketing/hero beside the login form to keep theme consistent */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Sign in to HealthSync</h1>
              <p className="text-sm text-muted-foreground">Secure access to clinical workflows, patient records, and interoperability tools.</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• HIPAA-ready access controls</li>
                <li>• Fast FHIR-enabled integrations</li>
                <li>• Centralized clinical data</li>
              </ul>
            </div>
          </div>

          <div>
            <Login />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
