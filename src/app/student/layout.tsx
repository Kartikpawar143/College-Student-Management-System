"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconSparkles } from "@tabler/icons-react";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "student")) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== "student") {
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

    return (
        <div className="flex min-h-screen bg-[#07111d] font-sans selection:bg-cyan-300/30">
            <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} onNavigate={() => setMobileNavOpen(false)} />
            <main className="min-w-0 flex-1 flex flex-col min-h-screen lg:h-screen lg:overflow-hidden relative">
                <Navbar onMenuClick={() => setMobileNavOpen(true)} />
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div id="student-content" className="min-h-full">{children}</div>
                </div>
            </main>
        </div>
    );
}
