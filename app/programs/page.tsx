import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { 
  Rocket, Cog, Cpu, Code, ArrowRight, Clock, Users, 
  CheckCircle2, BookOpen, Wrench, Zap
} from "lucide-react"
import { getPrograms } from "@/lib/supabase/actions/programs"

// Icon mapping
const iconMap: Record<string, any> = {
  Rocket,
  Cog,
  Cpu,
  Code,
}

export default async function ProgramsPage() {
  const { data: programs, error } = await getPrograms()

  // Fallback to empty array if error or no data
  const programsData = programs || []

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-[#0a0a5c] py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Our Programs
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6 text-balance">
            Learning Tracks for Every Age
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            From curious kindergarteners to ambitious high schoolers, we have the perfect 
            program to ignite your child&apos;s passion for technology and innovation.
          </p>
        </div>
      </section>

      {/* Programs Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {programsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#4a4a8a] text-lg">No programs available at the moment.</p>
            </div>
          ) : (
            <Tabs defaultValue={programsData[0]?.id || ""} className="w-full">
              <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-12">
                {programsData.map((program) => {
                  const IconComponent = iconMap[program.icon_name || "Rocket"] || Rocket
                  return (
                    <TabsTrigger
                      key={program.id}
                      value={program.id}
                      className="data-[state=active]:bg-[#0a0a5c] data-[state=active]:text-white px-6 py-3 rounded-full border border-[#e0e7ff] data-[state=active]:border-[#0a0a5c]"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {program.title}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {programsData.map((program) => {
                const IconComponent = iconMap[program.icon_name || "Rocket"] || Rocket
                return (
                  <TabsContent key={program.id} value={program.id} id={program.id}>
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Main Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4 mb-6">
                          <div className={`w-16 h-16 ${program.color} rounded-2xl flex items-center justify-center shrink-0`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-[#0a0a5c]">{program.title}</h2>
                            <p className="text-[#3abafb] font-medium">{program.ages}</p>
                          </div>
                        </div>
                        
                        <p className="text-[#4a4a8a] text-lg mb-8">{program.description}</p>

                        <div className="flex flex-wrap gap-6 mb-8">
                          <div className="flex items-center gap-2 text-[#4a4a8a]">
                            <Clock className="h-5 w-5 text-[#3abafb]" />
                            {program.duration}
                          </div>
                          <div className="flex items-center gap-2 text-[#4a4a8a]">
                            <Users className="h-5 w-5 text-[#3abafb]" />
                            {program.class_size}
                          </div>
                        </div>

                        {/* Highlights */}
                        {program.highlights && program.highlights.length > 0 && (
                          <Card className="mb-6 border-[#e0e7ff]">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-[#0a0a5c]">
                                <Zap className="h-5 w-5 text-[#ffb800]" />
                                Program Highlights
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="grid md:grid-cols-2 gap-3">
                                {program.highlights.map((item: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-[#10b981] shrink-0 mt-0.5" />
                                    <span className="text-[#4a4a8a]">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {/* Outcomes */}
                        {program.outcomes && program.outcomes.length > 0 && (
                          <Card className="border-[#e0e7ff]">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-[#0a0a5c]">
                                <BookOpen className="h-5 w-5 text-[#3abafb]" />
                                Learning Outcomes
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="grid md:grid-cols-2 gap-3">
                                {program.outcomes.map((item: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-[#3abafb] shrink-0 mt-0.5" />
                                    <span className="text-[#4a4a8a]">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Sidebar */}
                      <div>
                        <Card className="border-[#e0e7ff] sticky top-24">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#0a0a5c]">
                              <Wrench className="h-5 w-5 text-[#ffb800]" />
                              Sample Projects
                            </CardTitle>
                            <CardDescription>
                              What students will build in this program
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {program.projects && program.projects.length > 0 ? (
                              program.projects.map((project: string, index: number) => (
                                <div
                                  key={index}
                                  className="p-3 bg-[#f0f9ff] rounded-lg text-[#0a0a5c] font-medium text-sm"
                                >
                                  {project}
                                </div>
                              ))
                            ) : (
                              <p className="text-[#4a4a8a] text-sm">No projects listed yet.</p>
                            )}
                            
                            <div className="pt-4 space-y-3">
                              <Link href="/apply" className="block">
                                <Button className="w-full bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
                                  Enroll Now
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href="/curriculum" className="block">
                                <Button variant="outline" className="w-full border-[#0a0a5c] text-[#0a0a5c] hover:bg-[#0a0a5c] hover:text-white bg-transparent">
                                  View Curriculum
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
