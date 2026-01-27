"use client"

import React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, BookOpen, FileText, Calendar, 
  Award, User, LogOut, Menu, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

const sidebarLinks = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/courses", label: "Courses", icon: BookOpen },
  { href: "/portal/assignments", label: "Assignments", icon: FileText },
  { href: "/portal/schedule", label: "Schedule", icon: Calendar },
  { href: "/portal/certificates", label: "Certificates", icon: Award },
]

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<{ 
    full_name?: string
    email?: string
    age?: number
    program?: string
    student_enrollments?: Array<{ programs?: { title: string } }>
  } | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      // Fetch user profile with enrollments
      supabase
        .from("profiles")
        .select(`
          full_name,
          email,
          age,
          program,
          student_enrollments (
            programs (
              title
            )
          )
        `)
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setProfile(data)
          }
        })
    }
  }, [user, supabase])

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c] mx-auto"></div>
          <p className="mt-4 text-[#4a4a8a]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Mobile Header */}
      <header className="lg:hidden bg-[#0a0a5c] text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/portal/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-lg">newBeginning</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-[#0a0a5c] text-white
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          {/* Logo */}
          <div className="p-6 hidden lg:block">
            <Link href="/portal/dashboard" className="flex items-center gap-2">
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-white italic">new</span>
                <span className="text-xl font-bold text-white -mt-1">Beginning</span>
              </div>
              <svg className="h-8 w-8" viewBox="0 0 100 100" fill="none">
                <path d="M70 30c-5-5-15-5-20 5s0 25 10 30c15 5 25-5 25-15s-5-15-15-20z" fill="#3abafb" />
                <circle cx="55" cy="55" r="8" fill="#3abafb" />
                <circle cx="45" cy="65" r="5" fill="#3abafb" />
              </svg>
            </Link>
          </div>

          {/* Student Info */}
          <div className="px-6 py-4 border-y border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3abafb] rounded-full flex items-center justify-center font-bold text-white">
                {profile?.full_name
                  ? profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : user.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{profile?.full_name || user.email || "User"}</div>
                <div className="text-sm text-white/60 truncate">
                  {profile?.student_enrollments?.[0]?.programs?.title || profile?.program || "Student"}
                </div>
                {profile?.age && (
                  <div className="text-xs text-white/50">Age: {profile.age}</div>
                )}
                {profile?.email && (
                  <div className="text-xs text-white/50 truncate">{profile.email}</div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive 
                      ? "bg-[#3abafb] text-[#0a0a5c]" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:min-h-[calc(100vh)]">
          {children}
        </main>
      </div>
    </div>
  )
}
