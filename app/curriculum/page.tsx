import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Rocket, Cog, Cpu, Code, CheckCircle2, 
  BookMarked, Target, GraduationCap
} from "lucide-react"

const curriculumData = [
  {
    id: "little-explorers",
    title: "Little Explorers",
    ages: "K1 - K3",
    icon: Rocket,
    color: "bg-[#ffb800]",
    textColor: "text-[#ffb800]",
    totalModules: 4,
    modules: [
      {
        title: "Module 1: Introduction to Building",
        weeks: "Weeks 1-4",
        topics: [
          "Understanding basic shapes and structures",
          "Introduction to building blocks and connectors",
          "Creating stable structures",
          "Simple machines: levers and wheels",
        ],
        outcome: "Students can build stable structures using various materials",
      },
      {
        title: "Module 2: Moving Things",
        weeks: "Weeks 5-8",
        topics: [
          "Introduction to motion and movement",
          "Wheels, axles, and rotation",
          "Building vehicles that move",
          "Understanding push and pull forces",
        ],
        outcome: "Students can create moving vehicles and understand basic physics",
      },
      {
        title: "Module 3: Lights and Circuits",
        weeks: "Weeks 9-12",
        topics: [
          "Introduction to electricity (safe learning)",
          "Simple LED circuits with batteries",
          "On/off switches",
          "Creating light-up projects",
        ],
        outcome: "Students can build simple circuits and understand electricity basics",
      },
      {
        title: "Module 4: My First Robot",
        weeks: "Weeks 13-16",
        topics: [
          "Combining building and circuits",
          "Introduction to motors",
          "Creating moving and lighting projects",
          "Final project presentation",
        ],
        outcome: "Students complete their first motorized, lit-up creation",
      },
    ],
  },
  {
    id: "young-engineers",
    title: "Young Engineers",
    ages: "Grade 4 - 6",
    icon: Cog,
    color: "bg-[#3abafb]",
    textColor: "text-[#3abafb]",
    totalModules: 6,
    modules: [
      {
        title: "Module 1: Introduction to Coding",
        weeks: "Weeks 1-3",
        topics: [
          "What is programming?",
          "Introduction to Scratch",
          "Sequences and commands",
          "Creating simple animations",
        ],
        outcome: "Students can create basic Scratch animations",
      },
      {
        title: "Module 2: Logic and Loops",
        weeks: "Weeks 4-6",
        topics: [
          "Understanding loops (repeat, forever)",
          "Conditional statements (if/then)",
          "Variables and data",
          "Interactive games creation",
        ],
        outcome: "Students can build interactive Scratch games",
      },
      {
        title: "Module 3: Arduino Basics",
        weeks: "Weeks 7-10",
        topics: [
          "Introduction to Arduino hardware",
          "Visual coding with mBlock",
          "LEDs and buzzers",
          "Input sensors (buttons, light sensors)",
        ],
        outcome: "Students can program Arduino with visual blocks",
      },
      {
        title: "Module 4: Robotics Fundamentals",
        weeks: "Weeks 11-14",
        topics: [
          "Motors and movement",
          "Building a robot chassis",
          "Remote control programming",
          "Basic autonomous movement",
        ],
        outcome: "Students build and program their first robot",
      },
      {
        title: "Module 5: Sensors & Intelligence",
        weeks: "Weeks 15-18",
        topics: [
          "Ultrasonic distance sensors",
          "Line-following sensors",
          "Obstacle avoidance logic",
          "Combining multiple sensors",
        ],
        outcome: "Students create smart robots that react to environment",
      },
      {
        title: "Module 6: Team Project",
        weeks: "Weeks 19-22",
        topics: [
          "Project planning and design",
          "Team collaboration",
          "Building and testing",
          "Presentation skills",
        ],
        outcome: "Teams complete and present a comprehensive robotics project",
      },
    ],
  },
  {
    id: "tech-pioneers",
    title: "Tech Pioneers",
    ages: "Preparatory",
    icon: Cpu,
    color: "bg-[#10b981]",
    textColor: "text-[#10b981]",
    totalModules: 6,
    modules: [
      {
        title: "Module 1: Python Fundamentals",
        weeks: "Weeks 1-4",
        topics: [
          "Introduction to Python syntax",
          "Variables, data types, and operators",
          "Control flow (if/else, loops)",
          "Functions and basic OOP concepts",
        ],
        outcome: "Students can write Python programs with functions",
      },
      {
        title: "Module 2: Advanced Arduino",
        weeks: "Weeks 5-8",
        topics: [
          "C++ programming for Arduino",
          "Advanced sensor integration",
          "Serial communication",
          "Libraries and external modules",
        ],
        outcome: "Students program Arduino using text-based C++",
      },
      {
        title: "Module 3: Robotics Engineering",
        weeks: "Weeks 9-12",
        topics: [
          "Mechanical design principles",
          "3D modeling basics (TinkerCAD)",
          "Building competition-ready robots",
          "Testing and iteration",
        ],
        outcome: "Students design and build advanced robot mechanisms",
      },
      {
        title: "Module 4: IoT & Connectivity",
        weeks: "Weeks 13-16",
        topics: [
          "WiFi and Bluetooth modules",
          "Building IoT devices",
          "Cloud data logging",
          "Mobile app integration basics",
        ],
        outcome: "Students create connected IoT projects",
      },
      {
        title: "Module 5: Competition Preparation",
        weeks: "Weeks 17-20",
        topics: [
          "Competition rules and strategies",
          "Time-based challenges",
          "Debugging under pressure",
          "Team coordination",
        ],
        outcome: "Students are ready for regional robotics competitions",
      },
      {
        title: "Module 6: Capstone Project",
        weeks: "Weeks 21-24",
        topics: [
          "Individual project selection",
          "Project management",
          "Documentation and presentation",
          "Portfolio development",
        ],
        outcome: "Students complete a portfolio-worthy capstone project",
      },
    ],
  },
  {
    id: "innovation-lab",
    title: "Innovation Lab",
    ages: "Secondary",
    icon: Code,
    color: "bg-[#8b5cf6]",
    textColor: "text-[#8b5cf6]",
    totalModules: 6,
    modules: [
      {
        title: "Module 1: Web Development",
        weeks: "Weeks 1-5",
        topics: [
          "HTML, CSS, JavaScript fundamentals",
          "Responsive design principles",
          "Introduction to React",
          "Building interactive web apps",
        ],
        outcome: "Students can build responsive web applications",
      },
      {
        title: "Module 2: Backend & Databases",
        weeks: "Weeks 6-10",
        topics: [
          "Node.js and Express",
          "Database design (SQL/NoSQL)",
          "REST API development",
          "Authentication and security",
        ],
        outcome: "Students can build full-stack applications",
      },
      {
        title: "Module 3: AI & Machine Learning",
        weeks: "Weeks 11-15",
        topics: [
          "Introduction to AI concepts",
          "Python for data science",
          "Machine learning basics",
          "Image recognition projects",
        ],
        outcome: "Students understand AI fundamentals and can use ML libraries",
      },
      {
        title: "Module 4: Advanced IoT",
        weeks: "Weeks 16-20",
        topics: [
          "ESP32 and advanced microcontrollers",
          "Real-time data processing",
          "Cloud integration (AWS/Firebase)",
          "Production-grade IoT systems",
        ],
        outcome: "Students can build professional IoT solutions",
      },
      {
        title: "Module 5: Mobile Development",
        weeks: "Weeks 21-24",
        topics: [
          "React Native fundamentals",
          "Cross-platform development",
          "App deployment",
          "Integration with IoT devices",
        ],
        outcome: "Students can build and deploy mobile applications",
      },
      {
        title: "Module 6: Industry Project",
        weeks: "Weeks 25-30",
        topics: [
          "Real-world problem identification",
          "Agile development practices",
          "Industry mentorship",
          "Professional presentation",
        ],
        outcome: "Students complete an industry-standard project for their portfolio",
      },
    ],
  },
]

