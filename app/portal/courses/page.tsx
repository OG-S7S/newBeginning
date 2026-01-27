"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Play, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getStudentEnrollments } from "@/lib/supabase/actions/student-portal";

export default function CoursesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await getStudentEnrollments(user.id);
      if (result.data) {
        setEnrollments(result.data);
      }
    } catch (err) {
      console.error("Error loading enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeCourses = enrollments.filter(e => e.status === 'active');
  const completedCourses = enrollments.filter(e => e.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c]"></div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0a0a5c]">My Courses</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and continue learning
        </p>
      </div>

      {/* Active Courses */}
      <div>
        <h2 className="text-xl font-semibold text-[#0a0a5c] mb-4">
          Active Courses
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeCourses.length > 0 ? (
            activeCourses.map((enrollment) => {
              const course = enrollment.courses;
              if (!course) return null;
              
              return (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-[#0a0a5c] to-[#3abafb] flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      {course.level && (
                        <Badge
                          variant="secondary"
                          className="bg-[#3abafb]/10 text-[#0a0a5c]"
                        >
                          {course.level}
                        </Badge>
                      )}
                    </div>
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {course.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </div>
                    <Button className="w-full bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
                      <Play className="h-4 w-4 mr-2" />
                      View Course
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active courses enrolled.</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Courses */}
      <div>
        <h2 className="text-xl font-semibold text-[#0a0a5c] mb-4">
          Completed Courses
        </h2>
        <div className="grid gap-4">
          {completedCourses.length > 0 ? (
            completedCourses.map((enrollment) => {
              const course = enrollment.courses;
              if (!course) return null;
              
              return (
                <Card key={enrollment.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-[#0a0a5c] text-[#0a0a5c] bg-transparent">
                      View Certificate
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed courses yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
