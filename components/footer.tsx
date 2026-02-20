'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const quickLinks = [
  { href: "/programs", label: "Programs" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/apply", label: "Apply Now" },
  { href: "/contact", label: "Contact" },
]

const programs = [
  { href: "/programs#little-explorers", label: "Little Explorers (K1-K3)" },
  { href: "/programs#young-engineers", label: "Young Engineers (G4-G6)" },
  { href: "/programs#tech-pioneers", label: "Tech Pioneers (Prep)" },
  { href: "/programs#innovation-lab", label: "Innovation Lab (Secondary)" },
]

export function Footer() {
  const [settings, setSettings] = useState<any | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("settings")
          .select("key, value, category, description, updated_by, updated_at")

        if (!error && data) {
          const obj: Record<string, any> = {}
          data.forEach((s) => {
            obj[s.key] = {
              value: s.value,
              category: s.category,
              description: s.description,
              updated_by: s.updated_by,
              updated_at: s.updated_at,
            }
          })
          setSettings(obj)
        }
      } catch (err) {
        console.error("Failed to load footer settings", err)
      }
    }

    fetchSettings()
  }, [])

  const academyName = settings?.academy_name?.value ||  "newBeginning"
  const tagline = settings?.tagline?.value || "Start Smssart"
  const description =
    settings?.description?.value ||
    "Building little engineers through real-world problem solving, critical thinking, and innovation."
  const phone = settings?.phone?.value || "+20 100 165 6594"
  const email = settings?.email?.value || "info@newbeginning.com"
  const address = settings?.address?.value || "Cairo, Egypt"

  return (
    <footer className="bg-[#0a0a5c] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-bold text-white italic">
                  {academyName.split(" ")[0] || "new"}
                </span>
                <span className="text-2xl font-bold text-white -mt-1">
                  {academyName.split(" ").slice(1).join(" ") || "Beginning"}
                </span>
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
            <p className="text-white/60 mb-6">
              {description}
            </p>
            <p className="text-[#3abafb] font-medium text-lg">{tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#3abafb] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Programs</h3>
            <ul className="space-y-3">
              {programs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#3abafb] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#3abafb] shrink-0 mt-0.5" />
                <span className="text-white/60">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#3abafb] shrink-0" />
                <a
                  href={`tel:${(phone || "").replace(/\\s/g, "")}`}
                  className="text-white/60 hover:text-[#3abafb] transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#3abafb] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-white/60 hover:text-[#3abafb] transition-colors"
                >
                  {email}
                </a>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.facebook.com/share/1CxHEixek5/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#3abafb] rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-[#3abafb] rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} newBeginning Academy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-white/40 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
