import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] bg-[#38bdf8] overflow-hidden">
      {/* Background decorative shape */}
      <div className="absolute inset-0">
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[120%] w-auto"
          viewBox="0 0 400 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 0 Q 200 200, 150 400 Q 100 600, 300 800 L -100 800 Z"
            fill="#0a0a5c"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-xl">
            <div className="inline-block bg-[#0a0a5c] text-[#3abafb] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              1 FREE TRIAL SESSION
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
              Next-Gen{" "}
              <span className="text-[#0a0a5c]">Robotics</span>{" "}
              & Software
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Building little engineers through real-world problem solving, 
              critical thinking, and innovation. Transform your child into a future innovator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <Button size="lg" className="w-full sm:w-auto bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white font-semibold text-lg px-8 py-6">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://wa.me/201001656594"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-[#0a0a5c] bg-white hover:bg-white/90 font-semibold text-lg px-8 py-6"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#0a0a5c]">500+</div>
                <div className="text-white/80 text-sm">Students Trained</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#0a0a5c]">50+</div>
                <div className="text-white/80 text-sm">Projects Built</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-[#0a0a5c]">4+</div>
                <div className="text-white/80 text-sm">Age Groups</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <img
                src="/images/artboard-202.png"
                alt="Happy child learning robotics"
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
