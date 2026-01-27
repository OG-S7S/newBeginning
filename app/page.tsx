import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/home/hero-section"
import { ProgramsSection } from "@/components/home/programs-section"
import { WhyUsSection } from "@/components/home/why-us-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProgramsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
