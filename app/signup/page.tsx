"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    if (lowerMessage.includes("user already registered") || 
        lowerMessage.includes("already registered") ||
        lowerMessage.includes("email address is already registered")) {
      return "An account with this email already exists. Please sign in instead."
    }
    if (lowerMessage.includes("invalid email") || lowerMessage.includes("email format")) {
      return "Please enter a valid email address."
    }
    if (lowerMessage.includes("password") && lowerMessage.includes("6")) {
      return "Password must be at least 6 characters long."
    }
    if (lowerMessage.includes("network") || lowerMessage.includes("fetch") || lowerMessage.includes("failed to fetch")) {
      return "Network error. Please check your internet connection and try again."
    }
    if (lowerMessage.includes("rate limit") || lowerMessage.includes("too many")) {
      return "Too many signup attempts. Please wait a few minutes and try again."
    }
    
    // Return the actual error message if we can't match it
    return errorMessage
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get("email") as string)?.trim()
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const fullName = (formData.get("fullName") as string)?.trim()

    // Client-side validation
    if (!fullName || fullName.length < 2) {
      const errorMsg = "Please enter your full name (at least 2 characters)"
      setError(errorMsg)
      toast.error(errorMsg, { duration: 4000 })
      setIsLoading(false)
      return
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      const errorMsg = "Please enter a valid email address"
      setError(errorMsg)
      toast.error(errorMsg, { duration: 4000 })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long"
      setError(errorMsg)
      toast.error(errorMsg, { duration: 4000 })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match. Please make sure both password fields are identical."
      setError(errorMsg)
      toast.error("Passwords do not match", { description: "Please make sure both password fields are identical.", duration: 4000 })
      setIsLoading(false)
      return
    }

    // Check for common weak passwords
    if (password.toLowerCase() === "password" || password.toLowerCase() === "123456") {
      const errorMsg = "Please choose a stronger password for security"
      setError(errorMsg)
      toast.error(errorMsg, { duration: 4000 })
      setIsLoading(false)
      return
    }

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        console.error("Signup error:", signUpError) // Log for debugging
        const errorMsg = getErrorMessage(signUpError)
        setError(errorMsg)
        // Show the actual error message as the title
        toast.error(errorMsg, { 
          description: "Please check your information and try again.",
          duration: 5000
        })
        setIsLoading(false)
        return
      }

      if (authData.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: email,
            full_name: fullName,
            role: "student", // Default role - admins must be created manually
          })

        if (profileError) {
          console.error("Error creating profile:", profileError)
          
          // Check if it's because table doesn't exist
          const isTableMissing = profileError.code === "42P01" || profileError.message?.includes("does not exist")
          
          if (isTableMissing) {
            toast.error("Database Setup Required", {
              description: "Please run the SQL migration from supabase-migrations.sql in your Supabase dashboard.",
              duration: 8000
            })
          } else {
            // Other profile creation errors
            toast.warning("Account created but profile setup incomplete", {
              description: "Please contact support if you experience any issues.",
              duration: 6000
            })
          }
        } else {
          toast.success("Account Created Successfully!", {
            description: "Please check your email to verify your account before signing in.",
          })
        }

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err: any) {
      console.error("Signup error:", err) // Log for debugging
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
            <CardTitle className="text-[#0a0a5c]">Create Account</CardTitle>
            <CardDescription>Sign up to get started with newBeginning Academy</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                  <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="border-[#e0e7ff]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="border-[#e0e7ff]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    required
                    minLength={6}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    className="border-[#e0e7ff] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a8a] hover:text-[#0a0a5c]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-white/60 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#3abafb] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
