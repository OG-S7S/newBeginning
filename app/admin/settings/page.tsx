"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Mail, Bell, Shield, Database } from "lucide-react"
import { getSettings, updateSettings } from "@/lib/supabase/actions/settings"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const result = await getSettings()
      if (result.data) {
        setSettings(result.data)
      }
    } catch (err) {
      console.error("Failed to load settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneral = async () => {
    setSaving(true)
    try {
      const generalSettings = {
        academy_name: { value: (document.getElementById('name') as HTMLInputElement)?.value || 'newBeginning', category: 'general' },
        tagline: { value: (document.getElementById('tagline') as HTMLInputElement)?.value || 'Start Smart', category: 'general' },
        description: { value: (document.getElementById('description') as HTMLTextAreaElement)?.value || '', category: 'general' },
        phone: { value: (document.getElementById('phone') as HTMLInputElement)?.value || '', category: 'general' },
        email: { value: (document.getElementById('email') as HTMLInputElement)?.value || '', category: 'general' },
        address: { value: (document.getElementById('address') as HTMLInputElement)?.value || '', category: 'general' },
      }

      const { error } = await updateSettings(generalSettings)
      if (error) {
        toast.error("Failed to save settings", { description: error.message })
      } else {
        toast.success("Settings saved successfully")
        loadSettings()
      }
    } catch (err) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      const notificationSettings = {
        new_applications: { value: (document.getElementById('new_applications') as HTMLInputElement)?.checked || false, category: 'notifications' },
        payment_reminders: { value: (document.getElementById('payment_reminders') as HTMLInputElement)?.checked || false, category: 'notifications' },
        class_reminders: { value: (document.getElementById('class_reminders') as HTMLInputElement)?.checked || false, category: 'notifications' },
        weekly_reports: { value: (document.getElementById('weekly_reports') as HTMLInputElement)?.checked || false, category: 'notifications' },
        sender_name: { value: (document.getElementById('senderName') as HTMLInputElement)?.value || '', category: 'email' },
        reply_to: { value: (document.getElementById('replyTo') as HTMLInputElement)?.value || '', category: 'email' },
      }

      const { error } = await updateSettings(notificationSettings)
      if (error) {
        toast.error("Failed to save notification settings", { description: error.message })
      } else {
        toast.success("Notification settings saved successfully")
        loadSettings()
      }
    } catch (err) {
      toast.error("Failed to save notification settings")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBusinessHours = async () => {
    setSaving(true)
    try {
      const hours: Record<string, { open: string; close: string }> = {}
      // Allow editing ALL days instead of hard-coding some as closed
      const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      
      days.forEach(day => {
        const openInput = document.getElementById(`${day.toLowerCase()}_open`) as HTMLInputElement
        const closeInput = document.getElementById(`${day.toLowerCase()}_close`) as HTMLInputElement
        if (openInput && closeInput) {
          hours[day.toLowerCase()] = {
            open: openInput.value || '09:00',
            close: closeInput.value || '18:00',
          }
        }
      })

      const { error } = await updateSettings({
        business_hours: { value: hours, category: 'business_hours' }
      })

      if (error) {
        toast.error("Failed to save business hours", { description: error.message })
      } else {
        toast.success("Business hours saved successfully")
        loadSettings()
      }
    } catch (err) {
      toast.error("Failed to save business hours")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a5c]">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage academy settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-[#f0f9ff]">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Academy Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#3abafb]" />
                Academy Information
              </CardTitle>
              <CardDescription>
                Basic information about your academy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Academy Name</Label>
                  <Input
                    id="name"
                    defaultValue={settings.academy_name?.value || "newBeginning"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    defaultValue={settings.tagline?.value || "Start Smart"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  defaultValue={settings.description?.value || "Programming and Robotics Academy for kids aged 6-18. Building little engineers through real-world problem solving and innovation."}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue={settings.phone?.value || "+20 100 165 6594"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue={settings.email?.value || "info@newbeginning.com"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue={settings.address?.value || "123 Education Street, Cairo, Egypt"}
                />
              </div>
              <Button
                className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                onClick={handleSaveGeneral}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your academy operating hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                  const dayHours = settings.business_hours?.value?.[day.toLowerCase()]
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between p-3 bg-[#f0f9ff] rounded-lg"
                    >
                      <span className="font-medium">{day}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`${day.toLowerCase()}_open`}
                          type="time"
                          defaultValue={dayHours?.open || "09:00"}
                          className="w-28"
                        />
                        <span>to</span>
                        <Input
                          id={`${day.toLowerCase()}_close`}
                          type="time"
                          defaultValue={dayHours?.close || "18:00"}
                          className="w-28"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <Button
                className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                onClick={handleSaveBusinessHours}
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Hours"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#3abafb]" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Applications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new applications are submitted
                    </p>
                  </div>
                  <Switch
                    id="new_applications"
                    defaultChecked={settings.new_applications?.value !== false}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Send automatic payment reminders to parents
                    </p>
                  </div>
                  <Switch
                    id="payment_reminders"
                    defaultChecked={settings.payment_reminders?.value !== false}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Class Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Send class reminders to students 1 day before
                    </p>
                  </div>
                  <Switch
                    id="class_reminders"
                    defaultChecked={settings.class_reminders?.value !== false}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports via email
                    </p>
                  </div>
                  <Switch
                    id="weekly_reports"
                    defaultChecked={settings.weekly_reports?.value === true}
                  />
                </div>
              </div>
              <Button
                className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                onClick={handleSaveNotifications}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#3abafb]" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  defaultValue={settings.sender_name?.value || "newBeginning Academy"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To Email</Label>
                <Input
                  id="replyTo"
                  defaultValue={settings.reply_to?.value || "info@newbeginning.com"}
                />
              </div>
              <Button
                className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white"
                onClick={handleSaveNotifications}
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Email Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#3abafb]" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage account security options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch defaultChecked={settings.two_factor?.value === true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after 30 minutes of inactivity
                    </p>
                  </div>
                  <Switch defaultChecked={settings.session_timeout?.value !== false} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#3abafb]" />
                Data Management
              </CardTitle>
              <CardDescription>
                Backup and export your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#f0f9ff] rounded-lg">
                <div>
                  <p className="font-medium">Last Backup</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })} at 2:00 AM
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
                >
                  Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
