"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Calendar, Clock, MapPin, BookOpen, FileText, 
  Trophy, ArrowRight, Bell, CheckCircle2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { 
  getStudentProfile, 
  getStudentUpcomingSessions, 
  getStudentAttendanceStats,
  getStudentEnrollments 
} from "@/lib/supabase/actions/student-portal"

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function StudentDashboard() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const viewStudentId = searchParams.get('view') // For admin viewing student portal
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [upcomingSession, setUpcomingSession] = useState<any>(null)
  const [attendanceStats, setAttendanceStats] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])

  useEffect(() => {
    const studentId = viewStudentId || user?.id
    if (studentId) {
      loadData(studentId)
    }
  }, [user, viewStudentId])

  const loadData = async (studentId: string) => {
    if (!studentId) return
    
    setLoading(true)
    try {
      const [profileResult, sessionResult, attendanceResult, enrollmentsResult] = await Promise.all([
        getStudentProfile(studentId),
        getStudentUpcomingSessions(studentId),
        getStudentAttendanceStats(studentId),
        getStudentEnrollments(studentId),
      ])

      if (profileResult.data) {
        setProfile(profileResult.data)
      }

      if (sessionResult.data) {
        const session = sessionResult.data
        // Format session data
        const dayName = dayNames[session.day_of_week === 0 ? 6 : session.day_of_week - 1] || 'Unknown'
        const startTime = session.start_time ? new Date(`2000-01-01T${session.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''
        const endTime = session.end_time ? new Date(`2000-01-01T${session.end_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''
        
        setUpcomingSession({
          date: dayName,
          time: `${startTime} - ${endTime}`,
          room: session.room || 'TBD',
          class: session.courses?.name || 'No course',
          level: session.courses?.level || '',
          instructor: session.instructors?.profiles?.full_name || 'TBD',
        })
      }

      if (attendanceResult.data) {
        setAttendanceStats(attendanceResult.data)
      }

      if (enrollmentsResult.data) {
        setEnrollments(enrollmentsResult.data)
      }
    } catch (err) {
      console.error('Error loading student data:', err)
    } finally {
      setLoading(false)
    }
  }

  const quickStats = [
    { 
      label: "Sessions Attended", 
      value: attendanceStats ? `${attendanceStats.present}/${attendanceStats.total || 0}` : "0/0", 
      icon: Calendar 
    },
    { 
      label: "Attendance Rate", 
      value: attendanceStats ? `${attendanceStats.attendanceRate}%` : "0%", 
      icon: FileText 
    },
    { 
      label: "Active Courses", 
      value: enrollments.filter(e => e.status === 'active').length.toString(), 
      icon: Trophy 
    },
  ]

  const recentAnnouncements: any[] = [] // TODO: Implement announcements
  const pendingTasks: any[] = [] // TODO: Implement tasks

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c]"></div>
      </div>
    )
  }
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0a0a5c]">
          Welcome back, {profile?.full_name || user?.email || 'Student'}!
        </h1>
        <p className="text-[#4a4a8a]">Here&apos;s what&apos;s happening with your learning journey.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#3abafb]/10 rounded-xl flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-[#3abafb]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0a0a5c]">{stat.value}</div>
                <div className="text-sm text-[#4a4a8a]">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Session */}
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="bg-[#0a0a5c] text-white p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#3abafb]" />
                <span className="font-semibold">Next Session</span>
              </div>
            </div>
            <CardContent className="p-6">
              {upcomingSession ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-[#3abafb]" />
                      <span className="text-[#4a4a8a]">{upcomingSession.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#3abafb]" />
                      <span className="text-[#4a4a8a]">{upcomingSession.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#3abafb]" />
                      <span className="text-[#4a4a8a]">Room: {upcomingSession.room}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-[#4a4a8a]">Course</div>
                      <div className="font-medium text-[#0a0a5c]">{upcomingSession.class} {upcomingSession.level ? `- ${upcomingSession.level}` : ''}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#4a4a8a]">Instructor</div>
                      <div className="font-medium text-[#0a0a5c]">{upcomingSession.instructor}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[#4a4a8a]">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-[#3abafb]" />
                  <p>No upcoming sessions scheduled.</p>
                  <p className="text-sm mt-2">Check back later or contact your instructor.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-[#0a0a5c] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#ffb800]" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-[#f0f9ff] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${task.type === "quiz" ? "bg-[#3abafb]" : "bg-[#ffb800]"}`} />
                    <div>
                      <div className="font-medium text-[#0a0a5c]">{task.title}</div>
                      <div className="text-sm text-[#4a4a8a]">Due: {task.due}</div>
                    </div>
                  </div>
                  <Link href={task.type === "quiz" ? "/portal/exams" : "/portal/curriculum"}>
                    <Button size="sm" className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
                      Start
                    </Button>
                  </Link>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-8 text-[#4a4a8a]">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-[#10b981]" />
                  <p>All caught up! No pending tasks.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-[#0a0a5c]">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/portal/curriculum">
                <Button variant="outline" className="w-full justify-between border-[#e0e7ff] text-[#0a0a5c] hover:bg-[#f0f9ff] bg-transparent">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Curriculum Library
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portal/exams">
                <Button variant="outline" className="w-full justify-between border-[#e0e7ff] text-[#0a0a5c] hover:bg-[#f0f9ff] bg-transparent">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Take a Quiz
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portal/progress">
                <Button variant="outline" className="w-full justify-between border-[#e0e7ff] text-[#0a0a5c] hover:bg-[#f0f9ff] bg-transparent">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    View Progress
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#0a0a5c] flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#3abafb]" />
                Announcements
              </CardTitle>
              <Link href="/portal/announcements" className="text-sm text-[#3abafb] hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border-l-2 border-[#3abafb] pl-3">
                  <div className="font-medium text-[#0a0a5c] text-sm">{announcement.title}</div>
                  <div className="text-xs text-[#4a4a8a] mb-1">{announcement.date}</div>
                  <p className="text-sm text-[#4a4a8a] line-clamp-2">{announcement.preview}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
