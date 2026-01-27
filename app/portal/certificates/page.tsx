"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getStudentEnrollments } from "@/lib/supabase/actions/student-portal";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [inProgressCertificates, setInProgressCertificates] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Get completed courses as certificates
      const result = await getStudentEnrollments(user.id);
      if (result.data) {
        const completed = result.data.filter(e => e.status === 'completed');
        const active = result.data.filter(e => e.status === 'active');
        
        setCertificates(completed.map(e => ({
          id: e.id,
          title: e.courses?.name || 'Course',
          level: e.courses?.level || 'Beginner',
          issueDate: new Date(e.enrolled_at).toLocaleDateString(),
          credentialId: `NB-${e.id.slice(0, 8).toUpperCase()}`,
          courseId: e.course_id,
        })));
        
        setInProgressCertificates(active.map(e => ({
          id: e.id,
          title: e.courses?.name || 'Course',
          level: e.courses?.level || 'Beginner',
          progress: 0, // TODO: Calculate actual progress
          expectedDate: 'TBD',
        })));
      }
    } catch (err) {
      console.error("Error loading certificates:", err);
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
        <h1 className="text-3xl font-bold text-[#0a0a5c]">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          View and download your earned certificates
        </p>
      </div>

      {/* Earned Certificates */}
      <div>
        <h2 className="text-xl font-semibold text-[#0a0a5c] mb-4">
          Earned Certificates
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {certificates.length > 0 ? (
            certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-[#0a0a5c] via-[#1a1a7c] to-[#3abafb] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('/api/placeholder/400/200')] opacity-5" />
                <div className="text-center text-white z-10">
                  <Award className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">{cert.title}</h3>
                  <p className="text-[#3abafb]">Certificate of Completion</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-[#ffb800]/10 text-[#0a0a5c]"
                  >
                    {cert.level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Issued: {cert.issueDate}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Credential ID: {cert.credentialId}
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#0a0a5c] hover:bg-[#1a1a7c] text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[#0a0a5c] text-[#0a0a5c] bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No certificates earned yet.</p>
              <p className="text-sm mt-2">Complete courses to earn certificates.</p>
            </div>
          )}
        </div>
      </div>

      {/* In Progress */}
      <div>
        <h2 className="text-xl font-semibold text-[#0a0a5c] mb-4">
          In Progress
        </h2>
        <div className="grid gap-4">
          {inProgressCertificates.length > 0 ? (
            inProgressCertificates.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#3abafb]/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-[#3abafb]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a0a5c]">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Expected: {cert.expectedDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#0a0a5c]">
                    {cert.progress}%
                  </p>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No certificates in progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
