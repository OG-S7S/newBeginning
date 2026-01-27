"use client"

import React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { CheckCircle2, MessageCircle, Clock, Gift, Shield } from "lucide-react"
import { getPrograms } from "@/lib/supabase/actions/programs"
import { createApplication } from "@/lib/supabase/actions/applications"
import { toast } from "sonner"

const branches = [
  { value: "cairo-maadi", label: "Cairo - Maadi" },
  { value: "cairo-nasr-city", label: "Cairo - Nasr City" },
  { value: "giza-6october", label: "Giza - 6th of October" },
]

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [programs, setPrograms] = useState<Array<{ value: string; label: string }>>([])
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    email: "",
    studentName: "",
    age: "",
    grade: "",
    school: "",
    program: "",
    branch: "",
    notes: "",
  })

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      const result = await getPrograms()
      if (result.data) {
        setPrograms(
          result.data.map((p: any) => ({
            value: p.id,
            label: p.title,
          }))
        )
      }
    } catch (err) {
      console.error("Failed to load programs:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const { error } = await createApplication({
        parent_name: formData.parentName,
        parent_email: formData.email,
        parent_phone: formData.phone,
        student_name: formData.studentName,
        student_age: parseInt(formData.age),
        student_grade: formData.grade || undefined,
        school_name: formData.school || undefined,
        program_id: formData.program || undefined,
        branch: formData.branch || undefined,
        application_type: "trial",
        notes: formData.notes || undefined,
      })

      if (error) {
        toast.error("Failed to submit application", { description: error.message })
        setIsSubmitting(false)
        return
      }

      setIsSubmitting(false)
      setSubmitted(true)
      toast.success("Application submitted successfully!")
    } catch (err) {
      toast.error("An error occurred while submitting your application")
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen">
        <Navbar />
        
        <section className="py-20 bg-gradient-to-b from-[#f0f9ff] to-white min-h-[70vh] flex items-center">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#0a0a5c] mb-4">
                  Application Received!
                </h2>
                <p className="text-[#4a4a8a] mb-6">
                  Thank you for your interest in newBeginning. We&apos;ll contact you within 
                  <span className="font-semibold text-[#0a0a5c]"> 24 hours </span> 
                  to schedule your free trial session.
                </p>
                
                <div className="p-4 bg-[#f0f9ff] rounded-xl mb-6">
                  <p className="text-sm text-[#4a4a8a]">
                    Want faster response? Chat with us directly!
                  </p>
                </div>
                
                <a
                  href="https://wa.me/201001656594"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-[#0a0a5c] py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Join Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 text-balance">
            Book Your Free Trial
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Experience the newBeginning difference with a complimentary trial session. 
            No commitment required.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gradient-to-b from-[#f0f9ff] to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Benefits */}
            <div className="lg:order-2">
              <Card className="border-0 shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-[#0a0a5c]">What You Get</CardTitle>
                  <CardDescription>With your free trial session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#3abafb]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Gift className="h-5 w-5 text-[#3abafb]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0a0a5c]">Free 1-Hour Session</h4>
                      <p className="text-sm text-[#4a4a8a]">
                        Experience our teaching style firsthand
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#ffb800]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-[#ffb800]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0a0a5c]">Assessment Report</h4>
                      <p className="text-sm text-[#4a4a8a]">
                        Get insights on your child&apos;s readiness level
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5 text-[#10b981]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0a0a5c]">No Commitment</h4>
                      <p className="text-sm text-[#4a4a8a]">
                        Decide after trying - zero pressure
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e0e7ff]">
                    <p className="text-sm text-[#4a4a8a] mb-3">
                      Have questions? Contact us directly:
                    </p>
                    <a
                      href="https://wa.me/201001656594"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white bg-transparent">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp Us
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 lg:order-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0a0a5c]">Application Form</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Parent Information */}
                    <div>
                      <h3 className="font-semibold text-[#0a0a5c] mb-4">Parent Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Full Name *</Label>
                          <Input 
                            id="parentName" 
                            placeholder="Your full name" 
                            required 
                            value={formData.parentName}
                            onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                            className="border-[#e0e7ff] focus:border-[#3abafb]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            placeholder="+20 1XX XXX XXXX" 
                            required 
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="border-[#e0e7ff] focus:border-[#3abafb]"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="your@email.com" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="border-[#e0e7ff] focus:border-[#3abafb]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Student Information */}
                    <div>
                      <h3 className="font-semibold text-[#0a0a5c] mb-4">Student Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Student Name *</Label>
                          <Input 
                            id="studentName" 
                            placeholder="Child's full name" 
                            required 
                            value={formData.studentName}
                            onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                            className="border-[#e0e7ff] focus:border-[#3abafb]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age *</Label>
                          <Input 
                            id="age" 
                            type="number" 
                            min="4" 
                            max="18" 
                            placeholder="Child's age" 
                            required 
                            value={formData.age}
                            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                            className="border-[#e0e7ff] focus:border-[#3abafb]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade">Current Grade *</Label>
                          <Input 
                            id="grade" 
                            placeholder="e.g., Grade 5, Prep 1" 
                            required 
                            value={formData.grade}
                            onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                            className="border-[#e0e7ff] focus:border-[#3abafb]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="school">School Name</Label>
                          <Input 
                            id="school" 
                            placeholder="School name (optional)" 
                            value={formData.school}
                            onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                            className="border-[#e0e7ff] focus:border-[#3abafb]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Program Selection */}
                    <div>
                      <h3 className="font-semibold text-[#0a0a5c] mb-4">Program Selection</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="program">Interested Program *</Label>
                          <Select 
                            required
                            value={formData.program}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, program: value }))}
                          >
                            <SelectTrigger className="border-[#e0e7ff] focus:border-[#3abafb]">
                              <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                              {programs.map((program) => (
                                <SelectItem key={program.value} value={program.value}>
                                  {program.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branch">Preferred Branch *</Label>
                          <Select 
                            required
                            value={formData.branch}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, branch: value }))}
                          >
                            <SelectTrigger className="border-[#e0e7ff] focus:border-[#3abafb]">
                              <SelectValue placeholder="Select a branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch.value} value={branch.value}>
                                  {branch.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Any specific interests, concerns, or questions?" 
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="border-[#e0e7ff] focus:border-[#3abafb]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white font-semibold py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>

                    <p className="text-xs text-[#4a4a8a] text-center">
                      By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
