"use client"

import EMRDashboard from '@/components/dashboard/emr-dashboard'
import AuthGuard from '@/components/auth-guard'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <EMRDashboard />
    </AuthGuard>
  )
}
