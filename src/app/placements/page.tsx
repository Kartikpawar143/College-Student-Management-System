"use client";
import React from "react";
import Link from "next/link";
import { IconRocket } from "@tabler/icons-react";

export default function PlacementsPage() {
    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
            <div className="relative py-40 px-6 text-center border-b border-white/5 overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/10 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full"></div>
                
                <div className="relative z-10 space-y-10">
                    <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <IconRocket size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Career Matrix</span>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.85]">Professional <br /> Trajectory</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase text-[11px] tracking-widest leading-relaxed opacity-60">
                        Synchronizing global hiring nodes with our elite technical talent. Secure your operational role in the industry.
                    </p>
                    <Link href="/" className="mt-16 inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white bg-white/5 hover:bg-white/10 px-12 py-5 rounded-[2.5rem] border border-white/5 transition-all active:scale-95 shadow-3xl shadow-indigo-500/10">
                        ← RETURN TO NEXUS
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-40 space-y-40 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 blur-[200px] rounded-full -z-10"></div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {[
                        { val: "1,200+", label: "HIRING PARTNERS", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { val: "92%", label: "SUCCESS RATE", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { val: "₹8.5 LPA", label: "BASE CYCLE SALARY", color: "text-rose-400", bg: "bg-rose-500/10" },
                        { val: "5,000+", label: "SYNCED ALUMNI", color: "text-amber-400", bg: "bg-amber-500/10" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#0f172a] p-12 rounded-[4rem] shadow-3xl text-center border border-white/5 hover:border-indigo-500/20 transition-all group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color.replace('text', 'bg')} opacity-5 blur-3xl rounded-full translate-x-12 -translate-y-12`}></div>
                            <div className={`text-4xl font-black ${stat.color} mb-4 tracking-tighter group-hover:scale-110 transition-transform`}>{stat.val}</div>
                            <div className="text-[9px] uppercase font-black text-slate-700 tracking-[0.4em] leading-none">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Recruiters Grid */}
                <div className="text-center space-y-20 relative z-10">
                    <div className="space-y-4">
                         <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em]">Industry Protocol</h2>
                         <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">Global Partnership Nodes</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                        {["TECH-CORP", "DATA-SYNC", "GLOBAL-IT", "NEXUS", "VERTEX", "FORUM", "QUANTUM", "CYBER-DOME", "SILVER-LINE", "CORE-ENGINE", "LOGIC-GRID", "AZURE-BASE"].map((company, i) => (
                            <div key={i} className="bg-[#0f172a] h-32 flex items-center justify-center rounded-[2.5rem] border border-white/5 font-black text-[10px] tracking-[0.3em] text-slate-600 shadow-2xl hover:border-indigo-500/50 hover:text-white transition-all">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
