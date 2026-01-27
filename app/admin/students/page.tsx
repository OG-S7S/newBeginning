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
  Mail,
  UserX,
  Trash2,
} from "lucide-react"
import { getStudents, getStudentStats, deleteStudent } from "@/lib/supabase/actions/students"
import { getPrograms } from "@/lib/supabase/actions/programs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  full_name: string
  email: string
  age?: number
  phone?: string
  parent_email?: string
  parent_phone?: string
  status: string
  join_date?: string
  programs?: string[]
  enrollments?: any[]
}

export default function AdminStudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    graduated: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [studentsResult, statsResult, programsResult] = await Promise.all([
        getStudents(),
        getStudentStats(),
        getPrograms(),
      ])

      if (studentsResult.data) {
        setStudents(studentsResult.data as Student[])
      }
      if (statsResult.data) {
        setStats(statsResult.data)
      }
      if (programsResult.data) {
        setPrograms(programsResult.data)
      }
    } catch (err) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student? This will also delete their account.")) {
      return
    }

    try {
      const { error } = await deleteStudent(id)
      if (error) {
        toast.error("Failed to delete student", { description: error.message })
      } else {
        toast.success("Student deleted successfully")
        loadData()
      }
    } catch (err) {
      toast.error("Failed to delete student")
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage student records and enrollments
          </p>
        </div>
        <Button
          className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
          onClick={() => {
            setEditingStudent(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#0a0a5c]">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
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
            <p className="text-2xl font-bold text-[#ffb800]">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#3abafb]">{stats.graduated}</p>
            <p className="text-sm text-muted-foreground">Graduated</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Students ({filteredStudents.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "No students found matching your search." : "No students yet. Add your first student!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Programs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#3abafb]/10 flex items-center justify-center">
                          <span className="font-medium text-[#0a0a5c]">
                            {student.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) || "U"}
                          </span>
                        </div>
                        <span className="font-medium">{student.full_name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.age ? `${student.age} years` : "-"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{student.email}</p>
                        {student.phone && (
                          <p className="text-xs text-muted-foreground">{student.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.programs && student.programs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.programs.slice(0, 2).map((program, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs bg-[#0a0a5c]/10"
                            >
                              {program}
                            </Badge>
                          ))}
                          {student.programs.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{student.programs.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No programs</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          student.status === "active"
                            ? "bg-green-100 text-green-700"
                            : student.status === "graduated"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.join_date
                        ? new Date(student.join_date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
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
                              // Open student portal in new tab or navigate
                              window.open(`/portal/dashboard?view=${student.id}`, '_blank')
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Student Portal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingStudent(student)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(student.id)}
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
      <StudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        student={editingStudent}
        programs={programs}
        onSuccess={loadData}
      />
    </div>
  )
}

// Student Dialog Component
function StudentDialog({
  open,
  onOpenChange,
  student,
  programs,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
  programs: any[]
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    age: "",
    parent_email: "",
    parent_phone: "",
    status: "active",
    join_date: new Date().toISOString().split("T")[0],
    program_ids: [] as string[],
    notes: "",
    password: "",
  })

  useEffect(() => {
    if (student) {
      setFormData({
        email: student.email || "",
        full_name: student.full_name || "",
        phone: student.phone || "",
        age: student.age?.toString() || "",
        parent_email: student.parent_email || "",
        parent_phone: student.parent_phone || "",
        status: student.status || "active",
        join_date: student.join_date ? new Date(student.join_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        program_ids: student.enrollments?.map((e: any) => e.program_id).filter(Boolean) || [],
        notes: "",
        password: "",
      })
    } else {
      setFormData({
        email: "",
        full_name: "",
        phone: "",
        age: "",
        parent_email: "",
        parent_phone: "",
        status: "active",
        join_date: new Date().toISOString().split("T")[0],
        program_ids: [],
        notes: "",
        password: "",
      })
    }
  }, [student, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { createStudent, updateStudent } = await import("@/lib/supabase/actions/students")

      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        program_ids: formData.program_ids,
      }

      if (student) {
        const { error } = await updateStudent(student.id, submitData)
        if (error) {
          toast.error("Failed to update student", { description: error.message })
        } else {
          toast.success("Student updated successfully")
          onOpenChange(false)
          onSuccess()
        }
      } else {
        const { error } = await createStudent(submitData)
        if (error) {
          toast.error("Failed to create student", { description: error.message })
        } else {
          toast.success("Student created successfully")
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

  const toggleProgram = (programId: string) => {
    setFormData(prev => ({
      ...prev,
      program_ids: prev.program_ids.includes(programId)
        ? prev.program_ids.filter(id => id !== programId)
        : [...prev.program_ids, programId]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student" : "Create New Student"}</DialogTitle>
          <DialogDescription>
            {student ? "Update student information below." : "Fill in the details to create a new student account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={!!student}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                min="4"
                max="18"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_email">Parent Email</Label>
              <Input
                id="parent_email"
                type="email"
                value={formData.parent_email}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_phone">Parent Phone</Label>
              <Input
                id="parent_phone"
                value={formData.parent_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Programs</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-lg p-4 max-h-48 overflow-y-auto">
              {programs.map((program) => (
                <label
                  key={program.id}
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.program_ids.includes(program.id)}
                    onChange={() => toggleProgram(program.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{program.title}</span>
                </label>
              ))}
            </div>
            {programs.length === 0 && (
              <p className="text-sm text-muted-foreground">No programs available. Create programs first.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="join_date">Join Date</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                onChange={(e) => setFormData(prev => ({ ...prev, join_date: e.target.value }))}
              />
            </div>
            {!student && (
              <div className="space-y-2">
                <Label htmlFor="password">Initial Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Leave empty for auto-generated"
                />
                <p className="text-xs text-muted-foreground">
                  If empty, a random password will be generated. User should reset it on first login.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
              {loading ? "Saving..." : student ? "Update Student" : "Create Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
