"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Clock, MapPin, Users, Trash2, Edit } from "lucide-react"
import { getSessions, getSessionStats, deleteSession } from "@/lib/supabase/actions/sessions"
import { getCourses } from "@/lib/supabase/actions/courses"
import { getInstructors } from "@/lib/supabase/actions/instructors"
import { toast } from "sonner"

const weekDays = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

interface Session {
  id: string
  course_id: string
  instructor_id?: string
  day_of_week: number
  start_time: string
  end_time: string
  room?: string
  max_capacity: number
  current_attendance: number
  courses?: { id: string; name: string; level: string }
  instructors?: { id: string; profiles?: { full_name: string } }
}

export default function AdminSchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([])
  const [stats, setStats] = useState({
    weeklySessions: 0,
    activeInstructors: 0,
    rooms: 0,
    totalAttendance: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [sessionsResult, statsResult, coursesResult, instructorsResult] = await Promise.all([
        getSessions(),
        getSessionStats(),
        getCourses(),
        getInstructors(),
      ])

      if (sessionsResult.data) {
        setSessions(sessionsResult.data as Session[])
      }
      if (statsResult.data) {
        setStats(statsResult.data)
      }
      if (coursesResult.data) {
        setCourses(coursesResult.data)
      }
      if (instructorsResult.data) {
        setInstructors(instructorsResult.data)
      }
    } catch (err) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return
    }

    try {
      const { error } = await deleteSession(id)
      if (error) {
        toast.error("Failed to delete session", { description: error.message })
      } else {
        toast.success("Session deleted successfully")
        loadData()
      }
    } catch (err) {
      toast.error("Failed to delete session")
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Intermediate":
        return "bg-[#3abafb]/10 text-[#0a0a5c]"
      case "Advanced":
        return "bg-[#ffb800]/10 text-[#ffb800]"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getSessionsByDay = (dayOfWeek: number) => {
    return sessions.filter(s => s.day_of_week === dayOfWeek)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Manage weekly class schedule
          </p>
        </div>
        <Button
          className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
          onClick={() => {
            setEditingSession(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#0a0a5c]">{stats.weeklySessions}</p>
            <p className="text-sm text-muted-foreground">Weekly Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#3abafb]">{stats.activeInstructors}</p>
            <p className="text-sm text-muted-foreground">Active Instructors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#ffb800]">{stats.rooms}</p>
            <p className="text-sm text-muted-foreground">Rooms/Labs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{stats.totalAttendance}</p>
            <p className="text-sm text-muted-foreground">Weekly Attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {weekDays.map((day) => {
              const daySessions = getSessionsByDay(day.value)
              return (
                <div key={day.value} className="border rounded-lg overflow-hidden">
                  <div className="bg-[#0a0a5c] text-white px-4 py-2 font-medium">
                    {day.label}
                  </div>
                  <div className="p-4">
                    {daySessions.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {daySessions.map((session) => (
                          <div
                            key={session.id}
                            className="bg-[#f0f9ff] rounded-lg p-3 border border-[#3abafb]/20 relative group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-[#0a0a5c]">
                                {session.courses?.name || "Unknown Course"}
                              </h4>
                              <div className="flex items-center gap-2">
                                {session.courses?.level && (
                                  <Badge className={getLevelColor(session.courses.level)}>
                                    {session.courses.level}
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDelete(session.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {session.start_time} - {session.end_time}
                              </p>
                              {session.room && (
                                <p className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3" />
                                  {session.room}
                                </p>
                              )}
                              <p className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                {session.current_attendance || 0} / {session.max_capacity} students
                              </p>
                            </div>
                            <p className="text-sm mt-2 text-[#0a0a5c]">
                              {session.instructors?.profiles?.full_name || "TBD"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic py-2">
                        No sessions scheduled
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <SessionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        session={editingSession}
        courses={courses}
        instructors={instructors}
        onSuccess={loadData}
      />
    </div>
  )
}

// Session Dialog Component
function SessionDialog({
  open,
  onOpenChange,
  session,
  courses,
  instructors,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session | null
  courses: any[]
  instructors: any[]
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    course_id: "",
    instructor_id: "",
    day_of_week: "1",
    start_time: "",
    end_time: "",
    room: "",
    max_capacity: "20",
  })

  useEffect(() => {
    if (session) {
      setFormData({
        course_id: session.course_id || "",
        instructor_id: session.instructor_id || "",
        day_of_week: session.day_of_week.toString(),
        start_time: session.start_time || "",
        end_time: session.end_time || "",
        room: session.room || "",
        max_capacity: session.max_capacity?.toString() || "20",
      })
    } else {
      setFormData({
        course_id: "",
        instructor_id: "",
        day_of_week: "1",
        start_time: "",
        end_time: "",
        room: "",
        max_capacity: "20",
      })
    }
  }, [session, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { createSession, updateSession } = await import("@/lib/supabase/actions/sessions")

      const submitData = {
        course_id: formData.course_id,
        instructor_id: formData.instructor_id || undefined,
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room || undefined,
        max_capacity: parseInt(formData.max_capacity),
      }

      if (session) {
        const { error } = await updateSession(session.id, submitData)
        if (error) {
          toast.error("Failed to update session", { description: error.message })
        } else {
          toast.success("Session updated successfully")
          onOpenChange(false)
          onSuccess()
        }
      } else {
        const { error } = await createSession(submitData)
        if (error) {
          toast.error("Failed to create session", { description: error.message })
        } else {
          toast.success("Session created successfully")
          onOpenChange(false)
          onSuccess()
        }
      }
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{session ? "Edit Session" : "Create New Session"}</DialogTitle>
          <DialogDescription>
            {session ? "Update session information below." : "Fill in the details to create a new session."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course_id">Course *</Label>
              <Select
                value={formData.course_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day_of_week">Day of Week *</Label>
              <Select
                value={formData.day_of_week}
                onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_capacity">Max Capacity</Label>
              <Input
                id="max_capacity"
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, max_capacity: e.target.value }))}
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructor_id">Instructor (Optional)</Label>
              <Select
                value={formData.instructor_id || "none"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, instructor_id: value === "none" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.profile?.full_name || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room (Optional)</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                placeholder="e.g., Room A, Lab 1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
              {loading ? "Saving..." : session ? "Update Session" : "Create Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
