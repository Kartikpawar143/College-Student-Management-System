"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconSparkles } from "@tabler/icons-react";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
        <div className="flex min-h-screen bg-[#070b14] font-sans selection:bg-indigo-500/30">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-72 z-50">
                <Sidebar />
            </div>

            {/* Main Content (Right) */}
            <main className="flex-1 ml-72 flex flex-col h-screen overflow-y-auto relative custom-scrollbar">
                {/* Global Theme Gradients */}
                <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
                
                <div className="flex-1">
                    <div className="min-h-screen">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
