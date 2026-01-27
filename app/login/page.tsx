"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, GraduationCap, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const getErrorMessage = (error: any): string => {
    if (!error) return "An unexpected error occurred. Please try again."
    
    // Supabase errors have a message property
    let errorMessage = error.message || error.toString() || "An unexpected error occurred"
    
    // Convert to lowercase for easier matching
    const lowerMessage = errorMessage.toLowerCase()
    
    // Check for API key errors
    if (lowerMessage.includes("invalid api key") || lowerMessage.includes("api key")) {
      return "Configuration error: Supabase API key is missing or invalid. Please check your .env.local file and restart the server."
    }
    
    // User-friendly error messages
    if (lowerMessage.includes("invalid login credentials") || 
        lowerMessage.includes("invalid email or password") ||
        lowerMessage.includes("email") && lowerMessage.includes("password")) {
      return "Invalid email or password. Please check your credentials and try again."
    }
    if (lowerMessage.includes("email not confirmed") || lowerMessage.includes("email_not_confirmed")) {
      return "Please verify your email address before signing in. Check your inbox for the confirmation link."
    }
    if (lowerMessage.includes("too many requests") || lowerMessage.includes("rate limit")) {
      return "Too many login attempts. Please wait a few minutes and try again."
    }
    if (lowerMessage.includes("network") || lowerMessage.includes("fetch") || lowerMessage.includes("failed to fetch")) {
      return "Network error. Please check your internet connection and try again."
    }
    if (lowerMessage.includes("user not found")) {
      return "No account found with this email address. Please sign up first."
    }
    
    // Return the actual error message if we can't match it
    return errorMessage
  }

  const handleStudentLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get("email") as string)?.trim()
    const password = formData.get("password") as string

    // Client-side validation
    if (!email || !email.includes("@")) {
      const errorMsg = "Please enter a valid email address"
      setError(errorMsg)
      toast.error("Validation Error", { description: errorMsg })
      setIsLoading(false)
      return
    }

    if (!password || password.length < 6) {
      const errorMsg = "Password must be at least 6 characters"
      setError(errorMsg)
      toast.error("Validation Error", { description: errorMsg })
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        const errorMsg = getErrorMessage(signInError)
        setError(errorMsg)
        toast.error(errorMsg, { 
          description: "Please check your credentials and try again.",
          duration: 5000
        })
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Check user role from metadata or database
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          // Check if it's because table doesn't exist or profile is missing
          const isTableMissing = profileError.code === "42P01" || profileError.message?.includes("does not exist")
          const isProfileMissing = profileError.code === "PGRST116" || profileError.message?.includes("No rows")
          
          if (isTableMissing) {
            console.error("Profiles table not found. Please run the SQL migration from supabase-migrations.sql")
            // Still allow login, but warn user
            toast.warning("Database setup incomplete", {
              description: "Please run the SQL migration to create the profiles table.",
              duration: 6000
            })
          } else if (isProfileMissing) {
            // Try to create profile automatically
            const { error: createError } = await supabase
              .from("profiles")
              .insert({
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name || "",
                role: "student"
              })
            
            if (createError) {
              console.error("Failed to create profile:", createError)
            }
          } else {
            console.error("Profile fetch error:", profileError)
          }
        }

        // Re-fetch profile if we just created it
        const { data: finalProfile } = profileError && profileError.code === "PGRST116"
          ? await supabase
              .from("profiles")
              .select("role")
              .eq("id", data.user.id)
              .single()
          : { data: profile, error: null }

        // If profile doesn't exist or role is not admin, redirect to student portal
        if (!finalProfile || finalProfile.role !== "admin") {
          toast.success("Welcome back!", { description: "Redirecting to your portal..." })
          router.push("/portal/dashboard")
          router.refresh()
        } else {
          toast.success("Welcome back!", { description: "Redirecting to admin panel..." })
          router.push("/admin/dashboard")
          router.refresh()
        }
      }
    } catch (err: any) {
      console.error("Login error:", err) // Log for debugging
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg, { 
        description: "An unexpected error occurred. Please try again.",
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get("email") as string)?.trim()
    const password = formData.get("password") as string

    // Client-side validation
    if (!email || !email.includes("@")) {
      const errorMsg = "Please enter a valid email address"
      setError(errorMsg)
      toast.error(errorMsg, { duration: 4000 })
      setIsLoading(false)
      return
    }

    if (!password || password.length < 6) {
      const errorMsg = "Password must be at least 6 characters"
      setError(errorMsg)
      toast.error(errorMsg, { duration: 4000 })
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        const errorMsg = getErrorMessage(signInError)
        setError(errorMsg)
        // Show the actual error message as the title
        toast.error(errorMsg, { 
          description: "Please check your credentials and try again.",
          duration: 5000
        })
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Verify admin role
        console.log("Admin login - Attempting to fetch profile for user ID:", data.user.id)
        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, email, full_name, id")
          .eq("id", data.user.id)
          .single()

        // Debug logging - log the full error object
        console.log("Admin login - User ID:", data.user.id)
        console.log("Admin login - Profile data:", JSON.stringify(profile, null, 2))
        console.log("Admin login - Profile error (full):", JSON.stringify(profileError, null, 2))
        console.log("Admin login - Profile error type:", typeof profileError)
        console.log("Admin login - Profile error keys:", profileError ? Object.keys(profileError) : 'null')

        if (profileError) {
          // Try to get more details from the error
          const errorDetails = {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            status: profileError.status,
            statusText: profileError.statusText,
            rawError: profileError
          }
          console.error("Profile fetch error details:", errorDetails)
          
          // Check if it's a "no rows" error (profile doesn't exist)
          const isProfileMissing = profileError.code === "PGRST116" || 
                                   profileError.message?.includes("No rows") ||
                                   profileError.message?.includes("not found")
          
          if (isProfileMissing) {
            const errorMsg = `Profile not found for this user. Please ensure the profile exists in the profiles table with id: ${data.user.id}`
            setError(errorMsg)
            toast.error("Profile Not Found", { 
              description: "Your user account exists but profile is missing. Please contact support.",
              duration: 6000
            })
            await supabase.auth.signOut()
            setIsLoading(false)
            return
          }
          
          // Other errors (RLS, permissions, etc.)
          const errorMsg = `Unable to verify admin access: ${profileError.message || profileError.code || 'Unknown error'}`
          setError(errorMsg)
          toast.error("Access Verification Failed", { 
            description: profileError.message || "There was an issue verifying your admin privileges. Please contact support.",
            duration: 6000
          })
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }

        // Check role (case-insensitive comparison)
        const userRole = profile?.role?.toLowerCase().trim()
        console.log("Admin login - User role:", userRole)
        
        if (userRole === "admin") {
          toast.success("Welcome back!", { description: "Redirecting to admin panel..." })
          router.push("/admin/dashboard")
          router.refresh()
        } else {
          const errorMsg = `Access denied. Your account role is "${profile?.role || 'unknown'}". Admin privileges required.`
          setError(errorMsg)
          toast.error("Access Denied", { 
            description: `Your account role is "${profile?.role || 'unknown'}". Please use the student login or contact support.`,
            duration: 6000
          })
          await supabase.auth.signOut()
          setIsLoading(false)
        }
      }
    } catch (err: any) {
      console.error("Admin login error:", err) // Log for debugging
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg, { 
        description: "An unexpected error occurred. Please try again.",
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a5c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold text-white italic">new</span>
            <span className="text-2xl font-bold text-white -mt-1">Beginning</span>
          </div>
          <svg className="h-10 w-10" viewBox="0 0 100 100" fill="none">
            <path
              d="M70 30c-5-5-15-5-20 5s0 25 10 30c15 5 25-5 25-15s-5-15-15-20z"
              fill="#3abafb"
            />
            <circle cx="55" cy="55" r="8" fill="#3abafb" />
            <circle cx="45" cy="65" r="5" fill="#3abafb" />
          </svg>
        </Link>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-[#0a0a5c]">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="data-[state=active]:bg-[#0a0a5c] data-[state=active]:text-white">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-[#0a0a5c] data-[state=active]:text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                      <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="border-[#e0e7ff]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="border-[#e0e7ff] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a8a] hover:text-[#0a0a5c]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-[#e0e7ff]" />
                      <span className="text-[#4a4a8a]">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-[#3abafb] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Student"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                      <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      placeholder="admin@newbeginning.com"
                      required
                      className="border-[#e0e7ff]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="border-[#e0e7ff] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a8a] hover:text-[#0a0a5c]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In as Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#3abafb] hover:underline">
            Sign Up
          </Link>
          {" or "}
          <Link href="/apply" className="text-[#3abafb] hover:underline">
            Apply Now
          </Link>
        </p>
      </div>
    </main>
  )
}
