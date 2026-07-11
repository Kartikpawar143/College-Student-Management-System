"use client";
import React from "react";
import Link from "next/link";
import { IconCpu, IconBuildingBridge, IconSettings, IconDeviceDesktop, IconAntennaBars5, IconBrain, IconServer, IconChevronRight } from "@tabler/icons-react";

const departments = [
    {
        name: "Computer Tech",
        icon: IconDeviceDesktop,
        desc: "Learn how to build software, apps, and manage computer systems.",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        name: "AI & Data",
        icon: IconBrain,
        desc: "Study smart machines and how they learn to make our lives better.",
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    {
        name: "Cyber Security",
        icon: IconServer,
        desc: "Learn how to protect data and keep the internet safe for everyone.",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        name: "Civil & Design",
        icon: IconBuildingBridge,
        desc: "Design and build strong structures like buildings and bridges.",
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        name: "Mechanical",
        icon: IconSettings,
        desc: "Learn how machines work and how to build new tools and robots.",
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
    {
        name: "Electronics",
        icon: IconAntennaBars5,
        desc: "Study chips, circuits, and how devices communicate with each other.",
        color: "text-purple-600",
        bg: "bg-purple-50"
    }
];

export default function DepartmentsPage() {
    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
            <div className="relative py-40 px-6 text-center border-b border-white/5 overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/10 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full"></div>
                
                <div className="relative z-10 space-y-10">
                    <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <IconCpu size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Operational Sectors</span>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.85]">Academic <br /> Architecture</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase text-[11px] tracking-widest leading-relaxed opacity-60">
                        Explore our high-performance specialization clusters engineered for the next generation of technical pioneers.
                    </p>
                    <Link href="/" className="mt-16 inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white bg-white/5 hover:bg-white/10 px-12 py-5 rounded-[2.5rem] border border-white/5 transition-all active:scale-95 shadow-3xl shadow-indigo-500/10">
                        ← RETURN TO NEXUS
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-40 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 blur-[200px] rounded-full -z-10"></div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                        { name: "Computer Tech", icon: IconDeviceDesktop, desc: "Engineering high-availability software architectures and distributed systems management.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { name: "AI & Neural", icon: IconBrain, desc: "Synthesizing deep learning models and autonomous intelligence for complex problem sets.", color: "text-rose-400", bg: "bg-rose-500/10" },
                        { name: "Cyber Intel", icon: IconServer, desc: "Implementing cryptographic protocols and secure information defense systems.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { name: "Structural", icon: IconBuildingBridge, desc: "Designing resilient physical infrastructures and large-scale architectural frameworks.", color: "text-amber-400", bg: "bg-amber-500/10" },
                        { name: "Systems Eng", icon: IconSettings, desc: "Developing advanced mechanical protocols and automated robotics for efficiency.", color: "text-blue-400", bg: "bg-blue-500/10" },
                        { name: "Signal Comms", icon: IconAntennaBars5, desc: "Architecting circuit logic and high-speed data transmission interfaces.", color: "text-purple-400", bg: "bg-purple-500/10" }
                    ].map((dept, idx) => (
                        <div key={idx} className="bg-[#0f172a] border border-white/5 rounded-[4rem] p-12 hover:border-indigo-500/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${dept.color.replace('text', 'bg')} opacity-5 blur-3xl -translate-y-12 translate-x-12 rounded-full`}></div>
                            <div className={`w-16 h-16 ${dept.bg} ${dept.color} rounded-[1.5rem] flex items-center justify-center mb-12 border border-white/5 shadow-xl group-hover:scale-110 transition-transform`}>
                                <dept.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight leading-none">{dept.name}</h3>
                            <p className="text-slate-500 text-[10px] font-black leading-relaxed uppercase tracking-widest opacity-80 mb-10">
                                {dept.desc}
                            </p>
                            <div className="border-t border-white/5 pt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                                <span className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span> 
                                    ACTIVE CLUSTER
                                </span>
                                <span className="text-indigo-400 cursor-pointer hover:text-white transition-all flex items-center gap-3 group/btn">DETAILS <IconChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" /></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
