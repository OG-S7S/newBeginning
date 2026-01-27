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
  Mail,
  Phone,
  BookOpen,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { getInstructors, getInstructorStats, deleteInstructor } from "@/lib/supabase/actions/instructors"
import { getPrograms } from "@/lib/supabase/actions/programs"
import { toast } from "sonner"

interface Instructor {
  id: string
  profile_id: string
  title: string
  phone?: string
  specializations?: string[]
  status: string
  join_date?: string
  profile?: {
    id: string
    email: string
    full_name: string
  }
  programs?: string[]
  program_ids?: string[]
  instructor_assignments?: any[]
  courses_count?: number
  students_count?: number
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalCourses: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [instructorsResult, statsResult, programsResult] = await Promise.all([
        getInstructors(),
        getInstructorStats(),
        getPrograms(),
      ])

      if (instructorsResult.data) {
        setInstructors(instructorsResult.data as Instructor[])
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
    if (!confirm("Are you sure you want to delete this instructor? This will also delete their account.")) {
      return
    }

    try {
      const { error } = await deleteInstructor(id)
      if (error) {
        toast.error("Failed to delete instructor", { description: error.message })
      } else {
        toast.success("Instructor deleted successfully")
        loadData()
      }
    } catch (err) {
      toast.error("Failed to delete instructor")
    }
  }

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Instructors</h1>
          <p className="text-muted-foreground mt-1">
            Manage your teaching staff
          </p>
        </div>
        <Button
          className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
          onClick={() => {
            setEditingInstructor(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Instructor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#0a0a5c]">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Instructors</p>
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
            <p className="text-2xl font-bold text-[#3abafb]">{stats.totalCourses}</p>
            <p className="text-sm text-muted-foreground">Total Program Assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-[#ffb800]">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search instructors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Instructors Grid */}
      {filteredInstructors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchTerm ? "No instructors found matching your search." : "No instructors yet. Add your first instructor!"}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredInstructors.map((instructor) => (
            <Card key={instructor.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0a0a5c] to-[#3abafb] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {instructor.profile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "I"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#0a0a5c] text-lg">
                          {instructor.profile?.full_name || "Unknown"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {instructor.title}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingInstructor(instructor)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(instructor.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#3abafb]" />
                        {instructor.profile?.email || "No email"}
                      </p>
                      {instructor.phone && (
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#3abafb]" />
                          {instructor.phone}
                        </p>
                      )}
                    </div>
                    {instructor.specializations && instructor.specializations.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {instructor.specializations.map((spec, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-[#0a0a5c]/10"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {instructor.programs && instructor.programs.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Programs:</p>
                        <div className="flex flex-wrap gap-1">
                          {instructor.programs.map((program, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {program}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{instructor.courses_count || 0} programs</span>
                      </div>
                      <Badge
                        className={
                          instructor.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {instructor.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <InstructorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        instructor={editingInstructor}
        programs={programs}
        onSuccess={loadData}
      />
    </div>
  )
}

// Instructor Dialog Component
function InstructorDialog({
  open,
  onOpenChange,
  instructor,
  programs,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructor: Instructor | null
  programs: any[]
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    title: "",
    phone: "",
    specializations: [] as string[],
    status: "active",
    join_date: new Date().toISOString().split("T")[0],
    program_ids: [] as string[],
    specializationInput: "",
    password: "",
  })

  useEffect(() => {
    if (instructor) {
      // Get program IDs from instructor assignments or program_ids field
      const programIds: string[] = instructor.program_ids || []
      if (instructor.instructor_assignments && programIds.length === 0) {
        programIds.push(...(instructor.instructor_assignments.map((a: any) => a.program_id || a.programs?.id).filter(Boolean)))
      }
      
      setFormData({
        email: instructor.profile?.email || "",
        full_name: instructor.profile?.full_name || "",
        title: instructor.title || "",
        phone: instructor.phone || "",
        specializations: instructor.specializations || [],
        status: instructor.status || "active",
        join_date: instructor.join_date ? new Date(instructor.join_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        program_ids: programIds,
        specializationInput: "",
        password: "",
      })
    } else {
      setFormData({
        email: "",
        full_name: "",
        title: "",
        phone: "",
        specializations: [],
        status: "active",
        join_date: new Date().toISOString().split("T")[0],
        program_ids: [],
        specializationInput: "",
        password: "",
      })
    }
  }, [instructor, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { createInstructor, updateInstructor } = await import("@/lib/supabase/actions/instructors")

      const submitData = {
        ...formData,
        program_ids: formData.program_ids,
      }

      if (instructor) {
        const { error } = await updateInstructor(instructor.id, submitData)
        if (error) {
          toast.error("Failed to update instructor", { description: error.message })
        } else {
          toast.success("Instructor updated successfully")
          onOpenChange(false)
          onSuccess()
        }
      } else {
        const { error } = await createInstructor(submitData)
        if (error) {
          toast.error("Failed to create instructor", { description: error.message })
        } else {
          toast.success("Instructor created successfully")
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

  const addSpecialization = () => {
    if (formData.specializationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, prev.specializationInput.trim()],
        specializationInput: "",
      }))
    }
  }

  const removeSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }))
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
          <DialogTitle>{instructor ? "Edit Instructor" : "Create New Instructor"}</DialogTitle>
          <DialogDescription>
            {instructor ? "Update instructor information below." : "Fill in the details to create a new instructor account."}
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
                disabled={!!instructor}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Senior Programming Instructor"
                required
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
          </div>

          <div className="space-y-2">
            <Label>Specializations</Label>
            <div className="flex gap-2">
              <Input
                value={formData.specializationInput}
                onChange={(e) => setFormData(prev => ({ ...prev, specializationInput: e.target.value }))}
                placeholder="Add specialization..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSpecialization()
                  }
                }}
              />
              <Button type="button" onClick={addSpecialization} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="join_date">Join Date</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                onChange={(e) => setFormData(prev => ({ ...prev, join_date: e.target.value }))}
              />
            </div>
          </div>

          {!instructor && (
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
              {loading ? "Saving..." : instructor ? "Update Instructor" : "Create Instructor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
