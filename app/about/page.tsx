import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Target, Eye, Heart, Award, Users, BookOpen, 
  ArrowRight, CheckCircle2, Lightbulb, Rocket
} from "lucide-react"

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We encourage creative thinking and novel solutions to real-world problems.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our team is genuinely passionate about technology and education.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive community of young innovators and their families.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for the highest standards in everything we do.",
  },
]

const milestones = [
  { year: "2020", title: "Founded", description: "Started with 10 students in one location" },
  { year: "2021", title: "Growth", description: "Expanded to 100+ students, launched online programs" },
  { year: "2022", title: "Recognition", description: "First national competition wins" },
  { year: "2023", title: "Innovation", description: "Launched AI and IoT tracks" },
  { year: "2024", title: "Community", description: "500+ students, multiple branches" },
]

const team = [
  {
    name: "Eng. Ahmed Mohamed",
    role: "Founder & Lead Instructor",
    bio: "Software engineer with 10+ years of experience. Passionate about STEM education.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Eng. Sara Hassan",
    role: "Curriculum Developer",
    bio: "Robotics engineer and educator. Designs our age-appropriate learning paths.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Eng. Omar Khaled",
    role: "Senior Instructor",
    bio: "Mechatronics specialist. Competition coach and mentor.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-[#0a0a5c] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3abafb] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffb800] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6 text-balance">
            Building the Innovators of Tomorrow
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            newBeginning is more than an academy - we&apos;re a movement to empower the next generation 
            with the skills and mindset to shape the future.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 border-[#3abafb]/30 bg-gradient-to-br from-[#f0f9ff] to-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#3abafb] rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#0a0a5c] mb-4">Our Mission</h2>
                <p className="text-[#4a4a8a] leading-relaxed">
                  To provide accessible, high-quality STEM education that transforms curious children 
                  into confident problem-solvers and innovators. We believe every child has the potential 
                  to create, build, and change the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#ffb800]/30 bg-gradient-to-br from-[#fffbeb] to-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#ffb800] rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#0a0a5c] mb-4">Our Vision</h2>
                <p className="text-[#4a4a8a] leading-relaxed">
                  To be the leading robotics and programming academy in the region, known for 
                  producing young engineers who lead innovation and solve real-world challenges 
                  with technology and creativity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a5c] mt-2">
              What Drives Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#0a0a5c] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-[#3abafb]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0a0a5c] mb-2">{value.title}</h3>
                  <p className="text-[#4a4a8a]">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
                Our Difference
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a5c] mt-2 mb-6">
                Why newBeginning?
              </h2>
              <p className="text-[#4a4a8a] text-lg mb-8">
                We&apos;re not just teaching coding or robotics - we&apos;re developing critical thinkers, 
                problem solvers, and future leaders.
              </p>

              <ul className="space-y-4">
                {[
                  "Real-world projects, not just tutorials",
                  "Engineers who teach, not just teachers",
                  "Small class sizes for personalized attention",
                  "Competition preparation and mentorship",
                  "Parent involvement and progress tracking",
                  "Continuous curriculum updates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#10b981] shrink-0" />
                    <span className="text-[#4a4a8a]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop"
                  alt="Students building robots"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#0a0a5c] text-white p-6 rounded-2xl shadow-xl">
                <Rocket className="h-8 w-8 text-[#3abafb] mb-2" />
                <div className="text-3xl font-bold">500+</div>
                <div className="text-white/70">Students Trained</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#0a0a5c]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#3abafb]/30 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-5 gap-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative">
                  {/* Dot */}
                  <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#3abafb] rounded-full" />
                  
                  <Card className={`bg-white/10 border-0 ${index % 2 === 0 ? "md:mb-20" : "md:mt-20"}`}>
                    <CardContent className="p-6 text-center">
                      <div className="text-[#3abafb] font-bold text-2xl mb-2">{milestone.year}</div>
                      <h3 className="text-white font-semibold mb-1">{milestone.title}</h3>
                      <p className="text-white/60 text-sm">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a5c] mt-2 mb-4">
              Meet the Instructors
            </h2>
            <p className="text-[#4a4a8a]">
              Engineers and educators passionate about inspiring the next generation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="border-0 shadow-lg overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-[#0a0a5c] text-lg">{member.name}</h3>
                  <div className="text-[#3abafb] text-sm font-medium mb-2">{member.role}</div>
                  <p className="text-[#4a4a8a] text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-12 w-12 text-[#3abafb] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a5c] mb-4">
            Ready to Start?
          </h2>
          <p className="text-[#4a4a8a] text-lg max-w-xl mx-auto mb-8">
            Join hundreds of families who have trusted newBeginning with their children&apos;s STEM education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white px-8">
                Book a Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-[#0a0a5c] text-[#0a0a5c] hover:bg-[#0a0a5c] hover:text-white bg-transparent px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
