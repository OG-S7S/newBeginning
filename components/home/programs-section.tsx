import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cpu, Code, Cog, Rocket } from "lucide-react"

const programs = [
  {
    title: "Little Explorers",
    ages: "K1 - K3",
    description: "Introduction to basic robotics concepts through play-based learning and simple machines.",
    skills: ["Basic circuits", "Simple machines", "Problem solving"],
    icon: Rocket,
    color: "bg-[#ffb800]",
  },
  {
    title: "Young Engineers",
    ages: "Grade 4 - 6",
    description: "Building and programming robots using block-based coding and hands-on projects.",
    skills: ["Block coding", "Sensors & motors", "Team projects"],
    icon: Cog,
    color: "bg-[#3abafb]",
  },
  {
    title: "Tech Pioneers",
    ages: "Preparatory",
    description: "Advanced robotics with Arduino, Python basics, and competition preparation.",
    skills: ["Arduino", "Python basics", "Competitions"],
    icon: Cpu,
    color: "bg-[#10b981]",
  },
  {
    title: "Innovation Lab",
    ages: "Secondary",
    description: "Full-stack development, advanced robotics, AI concepts, and real-world projects.",
    skills: ["Full-stack dev", "AI/ML basics", "IoT projects"],
    icon: Code,
    color: "bg-[#8b5cf6]",
  },
]

export function ProgramsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Our Programs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a5c] mt-2 mb-4 text-balance">
            Age-Appropriate Learning Tracks
          </h2>
          <p className="text-[#4a4a8a] text-lg">
            Carefully designed curriculum for every age group, progressing from basic concepts to advanced engineering skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program) => (
            <Card 
              key={program.title}
              className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#3abafb]/30 overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 ${program.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <program.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-sm font-medium text-[#3abafb] mb-1">{program.ages}</div>
                <CardTitle className="text-xl text-[#0a0a5c]">{program.title}</CardTitle>
                <CardDescription className="text-[#4a4a8a]">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {program.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-[#f0f9ff] text-[#0a0a5c] px-3 py-1 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/programs">
            <Button variant="outline" size="lg" className="border-[#0a0a5c] text-[#0a0a5c] hover:bg-[#0a0a5c] hover:text-white bg-transparent">
              Explore All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
