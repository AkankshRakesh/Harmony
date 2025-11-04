"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle } from "lucide-react"

interface Integration {
  name: string
  status: "connected" | "pending" | "error"
  records: number
  lastSync: string
}

export default function IntegrationStatus() {
  const integrations: Integration[] = [
    {
      name: "ICD-11 Traditional Medicine Module 2",
      status: "connected",
      records: 12450,
      lastSync: "15 minutes ago",
    },
    {
      name: "NAMASTE Classification System",
      status: "connected",
      records: 8932,
      lastSync: "22 minutes ago",
    },
    {
      name: "EHR Compliance Framework",
      status: "connected",
      records: 15230,
      lastSync: "8 minutes ago",
    },
  ]

  return (
    <Card className="bg-card border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Integration Status</h2>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {integration.status === "connected" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                {integration.records.toLocaleString()} records • Last synced: {integration.lastSync}
              </p>
            </div>
            <Badge
              variant={integration.status === "connected" ? "default" : "secondary"}
              className={
                integration.status === "connected"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }
            >
              {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
