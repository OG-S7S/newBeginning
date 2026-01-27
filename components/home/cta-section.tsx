import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#3abafb] to-[#38bdf8] p-8 md:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0a0a5c]/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-[#0a0a5c]" />
              <span className="text-[#0a0a5c] font-medium">Limited Spots Available</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0a5c] mb-6 text-balance">
              Start Your Child&apos;s Journey Today
            </h2>
            <p className="text-lg md:text-xl text-[#0a0a5c]/80 mb-8 max-w-2xl mx-auto">
              Book a free trial session and see the newBeginning difference. 
              No commitment required - just bring curiosity!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white font-semibold text-lg px-8 py-6"
                >
                  Book Free Trial
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
                  className="w-full sm:w-auto border-2 border-[#0a0a5c] text-[#0a0a5c] bg-transparent hover:bg-[#0a0a5c] hover:text-white font-semibold text-lg px-8 py-6"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
