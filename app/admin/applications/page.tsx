"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  BookOpen,
} from "lucide-react"
import { getApplications, getApplicationStats, updateApplicationStatus } from "@/lib/supabase/actions/applications"
import { toast } from "sonner"

interface Application {
  id: string
  parent_name: string
  parent_email: string
  parent_phone: string
  student_name: string
  student_age: number
  student_grade?: string
  school_name?: string
  program_id?: string
  branch?: string
  application_type: string
  notes?: string
  status: string
  created_at: string
  programs?: { id: string; title: string }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [appsResult, statsResult] = await Promise.all([
        getApplications(),
        getApplicationStats(),
      ])

      console.log('Applications result:', appsResult)
      console.log('Stats result:', statsResult)

      if (appsResult.error) {
        console.error('Error loading applications:', appsResult.error)
        toast.error("Failed to load applications", { 
          description: appsResult.error.message || "Please check the console for details" 
        })
      }

      if (appsResult.data) {
        console.log('Setting applications:', appsResult.data.length)
        setApplications(appsResult.data as Application[])
      } else {
        console.log('No applications data returned')
        setApplications([])
      }

      if (statsResult.data) {
        setStats(statsResult.data)
      }
    } catch (err: any) {
      console.error('Error in loadData:', err)
      toast.error("Failed to load data", { 
        description: err?.message || "An unexpected error occurred" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected', reviewNotes?: string) => {
    try {
      const { error } = await updateApplicationStatus(id, status, reviewNotes)
      if (error) {
        toast.error(`Failed to ${status} application`, { description: error.message })
      } else {
        toast.success(`Application ${status} successfully`)
        loadData()
        setSelectedApp(null)
      }
    } catch (err) {
      toast.error("An error occurred")
    }
  }

  const pendingApps = applications.filter((app) => app.status === "pending")
  const approvedApps = applications.filter((app) => app.status === "approved")
  const rejectedApps = applications.filter((app) => app.status === "rejected")

  const filterApps = (apps: Application[]) =>
    apps.filter(
      (app) =>
        app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.parent_email.toLowerCase().includes(searchTerm.toLowerCase())
    )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c]"></div>
      </div>
    )
  }

  const ApplicationCard = ({ app }: { app: Application }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#0a0a5c]">{app.student_name}</h3>
              <Badge
                variant="secondary"
                className={
                  app.application_type === "trial"
                    ? "bg-[#3abafb]/10 text-[#3abafb]"
                    : "bg-[#ffb800]/10 text-[#ffb800]"
                }
              >
                {app.application_type === "trial" ? "Free Trial" : "Enrollment"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Age: {app.student_age} years | {app.programs?.title || "No program selected"}
            </p>
            <p className="text-sm text-muted-foreground">
              Parent: {app.parent_name}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Applied: {new Date(app.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApp(app)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Application Details</DialogTitle>
                </DialogHeader>
                {selectedApp && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#3abafb]" />
                        <span className="font-medium">Student:</span>
                        <span>
                          {selectedApp.student_name} ({selectedApp.student_age} years)
                        </span>
                      </div>
                      {selectedApp.student_grade && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Grade:</span>
                          <span>{selectedApp.student_grade}</span>
                        </div>
                      )}
                      {selectedApp.school_name && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">School:</span>
                          <span>{selectedApp.school_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#3abafb]" />
                        <span className="font-medium">Parent:</span>
                        <span>{selectedApp.parent_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#3abafb]" />
                        <span className="font-medium">Email:</span>
                        <span>{selectedApp.parent_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#3abafb]" />
                        <span className="font-medium">Phone:</span>
                        <span>{selectedApp.parent_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#3abafb]" />
                        <span className="font-medium">Program:</span>
                        <span>{selectedApp.programs?.title || "Not specified"}</span>
                      </div>
                      {selectedApp.branch && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Branch:</span>
                          <span>{selectedApp.branch}</span>
                        </div>
                      )}
                    </div>
                    {selectedApp.notes && (
                      <div>
                        <p className="font-medium mb-1">Additional Notes:</p>
                        <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                          {selectedApp.notes}
                        </p>
                      </div>
                    )}
                    {selectedApp.status === "pending" && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleStatusUpdate(selectedApp.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
            {app.status === "pending" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleStatusUpdate(app.id, 'approved')}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => handleStatusUpdate(app.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a5c]">Applications</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage student applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[#ffb800]/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#ffb800]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a5c]">
                {stats.pending}
              </p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a5c]">
                {stats.approved}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a0a5c]">
                {stats.rejected}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Applications Tabs */}
      <Tabs defaultValue="pending">
        <TabsList className="bg-[#f0f9ff]">
          <TabsTrigger value="pending" className="data-[state=active]:bg-white">
            Pending ({pendingApps.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white">
            Approved ({approvedApps.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-white">
            Rejected ({rejectedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {filterApps(pendingApps).map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
          {filterApps(pendingApps).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No pending applications found
            </p>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {filterApps(approvedApps).map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
          {filterApps(approvedApps).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No approved applications found
            </p>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {filterApps(rejectedApps).map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
          {filterApps(rejectedApps).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No rejected applications found
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
