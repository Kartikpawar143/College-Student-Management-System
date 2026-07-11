"use client";
import React from "react";
import Link from "next/link";
import { IconRocket, IconFingerprint, IconForms, IconCalendarEvent, IconShieldCheck, IconCpu, IconChevronRight } from "@tabler/icons-react";

export default function AdmissionsPage() {
    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
            {/* Header */}
            <div className="relative py-40 px-6 text-center border-b border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 space-y-10">
                    <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                         <IconRocket size={12} className="text-indigo-400" />
                         <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Institutional Enrollment</span>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.85]">Initialize Your <br /> Academic Cycle</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase text-[11px] tracking-widest leading-relaxed opacity-60">
                        Synchronize with our digital gateway to secure your institutional node. 
                        A seamless, fast, and automated onboarding protocol.
                    </p>
                    <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6">
                        <button className="bg-indigo-600 text-white px-10 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all shadow-3xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-4">
                            INITIALIZE ENROLLMENT <IconChevronRight size={18} />
                        </button>
                        <Link href="/" className="bg-[#0f172a] border border-white/5 text-white px-10 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl">
                            RETURN TO NEXUS
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-40 space-y-40 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 blur-[200px] rounded-full -z-10"></div>
                
                {/* Steps Section */}
                <section>
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">Onboarding Protocol</h2>
                        <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">Operational Directives</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { step: "01", title: "Information Sync", desc: "Digital data transmission via secure registry forms. Real-time validation for absolute accuracy.", icon: IconForms, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                            { step: "02", title: "Neural Recognition", desc: "Biometric identity verification for automated registry logging and secure campus access control.", icon: IconFingerprint, color: "text-rose-400", bg: "bg-rose-500/10" },
                            { step: "03", title: "Site Integration", desc: "Document authentication and seating allocation finalized within the digital matrix. Access code granted.", icon: IconShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" }
                        ].map((directive, i) => (
                            <div key={i} className="bg-[#0f172a] p-12 rounded-[4rem] border border-white/5 shadow-3xl relative group hover:border-indigo-500/20 transition-all duration-500 overflow-hidden">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${directive.color.replace('text', 'bg')} opacity-5 blur-3xl -translate-y-12 translate-x-12 rounded-full`}></div>
                                <div className={`w-16 h-16 ${directive.bg} ${directive.color} rounded-[1.5rem] flex items-center justify-center mb-10 border border-white/5 group-hover:rotate-6 transition-all shadow-xl`}>
                                    <directive.icon size={32} />
                                </div>
                                <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] mb-3">{directive.step}. {directive.title}</h4>
                                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight leading-none">{directive.title.split(' ')[1] || directive.title} Hub</h3>
                                <p className="text-slate-500 text-[10px] font-black leading-relaxed uppercase tracking-widest opacity-80">
                                    {directive.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Important Dates */}
                <section className="bg-[#0f172a] rounded-[5rem] p-16 lg:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col lg:flex-row gap-24 items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[150px] rounded-full translate-x-1/2"></div>
                    <div className="lg:w-1/2 relative z-10 space-y-10">
                        <div className="w-20 h-20 bg-[#070b14] rounded-3xl flex items-center justify-center text-indigo-400 border border-white/5 shadow-2xl group-hover:scale-110 transition-transform">
                            <IconCalendarEvent size={40} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">Registry Temporal Constraints</h2>
                            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
                                Synchronize your schedule with these key temporal markers to ensure operational compliance within the academic cycle.
                            </p>
                        </div>
                        <div className="flex gap-6 grayscale opacity-20">
                             <div className="font-black text-xs tracking-[0.4em] uppercase text-white">CYCLE 2026</div>
                             <div className="font-black text-xs tracking-[0.4em] uppercase text-white">NEW SECTOR</div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full space-y-6 relative z-10">
                        {[
                            { date: "OCT/15", event: "REGISTRY OPEN" },
                            { date: "NOV/30", event: "CLOSING PROTOCOL" },
                            { date: "DEC/10", event: "VERIFICATION PHASE" },
                            { date: "JAN/05", event: "SYSTEM ACTIVATION" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-8 p-8 bg-[#070b14]/50 rounded-[2.5rem] border border-white/5 group/row hover:bg-white/5 hover:border-indigo-500/20 transition-all cursor-default shadow-xl">
                                <div className="text-indigo-400 font-black text-2xl tracking-tighter w-24 shrink-0 group-hover/row:scale-110 transition-transform">{item.date}</div>
                                <div className="h-10 w-[1px] bg-white/5"></div>
                                <div className="text-white font-black uppercase text-xs tracking-[0.3em]">{item.event}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technical Callout */}
                <section className="bg-indigo-600 p-20 rounded-[5rem] text-white text-center shadow-[0_50px_100px_rgba(79,70,229,0.3)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#070b14]/20 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2 opacity-50"></div>
                    
                    <div className="relative z-10 space-y-10">
                        <IconCpu size={64} className="mx-auto text-white group-hover:rotate-12 transition-all duration-700" />
                        <div className="space-y-4">
                            <h3 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">Architectural Dominance</h3>
                            <p className="text-white max-w-2xl mx-auto font-black uppercase text-[11px] tracking-[0.4em] leading-relaxed opacity-80">
                                Utilizing neural networking to ensure a high-fidelity campus experience. Zero-latency processing for ten thousand concurrent nodes.
                            </p>
                        </div>
                        <div className="pt-4 flex justify-center">
                            <div className="px-10 py-5 bg-[#070b14] rounded-full border border-white/10 font-black uppercase text-[9px] tracking-[0.5em] shadow-3xl">SECURED BY SMARTCAMPUS v2.0</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
