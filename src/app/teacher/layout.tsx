"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { IconSparkles } from "@tabler/icons-react";

function TeacherShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
    if (!isLoading && user && user.role !== "teacher") {
        router.replace("/" + (user.role || "login") + "/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] font-sans">
          <div className="flex flex-col items-center gap-8">
              <div className="relative">
                   <div className="w-16 h-16 border-4 border-white/5 border-t-indigo-600 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <IconSparkles size={20} className="text-indigo-400 animate-pulse" />
                   </div>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Just a second...</p>
          </div>
      </div>
    );
  }

  if (!user || user.role !== "teacher") return null;

  return (
    <div className="flex bg-[#070b14] min-h-screen font-sans selection:bg-indigo-500/30">
      {/* Sidebar (Left) */}
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} onNavigate={() => setMobileNavOpen(false)} />
      
      {/* Main Content (Right) */}
      <main className="min-w-0 flex-1 flex flex-col min-h-screen lg:h-screen lg:overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        {/* Dynamic Viewport (Content) */}
        <Navbar onMenuClick={() => setMobileNavOpen(true)} />
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div id="teacher-content" className="min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <TeacherShell>{children}</TeacherShell>
    </AuthProvider>
  );
}
