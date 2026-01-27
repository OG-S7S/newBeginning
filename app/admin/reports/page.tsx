"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Download,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { generateReport, getReports, getReportData } from "@/lib/supabase/actions/reports"
import { toast } from "sonner"

const reportTypes = [
  {
    id: "enrollment",
    title: "Monthly Enrollment Report",
    description: "Student enrollments and course registrations",
    icon: Users,
  },
  {
    id: "financial",
    title: "Financial Summary",
    description: "Revenue, payments, and outstanding balances",
    icon: DollarSign,
  },
  {
    id: "attendance",
    title: "Attendance Report",
    description: "Student attendance across all courses",
    icon: Calendar,
  },
  {
    id: "performance",
    title: "Course Performance",
    description: "Course completion rates and student progress",
    icon: TrendingUp,
  },
  {
    id: "instructor",
    title: "Instructor Summary",
    description: "Instructor workload and student feedback",
    icon: FileText,
  },
]

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [generating, setGenerating] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const result = await getReports()
      if (result.data) {
        setReports(result.data)
      }
    } catch (err) {
      console.error("Failed to load reports:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (reportType: string, title: string) => {
    setGenerating(reportType)
    try {
      // Get report data
      const { data: reportData, error: dataError } = await getReportData(reportType)
      
      if (dataError) {
        toast.error("Failed to fetch report data", { description: dataError.message })
        return
      }

      // Generate report record
      const { data: report, error } = await generateReport({
        title,
        description: reportTypes.find(r => r.id === reportType)?.description,
        report_type: reportType,
        parameters: {},
      })

      if (error) {
        toast.error("Failed to generate report", { description: error.message })
        return
      }

      // Convert data to CSV
      let csvContent = ""
      if (reportData && Array.isArray(reportData) && reportData.length > 0) {
        const headers = Object.keys(reportData[0]).join(",")
        const rows = reportData.map((row: any) =>
          Object.values(row).map((val: any) => {
            // Handle nested objects
            if (typeof val === 'object' && val !== null) {
              return JSON.stringify(val)
            }
            return `"${val || ''}"`
          }).join(",")
        )
        csvContent = [headers, ...rows].join("\n")
      }

      // Download CSV
      if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      toast.success("Report generated and downloaded successfully")
      loadReports()
    } catch (err) {
      toast.error("Failed to generate report")
    } finally {
      setGenerating(null)
    }
  }

  const getLastGenerated = (reportType: string) => {
    const report = reports.find(r => r.report_type === reportType)
    if (report) {
      return new Date(report.generated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
    return "Never"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and download academy reports
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#0a0a5c]">{reports.length}</p>
            <p className="text-sm text-muted-foreground">Reports Generated</p>
            <p className="text-xs text-muted-foreground mt-1">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#0a0a5c]">{reports.length}</p>
            <p className="text-sm text-muted-foreground">Data Exports</p>
            <p className="text-xs text-muted-foreground mt-1">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#0a0a5c]">Today</p>
            <p className="text-sm text-muted-foreground">Last Backup</p>
            <p className="text-xs text-muted-foreground mt-1">2:00 AM</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportTypes.map((report) => {
              const ReportIcon = report.icon
              const isGenerating = generating === report.id
              return (
                <Card key={report.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-[#3abafb]/10 flex items-center justify-center flex-shrink-0">
                        <ReportIcon className="h-6 w-6 text-[#3abafb]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0a0a5c]">
                          {report.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last generated: {getLastGenerated(report.id)}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                            onClick={() => handleGenerate(report.id, report.title)}
                            disabled={isGenerating}
                          >
                            {isGenerating ? "Generating..." : "Generate New"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
