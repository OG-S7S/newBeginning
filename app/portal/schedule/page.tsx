"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getStudentEnrollments, getStudentUpcomingSessions } from "@/lib/supabase/actions/student-portal";
import { getSessions } from "@/lib/supabase/actions/sessions";

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
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
      const [enrollmentsResult, sessionsResult] = await Promise.all([
        getStudentEnrollments(user.id),
        getSessions(),
      ]);

      if (enrollmentsResult.data) {
        setEnrollments(enrollmentsResult.data);
        const courseIds = enrollmentsResult.data
          .filter(e => e.status === 'active')
          .map(e => e.course_id);
        
        // Filter sessions for enrolled courses
        if (sessionsResult.data && courseIds.length > 0) {
          const studentSessions = sessionsResult.data.filter(s => 
            courseIds.includes(s.course_id)
          );
          setSessions(studentSessions);
        }
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group sessions by day of week
  const weekSchedule = dayNames.map((dayName, index) => {
    const daySessions = sessions.filter(s => {
      // Convert day_of_week: 1=Monday, 2=Tuesday, etc., or 0=Sunday
      const sessionDay = s.day_of_week === 0 ? 6 : s.day_of_week - 1;
      return sessionDay === index;
    });

    return {
      day: dayName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: daySessions.map(s => ({
        id: s.id,
        title: s.courses?.name || 'Course',
        time: `${s.start_time || ''} - ${s.end_time || ''}`,
        location: s.room || 'TBD',
        type: s.room ? 'in-person' : 'online',
        instructor: s.instructors?.profiles?.full_name || 'TBD',
      })),
    };
  });

  const upcomingEvents: any[] = []; // TODO: Implement events if needed

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
        <h1 className="text-3xl font-bold text-[#0a0a5c]">My Schedule</h1>
        <p className="text-muted-foreground mt-1">
          View your weekly classes and upcoming events
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#3abafb]" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weekSchedule.map((day) => (
                <div
                  key={day.day}
                  className="border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground">{day.day}</p>
                      <p className="font-semibold text-[#0a0a5c]">{day.date}</p>
                    </div>
                    <div className="flex-1">
                      {day.sessions.length > 0 ? (
                        <div className="space-y-2">
                          {day.sessions.map((session) => (
                            <div
                              key={session.id}
                              className="bg-[#f0f9ff] rounded-lg p-3 flex items-center justify-between"
                            >
                              <div>
                                <h4 className="font-medium text-[#0a0a5c]">
                                  {session.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {session.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {session.type === "online" ? (
                                      <Video className="h-3 w-3" />
                                    ) : (
                                      <MapPin className="h-3 w-3" />
                                    )}
                                    {session.location}
                                  </span>
                                </div>
                              </div>
                              {session.type === "online" && (
                                <Button
                                  size="sm"
                                  className="bg-[#3abafb] hover:bg-[#3abafb]/90 text-[#0a0a5c]"
                                >
                                  Join
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No classes scheduled
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 border-[#3abafb] pl-4 py-2"
                  >
                    <Badge
                      variant="secondary"
                      className="mb-2 bg-[#ffb800]/10 text-[#0a0a5c] capitalize"
                    >
                      {event.type}
                    </Badge>
                    <h4 className="font-medium text-[#0a0a5c]">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming events scheduled.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
