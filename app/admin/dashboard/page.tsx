"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: GraduationCap,
    color: "bg-[#3abafb]/10 text-[#3abafb]",
  },
  {
    title: "Active Courses",
    value: "18",
    change: "+2",
    trend: "up",
    icon: BookOpen,
    color: "bg-[#ffb800]/10 text-[#ffb800]",
  },
  {
    title: "Instructors",
    value: "12",
    change: "0",
    trend: "neutral",
    icon: Users,
    color: "bg-[#0a0a5c]/10 text-[#0a0a5c]",
  },
  {
    title: "Monthly Revenue",
    value: "EGP 125,400",
    change: "+8%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
];

const recentApplications = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    age: 10,
    program: "Robotics Fundamentals",
    date: "Jan 18, 2026",
    status: "pending",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    age: 12,
    program: "Web Development",
    date: "Jan 17, 2026",
    status: "pending",
  },
  {
    id: 3,
    name: "Omar Hassan",
    age: 8,
    program: "Scratch Programming",
    date: "Jan 17, 2026",
    status: "approved",
  },
  {
    id: 4,
    name: "Nour Ibrahim",
    age: 14,
    program: "Python Programming",
    date: "Jan 16, 2026",
    status: "approved",
  },
];

const upcomingSessions = [
  {
    id: 1,
    title: "Robotics Fundamentals - Group A",
    time: "10:00 AM - 11:30 AM",
    instructor: "Ms. Sarah",
    students: 12,
  },
  {
    id: 2,
    title: "Web Development Basics",
    time: "2:00 PM - 3:30 PM",
    instructor: "Mr. Mohamed",
    students: 8,
  },
  {
    id: 3,
    title: "Python Programming",
    time: "4:00 PM - 5:30 PM",
    instructor: "Mr. Ahmed",
    students: 10,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a5c]">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here is what is happening at newBeginning today.
          </p>
        </div>
        <Button className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.trend !== "neutral" && (
                  <div
                    className={`flex items-center text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-[#0a0a5c]">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#3abafb]" />
              Recent Applications
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#0a0a5c]"
              asChild
            >
              <a href="/admin/applications">View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-[#0a0a5c]">{app.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.program} - Age {app.age}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        app.status === "pending"
                          ? "bg-[#ffb800]/10 text-[#ffb800]"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {app.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {app.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#3abafb]" />
              Today&apos;s Sessions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#0a0a5c]"
              asChild
            >
              <a href="/admin/schedule">View Schedule</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-[#0a0a5c]">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.instructor} - {session.time}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#3abafb]/10 text-[#0a0a5c]"
                  >
                    {session.students} students
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
              asChild
            >
              <a href="/admin/students">
                <GraduationCap className="h-6 w-6" />
                <span>Add Student</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
              asChild
            >
              <a href="/admin/courses">
                <BookOpen className="h-6 w-6" />
                <span>Create Course</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
              asChild
            >
              <a href="/admin/schedule">
                <Calendar className="h-6 w-6" />
                <span>Schedule Session</span>
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
              asChild
            >
              <a href="/admin/reports">
                <TrendingUp className="h-6 w-6" />
                <span>View Reports</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
