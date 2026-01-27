"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { X, Play, Trophy, Lightbulb, Users, GraduationCap, Image as ImageIcon } from "lucide-react"
import { getGalleryItems } from "@/lib/supabase/actions/gallery"

const galleryCategories = [
  { id: "all", label: "All", icon: Lightbulb },
  { id: "projects", label: "Student Projects", icon: Lightbulb },
  { id: "competitions", label: "Competitions", icon: Trophy },
  { id: "classes", label: "Classes", icon: Users },
  { id: "events", label: "Events", icon: GraduationCap },
]

interface GalleryItem {
  id: string
  category: string
  title: string
  description?: string
  type: string
  thumbnail_url?: string
  image_url?: string
  video_url?: string
  is_featured: boolean
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await getGalleryItems()
      if (error) {
        console.error("Error loading gallery:", error)
      } else {
        setItems(data || [])
      }
    } catch (err) {
      console.error("Error loading gallery:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = activeTab === "all" 
    ? items 
    : items.filter(item => item.category === activeTab)

  const featuredItems = items.filter(item => item.is_featured)
  const displayItems = activeTab === "all" && featuredItems.length > 0 
    ? [...featuredItems, ...filteredItems.filter(item => !item.is_featured)]
    : filteredItems

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-[#0a0a5c] py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#3abafb] font-semibold text-sm uppercase tracking-wider">
            Gallery
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6 text-balance">
            Our Students&apos; Amazing Work
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Explore projects, competitions, classes, and events from our academy
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-12">
              {galleryCategories.map((category) => {
                const IconComponent = category.icon
                const count = category.id === "all" 
                  ? items.length 
                  : items.filter(item => item.category === category.id).length
                
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-[#0a0a5c] data-[state=active]:text-white px-6 py-3 rounded-full border border-[#e0e7ff] data-[state=active]:border-[#0a0a5c]"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.label} ({count})
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c] mx-auto"></div>
                  <p className="mt-4 text-[#4a4a8a]">Loading gallery...</p>
                </div>
              ) : displayItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#4a4a8a] text-lg">No items in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayItems.map((item) => {
                    const imageUrl = item.thumbnail_url || item.image_url
                    return (
                      <Card
                        key={item.id}
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-[#e0e7ff]"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="relative aspect-video bg-gray-100">
                          {item.type === "video" ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="h-12 w-12 text-white drop-shadow-lg" />
                              {imageUrl && (
                                <img
                                  src={imageUrl}
                                  alt={item.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ) : imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          {item.is_featured && (
                            <div className="absolute top-2 right-2 bg-[#ffb800] text-[#0a0a5c] px-2 py-1 rounded text-xs font-bold">
                              Featured
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-[#0a0a5c] mb-1">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-[#4a4a8a] line-clamp-2">{item.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedItem(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="aspect-video bg-gray-900">
              {selectedItem.type === "video" ? (
                selectedItem.video_url ? (
                  <iframe
                    src={selectedItem.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <Play className="h-16 w-16" />
                  </div>
                )
              ) : (
                <img
                  src={selectedItem.image_url || selectedItem.thumbnail_url || ""}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#0a0a5c] mb-2">{selectedItem.title}</h2>
              {selectedItem.description && (
                <p className="text-[#4a4a8a]">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
