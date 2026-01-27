"use client";

import React from "react"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  DollarSign,
  BarChart,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Programs",
    href: "/admin/programs",
    icon: BookOpen,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    title: "Instructors",
    href: "/admin/instructors",
    icon: Users,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Schedule",
    href: "/admin/schedule",
    icon: Calendar,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<{ full_name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      // Verify admin role
      supabase
        .from("profiles")
        .select("full_name, email, role")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            router.push("/login");
            return;
          }

          if (data.role !== "admin") {
            router.push("/portal/dashboard");
            return;
          }

          setProfile(data);
        });
    }
  }, [user, loading, router, supabase]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a0a5c] mx-auto"></div>
          <p className="mt-4 text-[#4a4a8a]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-[#0a0a5c] transform transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="text-white font-bold text-xl italic">new</span>
              <span className="text-white font-bold text-xl">Beginning</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Admin Badge */}
          <div className="px-4 py-3 bg-[#ffb800]/10">
            <p className="text-[#ffb800] text-sm font-medium">Admin Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-[#3abafb] text-[#0a0a5c] font-medium"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-semibold text-[#0a0a5c] hidden lg:block">
              Administration Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[#0a0a5c]">
                {profile?.full_name || "Admin User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.email || user.email || "admin@newbeginning.com"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#0a0a5c] flex items-center justify-center">
              <span className="text-white font-medium">
                {profile?.full_name
                  ? profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "A"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
