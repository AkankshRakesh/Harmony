"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, MoreVertical } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  diagnosis: string
  lastVisit: string
  status: "active" | "pending" | "discharged"
}

export default function RecentPatients() {
  const patients: Patient[] = [
    {
      id: "P001",
      name: "Rajesh Kumar",
      age: 45,
      diagnosis: "Hypertension (ICD-11: BA00)",
      lastVisit: "2 hours ago",
      status: "active",
    },
    {
      id: "P002",
      name: "Priya Singh",
      age: 38,
      diagnosis: "Type 2 Diabetes (ICD-11: BA7D.3Y)",
      lastVisit: "5 hours ago",
      status: "active",
    },
    {
      id: "P003",
      name: "Arun Patel",
      age: 52,
      diagnosis: "Migraine - Ayurvedic (NAMASTE: UA001)",
      lastVisit: "1 day ago",
      status: "pending",
    },
    {
      id: "P004",
      name: "Meera Reddy",
      age: 28,
      diagnosis: "Anxiety Disorder (ICD-11: BA47.Z)",
      lastVisit: "3 days ago",
      status: "discharged",
    },
  ]

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Recent Patients</h2>
        <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/20 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {patient.name.split(" ")[0][0]}
                    {patient.name.split(" ")[1][0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.diagnosis}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
                <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  patient.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : patient.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </span>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
