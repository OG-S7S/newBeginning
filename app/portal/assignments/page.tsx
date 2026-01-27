"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [submittedAssignments, setSubmittedAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // TODO: Implement assignments table and fetch real data
      // For now, show empty state
      setPendingAssignments([]);
      setSubmittedAssignments([]);
    } catch (err) {
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-[#0a0a5c]">Assignments</h1>
        <p className="text-muted-foreground mt-1">
          View and submit your assignments
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-[#f0f9ff]">
          <TabsTrigger value="pending" className="data-[state=active]:bg-white">
            Pending ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger
            value="submitted"
            className="data-[state=active]:bg-white"
          >
            Submitted ({submittedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className={
                assignment.status === "urgent" ? "border-[#ffb800]" : ""
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        assignment.status === "urgent"
                          ? "bg-[#ffb800]/10"
                          : "bg-[#3abafb]/10"
                      }`}
                    >
                      <FileText
                        className={`h-6 w-6 ${
                          assignment.status === "urgent"
                            ? "text-[#ffb800]"
                            : "text-[#3abafb]"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#0a0a5c]">
                          {assignment.title}
                        </h3>
                        {assignment.status === "urgent" && (
                          <Badge className="bg-[#ffb800] text-[#0a0a5c]">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Due Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {assignment.course}
                      </p>
                      <p className="text-sm mt-2">{assignment.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due: {assignment.dueDate}
                        </span>
                        <span
                          className={`font-medium ${
                            assignment.daysLeft <= 2
                              ? "text-[#ffb800]"
                              : "text-[#0a0a5c]"
                          }`}
                        >
                          {assignment.daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button className="bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending assignments at this time.</p>
              <p className="text-sm mt-2">Check back later for new assignments.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.length > 0 ? (
            submittedAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        assignment.status === "graded"
                          ? "bg-green-100"
                          : "bg-[#3abafb]/10"
                      }`}
                    >
                      {assignment.status === "graded" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Clock className="h-6 w-6 text-[#3abafb]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#0a0a5c]">
                          {assignment.title}
                        </h3>
                        {assignment.status === "graded" && assignment.grade && (
                          <Badge className="bg-green-100 text-green-700">
                            Grade: {assignment.grade}
                          </Badge>
                        )}
                        {assignment.status === "under-review" && (
                          <Badge
                            variant="secondary"
                            className="bg-[#3abafb]/10 text-[#0a0a5c]"
                          >
                            Under Review
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {assignment.course}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submitted: {assignment.submittedDate}
                      </p>
                      {assignment.feedback && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            Instructor Feedback:
                          </p>
                          <p className="text-sm text-green-700">
                            {assignment.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Submission
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No submitted assignments yet.</p>
              <p className="text-sm mt-2">Your submitted assignments will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
