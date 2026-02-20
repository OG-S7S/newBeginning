"use client"

import React, { useEffect, useState } from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  Facebook, Instagram, Send, CheckCircle2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function formatTime(time: string | undefined): string {
  if (!time) return ""
  try {
    const date = new Date(`1970-01-01T${time}`)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } catch {
    return time
  }
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settings, setSettings] = useState<any | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("settings")
          .select("key, value")

        if (!error && data) {
          const obj: Record<string, any> = {}
          data.forEach((s) => {
            obj[s.key] = s.value
          })
          setSettings(obj)
        }
      } catch (err) {
        console.error("Failed to load contact settings", err)
      }
    }

    fetchSettings()
  }, [])

  const phone = settings?.phone || "+20 100 165 6594"
  const email = settings?.email || "info@newbeginning.com"
  const address = settings?.address || "Cairo - Maadi"

  const businessHours = settings?.business_hours as
    | Record<string, { open?: string; close?: string }>
    | undefined

  const workingHoursDetails: string[] = businessHours
    ? ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"]
        .map((dayKey) => {
          const hours = businessHours[dayKey]
          if (!hours?.open || !hours?.close) return null
          const label = dayKey[0].toUpperCase() + dayKey.slice(1)
          return `${label}: ${formatTime(hours.open)} - ${formatTime(hours.close)}`
        })
        .filter(Boolean) as string[]
    : ["Saturday - Friday", "10:00 AM - 8:00 PM"]

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [phone],
      action: { type: "tel", value: phone.replace(/\s/g, "") },
    },
    {
      icon: Mail,
      title: "Email",
      details: [email],
      action: { type: "mailto", value: email },
    },
    {
      icon: MapPin,
      title: "Location",
      details: [address],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: workingHoursDetails,
    },
  ]

  const mapLocationUrl = "https://www.google.com/maps/place/%D8%AD%D8%B6%D8%A7%D9%86%D8%A9+%D8%A7%D8%AC%D9%8A%D8%A7%D9%84/@31.2643713,29.9965549,17z/data=!3m1!4b1!4m6!3m5!1s0x14f5daa23e29ae39:0xf4491ec1cb7aa461!8m2!3d31.2643713!4d29.9965549!16s%2Fg%2F11j1hyxczc!18m1!1e1?entry=ttu"

  const branches = [
    {
      name: "Main Branch",
      address,
      phone,
      mapUrl: mapLocationUrl,
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-[#0a0a5c] py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 text-balance">
            Get in Touch
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message or visit one of our branches.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <Card key={info.title} className="border-2 border-[#e0e7ff] hover:border-[#3abafb]/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#3abafb]/10 rounded-xl flex items-center justify-center mb-4">
                    <info.icon className="h-6 w-6 text-[#3abafb]" />
                  </div>
                  <h3 className="font-semibold text-[#0a0a5c] mb-2">{info.title}</h3>
                  {info.details.map((detail) => (
                    <p key={detail} className="text-[#4a4a8a] text-sm">
                      {info.action ? (
                        <a 
                          href={`${info.action.type}:${info.action.value}`}
                          className="hover:text-[#3abafb] transition-colors"
                        >
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0a0a5c]">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0a0a5c] mb-2">Message Sent!</h3>
                    <p className="text-[#4a4a8a]">We&apos;ll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input 
                          id="name" 
                          placeholder="Full name" 
                          required 
                          className="border-[#e0e7ff]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          required 
                          className="border-[#e0e7ff]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+20 1XX XXX XXXX" 
                        className="border-[#e0e7ff]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input 
                        id="subject" 
                        placeholder="How can we help?" 
                        required 
                        className="border-[#e0e7ff]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Your message..." 
                        rows={5}
                        required 
                        className="border-[#e0e7ff]"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Quick Contact & Branches */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card className="border-0 shadow-lg bg-[#0a0a5c] text-white">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Quick Contact</h3>
                  <p className="text-white/70 mb-6">
                    For faster response, reach us directly through WhatsApp or social media.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://wa.me/201001656594"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        WhatsApp
                      </Button>
                    </a>
                    <div className="flex gap-3">
                      <a
                        href="https://facebook.com/NewBegin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                          <Facebook className="mr-2 h-5 w-5" />
                          Facebook
                        </Button>
                      </a>
                      <a
                        href="https://instagram.com/NewBegin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                          <Instagram className="mr-2 h-5 w-5" />
                          Instagram
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Branches */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0a0a5c]">Our Branches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {branches.map((branch) => (
                    <div 
                      key={branch.name}
                      className="p-4 bg-[#f0f9ff] rounded-xl"
                    >
                      <h4 className="font-semibold text-[#0a0a5c] mb-1">{branch.name}</h4>
                      <p className="text-sm text-[#4a4a8a] mb-2">{branch.address}</p>
                      <div className="flex items-center justify-between">
                        <a 
                          href={`tel:${branch.phone.replace(/\s/g, "")}`}
                          className="text-sm text-[#3abafb] hover:underline"
                        >
                          {branch.phone}
                        </a>
                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0a0a5c] hover:text-[#3abafb] font-medium"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map - حضانة اجيال / your location */}
      <section className="relative h-96 bg-[#e0e7ff]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3419.2!2d29.9965549!3d31.2643713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5daa23e29ae39%3A0xf4491ec1cb7aa461!2s!5e0!3m2!1sen!2seg"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="newBeginning Location Map"
        />
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href={mapLocationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0a0a5c] px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-[#0a0a5c]/90"
          >
            <MapPin className="h-4 w-4" />
            Open in Google Maps
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
