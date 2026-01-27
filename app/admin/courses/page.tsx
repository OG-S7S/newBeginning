"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Users,
  Trash2,
} from "lucide-react"
import { getCourses, getCourseStats, deleteCourse } from "@/lib/supabase/actions/courses"
import { getPrograms } from "@/lib/supabase/actions/programs"
import { getInstructors } from "@/lib/supabase/actions/instructors"
import { toast } from "sonner"

interface Course {
  id: string
  name: string
  program_id?: string
  level: string
  age_range_min: number
  age_range_max: number
  duration_months: number
  price_per_month: number
  instructor_id?: string
  max_students: number
  current_students: number
  status: string
  description?: string
  programs?: { id: string; title: string }
  instructors?: { id: string; profiles?: { full_name: string } }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    totalEnrollments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [coursesResult, statsResult, programsResult, instructorsResult] = await Promise.all([
        getCourses(),
        getCourseStats(),
        getPrograms(),
        getInstructors(),
      ])

      if (coursesResult.data) {
        setCourses(coursesResult.data as Course[])
      }
      if (statsResult.data) {
        setStats(statsResult.data)
      }
      if (programsResult.data) {
        setPrograms(programsResult.data)
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
    if (!confirm("Are you sure you want to delete this course?")) {
      return
    }

    try {
      const { error } = await deleteCourse(id)
      if (error) {
        toast.error("Failed to delete course", { description: error.message })
      } else {
        toast.success("Course deleted successfully")
        loadData()
      }
    } catch (err) {
      toast.error("Failed to delete course")
    }
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage courses and curriculum
          </p>
        </div>
        <Button
          className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
          onClick={() => {
            setEditingCourse(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#0a0a5c]">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#ffb800]">{stats.draft}</p>
            <p className="text-sm text-muted-foreground">Draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#3abafb]">{stats.totalEnrollments}</p>
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "No courses found matching your search." : "No courses yet. Create your first course!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Age Range</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          course.level === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : course.level === "Intermediate"
                            ? "bg-[#3abafb]/10 text-[#0a0a5c]"
                            : "bg-[#ffb800]/10 text-[#ffb800]"
                        }
                      >
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.age_range_min}-{course.age_range_max} years</TableCell>
                    <TableCell>{course.duration_months} months</TableCell>
                    <TableCell>{course.price_per_month.toFixed(0)} EGP/month</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {course.current_students || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.instructors?.profiles?.full_name || "TBD"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          course.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCourse(course)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <CourseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        course={editingCourse}
        programs={programs}
        instructors={instructors}
        onSuccess={loadData}
      />
    </div>
  )
}

// Course Dialog Component
function CourseDialog({
  open,
  onOpenChange,
  course,
  programs,
  instructors,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  programs: any[]
  instructors: any[]
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    program_id: "",
    level: "Beginner",
    age_range_min: "",
    age_range_max: "",
    duration_months: "",
    price_per_month: "",
    instructor_id: "",
    max_students: "20",
    status: "draft",
    description: "",
  })

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || "",
        program_id: course.program_id || "",
        level: course.level || "Beginner",
        age_range_min: course.age_range_min?.toString() || "",
        age_range_max: course.age_range_max?.toString() || "",
        duration_months: course.duration_months?.toString() || "",
        price_per_month: course.price_per_month?.toString() || "",
        instructor_id: course.instructor_id || "",
        max_students: course.max_students?.toString() || "20",
        status: course.status || "draft",
        description: course.description || "",
      })
    } else {
      setFormData({
        name: "",
        program_id: "",
        level: "Beginner",
        age_range_min: "",
        age_range_max: "",
        duration_months: "",
        price_per_month: "",
        instructor_id: "",
        max_students: "20",
        status: "draft",
        description: "",
      })
    }
  }, [course, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { createCourse, updateCourse } = await import("@/lib/supabase/actions/courses")

      const submitData = {
        name: formData.name,
        program_id: formData.program_id || undefined,
        level: formData.level,
        age_range_min: parseInt(formData.age_range_min),
        age_range_max: parseInt(formData.age_range_max),
        duration_months: parseInt(formData.duration_months),
        price_per_month: parseFloat(formData.price_per_month),
        instructor_id: formData.instructor_id || undefined,
        max_students: parseInt(formData.max_students),
        status: formData.status,
        description: formData.description || undefined,
      }

      if (course) {
        const { error } = await updateCourse(course.id, submitData)
        if (error) {
          toast.error("Failed to update course", { description: error.message })
        } else {
          toast.success("Course updated successfully")
          onOpenChange(false)
          onSuccess()
        }
      } else {
        const { error } = await createCourse(submitData)
        if (error) {
          toast.error("Failed to create course", { description: error.message })
        } else {
          toast.success("Course created successfully")
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Create New Course"}</DialogTitle>
          <DialogDescription>
            {course ? "Update course information below." : "Fill in the details to create a new course."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program_id">Program (Optional)</Label>
              <Select
                value={formData.program_id || "none"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, program_id: value === "none" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age_range_min">Min Age *</Label>
              <Input
                id="age_range_min"
                type="number"
                value={formData.age_range_min}
                onChange={(e) => setFormData(prev => ({ ...prev, age_range_min: e.target.value }))}
                required
                min="4"
                max="18"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age_range_max">Max Age *</Label>
              <Input
                id="age_range_max"
                type="number"
                value={formData.age_range_max}
                onChange={(e) => setFormData(prev => ({ ...prev, age_range_max: e.target.value }))}
                required
                min="4"
                max="18"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_months">Duration (months) *</Label>
              <Input
                id="duration_months"
                type="number"
                value={formData.duration_months}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_months: e.target.value }))}
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_per_month">Price/month (EGP) *</Label>
              <Input
                id="price_per_month"
                type="number"
                step="0.01"
                value={formData.price_per_month}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_month: e.target.value }))}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_students">Max Students</Label>
              <Input
                id="max_students"
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData(prev => ({ ...prev, max_students: e.target.value }))}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
              {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
