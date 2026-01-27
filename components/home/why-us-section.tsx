import { Brain, Users, Trophy, Lightbulb, Target, Heart } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Critical Thinking",
    description: "We teach students how to think, not what to think. Problem-solving at its core.",
  },
  {
    icon: Lightbulb,
    title: "Real-World Projects",
    description: "Students build actual working robots and software, not just follow tutorials.",
  },
  {
    icon: Trophy,
    title: "Competition Ready",
    description: "Prepare for national and international robotics competitions with expert guidance.",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Maximum 10 students per class ensures personalized attention and support.",
  },
  {
    icon: Target,
    title: "Outcome-Focused",
    description: "Clear learning outcomes and progress tracking for parents and students.",
  },
  {
    icon: Heart,
    title: "Passion-Driven",
    description: "Our instructors are engineers who love teaching and inspiring young minds.",
  },
]

export function WhyUsSection() {
  return (
    <section className="py-20 bg-[#0a0a5c] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#3abafb] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffb800] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4 text-balance">
            Building Little Engineers, One Project at a Time
          </h2>
          <p className="text-white/70 text-lg">
            At newBeginning, we believe every child has the potential to be an innovator. 
            Our unique approach combines hands-on learning with structured curriculum.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#3abafb]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#3abafb] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-[#0a0a5c]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
