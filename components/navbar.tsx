"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a5c]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a5c]/90">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/90 hover:text-[#3abafb] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-[#3abafb] hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/apply">
            <Button className="bg-[#3abafb] hover:bg-[#3abafb]/90 text-[#0a0a5c] font-semibold">
              Book a Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a5c] border-t border-white/10">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-[#3abafb] transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-white hover:text-[#3abafb] hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/apply" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#3abafb] hover:bg-[#3abafb]/90 text-[#0a0a5c] font-semibold">
                  Book a Trial
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
