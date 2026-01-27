import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Parent of Mohamed, Grade 5",
    content: "My son's confidence has skyrocketed since joining newBeginning. He now builds his own projects at home and teaches his siblings!",
    rating: 5,
  },
  {
    name: "Ahmed Hassan",
    role: "Parent of Youssef, Prep 2",
    content: "The instructors are amazing. They don't just teach coding, they teach problem-solving and critical thinking. Worth every penny.",
    rating: 5,
  },
  {
    name: "Mona Khaled",
    role: "Parent of Farida, Grade 3",
    content: "Farida was shy and hesitant at first, but now she leads her team in class projects. The transformation is incredible.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#f0f9ff]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a0a5c] mt-2 mb-4 text-balance">
            What Parents Say About Us
          </h2>
          <p className="text-[#4a4a8a] text-lg">
            Join hundreds of happy families who have seen their children transform into confident, creative problem-solvers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-[#3abafb]/30 mb-4" />
                <p className="text-[#4a4a8a] mb-6 leading-relaxed italic">
                  {`"${testimonial.content}"`}
                </p>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#ffb800] text-[#ffb800]" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-[#0a0a5c]">{testimonial.name}</div>
                  <div className="text-sm text-[#4a4a8a]">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