export default function CurriculumPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-[#0a0a5c] py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Our Curriculum
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6 text-balance">
            Structured Learning Roadmap
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A clear progression from basic concepts to advanced skills. 
            Each module builds on the previous, ensuring solid foundations and continuous growth.
          </p>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            {curriculumData.map((track) => (
              <Card key={track.id} className="border-2 border-[#e0e7ff] hover:border-[#3abafb]/50 transition-colors">
                <CardHeader>
                  <div className={`w-12 h-12 ${track.color} rounded-xl flex items-center justify-center mb-3`}>
                    <track.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-[#0a0a5c]">{track.title}</CardTitle>
                  <CardDescription className={track.textColor}>
                    {track.ages} • {track.totalModules} Modules
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Detailed Curriculum */}
          <div className="space-y-12">
            {curriculumData.map((track) => (
              <div key={track.id} id={track.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 ${track.color} rounded-2xl flex items-center justify-center`}>
                    <track.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0a0a5c]">{track.title}</h2>
                    <p className={track.textColor + " font-medium"}>{track.ages}</p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {track.modules.map((module, index) => (
                    <AccordionItem 
                      key={module.title} 
                      value={`${track.id}-module-${index}`}
                      className="border border-[#e0e7ff] rounded-xl px-6 data-[state=open]:border-[#3abafb]/50"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4 text-left">
                          <span className={`w-8 h-8 ${track.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-[#0a0a5c]">{module.title}</div>
                            <div className="text-sm text-[#4a4a8a]">{module.weeks}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="ml-12 space-y-4">
                          <div>
                            <h4 className="font-medium text-[#0a0a5c] mb-2 flex items-center gap-2">
                              <BookMarked className="h-4 w-4 text-[#3abafb]" />
                              Topics Covered
                            </h4>
                            <ul className="grid md:grid-cols-2 gap-2">
                              {module.topics.map((topic) => (
                                <li key={topic} className="flex items-start gap-2 text-[#4a4a8a]">
                                  <CheckCircle2 className="h-4 w-4 text-[#10b981] shrink-0 mt-0.5" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 bg-[#f0f9ff] rounded-xl">
                            <h4 className="font-medium text-[#0a0a5c] mb-1 flex items-center gap-2">
                              <Target className="h-4 w-4 text-[#ffb800]" />
                              Learning Outcome
                            </h4>
                            <p className="text-[#4a4a8a]">{module.outcome}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <Card className="border-[#3abafb] bg-white">
            <CardContent className="p-8 flex items-start gap-4">
              <GraduationCap className="h-8 w-8 text-[#3abafb] shrink-0" />
              <div>
                <h3 className="font-semibold text-[#0a0a5c] text-lg mb-2">
                  Curriculum Designed by Engineers
                </h3>
                <p className="text-[#4a4a8a]">
                  Our curriculum is developed by experienced engineers and educators, following international 
                  STEM education standards. We continuously update our content to include the latest technologies 
                  and teaching methodologies. Progress assessments ensure students are meeting learning objectives 
                  at each stage.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
