"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, MoreHorizontal, Edit, Trash2, Search, Eye } from "lucide-react"
import { getPrograms, deleteProgram } from "@/lib/supabase/actions/programs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Program {
  id: string
  title: string
  ages: string
  duration: string
  class_size: string
  description: string
  icon_name?: string
  color: string
  is_active: boolean
  display_order: number
  highlights?: string[]
  outcomes?: string[]
  projects?: string[]
}

export default function AdminProgramsPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    setLoading(true)
    try {
      const { data, error } = await getPrograms()
      if (error) {
        toast.error("Failed to load programs", { description: error.message })
      } else {
        setPrograms(data || [])
      }
    } catch (err) {
      toast.error("Failed to load programs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await deleteProgram(id)
      if (error) {
        toast.error("Failed to delete program", { description: error.message })
      } else {
        toast.success("Program deleted successfully")
        loadPrograms()
      }
    } catch (err) {
      toast.error("Failed to delete program")
    }
  }

  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.ages.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Programs</h1>
          <p className="text-muted-foreground mt-1">
            Manage educational programs and their details
          </p>
        </div>
        <Button
          className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
          onClick={() => {
            setEditingProgram(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Programs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Programs ({filteredPrograms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "No programs found matching your search." : "No programs yet. Create your first program!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Ages</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.title}</TableCell>
                    <TableCell>{program.ages}</TableCell>
                    <TableCell>{program.duration}</TableCell>
                    <TableCell>
                      <Badge variant={program.is_active ? "default" : "secondary"}>
                        {program.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{program.display_order}</TableCell>
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
                              router.push(`/admin/programs/${program.id}`)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProgram(program)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(program.id)}
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
      <ProgramDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        program={editingProgram}
        onSuccess={loadPrograms}
      />
    </div>
  )
}

// Program Dialog Component
function ProgramDialog({
  open,
  onOpenChange,
  program,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: Program | null
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    ages: "",
    duration: "",
    class_size: "",
    description: "",
    icon_name: "Rocket",
    color: "bg-[#ffb800]",
    is_active: true,
    display_order: 0,
    highlights: [""],
    outcomes: [""],
    projects: [""],
  })

  useEffect(() => {
    if (program) {
      setFormData({
        id: program.id,
        title: program.title,
        ages: program.ages,
        duration: program.duration,
        class_size: program.class_size,
        description: program.description,
        icon_name: program.icon_name || "Rocket",
        color: program.color,
        is_active: program.is_active,
        display_order: program.display_order,
        highlights: program.highlights && program.highlights.length > 0 ? program.highlights : [""],
        outcomes: program.outcomes && program.outcomes.length > 0 ? program.outcomes : [""],
        projects: program.projects && program.projects.length > 0 ? program.projects : [""],
      })
    } else {
      // Reset form for new program
      setFormData({
        id: "",
        title: "",
        ages: "",
        duration: "",
        class_size: "",
        description: "",
        icon_name: "Rocket",
        color: "bg-[#ffb800]",
        is_active: true,
        display_order: 0,
        highlights: [""],
        outcomes: [""],
        projects: [""],
      })
    }
  }, [program, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { createProgram, updateProgram } = await import("@/lib/supabase/actions/programs")
      
      const highlights = formData.highlights.filter(h => h.trim() !== "")
      const outcomes = formData.outcomes.filter(o => o.trim() !== "")
      const projects = formData.projects.filter(p => p.trim() !== "")

      if (program) {
        // Update existing
        const { error } = await updateProgram(program.id, {
          title: formData.title,
          ages: formData.ages,
          duration: formData.duration,
          class_size: formData.class_size,
          description: formData.description,
          icon_name: formData.icon_name,
          color: formData.color,
          is_active: formData.is_active,
          display_order: formData.display_order,
          highlights,
          outcomes,
          projects,
        })

        if (error) {
          toast.error("Failed to update program", { description: error.message })
        } else {
          toast.success("Program updated successfully")
          onOpenChange(false)
          onSuccess()
        }
      } else {
        // Create new - need to generate ID from title
        const newId = formData.id || formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        
        const { error } = await createProgram({
          id: newId,
          title: formData.title,
          ages: formData.ages,
          duration: formData.duration,
          class_size: formData.class_size,
          description: formData.description,
          icon_name: formData.icon_name,
          color: formData.color,
          display_order: formData.display_order,
          highlights,
          outcomes,
          projects,
        })

        if (error) {
          toast.error("Failed to create program", { description: error.message })
        } else {
          toast.success("Program created successfully")
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

  const addItem = (field: "highlights" | "outcomes" | "projects") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeItem = (field: "highlights" | "outcomes" | "projects", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const updateItem = (field: "highlights" | "outcomes" | "projects", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{program ? "Edit Program" : "Create New Program"}</DialogTitle>
          <DialogDescription>
            {program ? "Update program details below." : "Fill in the details to create a new program."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Program ID (URL-friendly)</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="little-explorers"
                disabled={!!program}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Little Explorers"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ages">Ages *</Label>
              <Input
                id="ages"
                value={formData.ages}
                onChange={(e) => setFormData(prev => ({ ...prev, ages: e.target.value }))}
                placeholder="K1 - K3 (Ages 4-7)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="2 hour sessions"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_size">Class Size *</Label>
              <Input
                id="class_size"
                value={formData.class_size}
                onChange={(e) => setFormData(prev => ({ ...prev, class_size: e.target.value }))}
                placeholder="4-8 students"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Program description..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon_name">Icon Name</Label>
              <Input
                id="icon_name"
                value={formData.icon_name}
                onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                placeholder="Rocket"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color Class</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="bg-[#ffb800]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <Label>Highlights</Label>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={highlight}
                  onChange={(e) => updateItem("highlights", index, e.target.value)}
                  placeholder="Enter highlight..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem("highlights", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem("highlights")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </div>

          {/* Outcomes */}
          <div className="space-y-2">
            <Label>Learning Outcomes</Label>
            {formData.outcomes.map((outcome, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={outcome}
                  onChange={(e) => updateItem("outcomes", index, e.target.value)}
                  placeholder="Enter outcome..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem("outcomes", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem("outcomes")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Outcome
            </Button>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <Label>Sample Projects</Label>
            {formData.projects.map((project, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={project}
                  onChange={(e) => updateItem("projects", index, e.target.value)}
                  placeholder="Enter project..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem("projects", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem("projects")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="is_active" className="cursor-pointer">Active (visible on website)</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
              {loading ? "Saving..." : program ? "Update Program" : "Create Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
