"use client";
import React from "react";
import Link from "next/link";
import { IconSchool, IconUsers, IconShieldCheck, IconRocket, IconHeart, IconChevronRight } from "@tabler/icons-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
            {/* Header / Hero */}
            <div className="relative py-32 px-6 text-center border-b border-white/5 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/10 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full"></div>
                
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <IconSchool size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Our Story</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter uppercase leading-none">Global Mission</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase text-[10px] tracking-widest leading-relaxed opacity-60">
                        Synthesizing intelligence to empower academic ecosystems worldwide.
                    </p>
                    <Link href="/" className="mt-12 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/5 transition-all active:scale-95 shadow-2xl shadow-indigo-500/5">
                        ← RETURN TO NEXUS
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-32 space-y-32 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 blur-[200px] rounded-full -z-10"></div>

                {/* Introduction */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="space-y-2">
                             <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.5em] block">Operational Objectives</span>
                             <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">Architecting the Future</h2>
                        </div>
                        <p className="text-slate-500 leading-relaxed font-bold uppercase text-[11px] tracking-widest">
                            Technical inefficiencies in academic logistics consume critical resources. SMARTCAMPUS was engineered to solve the complexity of manual registry management, temporal scheduling, and information distribution.
                        </p>
                        <p className="text-slate-500 leading-relaxed font-bold uppercase text-[11px] tracking-widest opacity-60">
                            Our primary protocol is to provide every institutional node with a synchronized digital interface that autonomously manages logistical operations, allowing faculty and students to focus on intellectual synthesis.
                        </p>
                        
                        <div className="pt-6">
                            <div className="p-8 bg-[#0f172a] rounded-[2.5rem] border border-white/5 inline-flex flex-col gap-4 shadow-2xl group cursor-default">
                                <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                         <IconShieldCheck size={20} />
                                     </div>
                                     <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified Secure Node</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0f172a] h-[450px] rounded-[4rem] border border-white/5 overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] group">
                        <img
                            src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000"
                            alt="College Student"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent"></div>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="grid md:grid-cols-3 gap-10">
                    {[
                        { title: "Strategic Vision", desc: "Digitalizing academic ecosystems for absolute efficiency and transparency across all nodes.", icon: IconHeart, color: "text-rose-400", bg: "bg-rose-500/10" },
                        { title: "Core Mission", desc: "Automating logistical protocols to shift the focus from administrative work to core learning.", icon: IconRocket, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { title: "Integrity Shield", desc: "Securing student data with high-level encryption and private digital identity management.", icon: IconShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#0f172a] p-12 rounded-[3.5rem] border border-white/5 shadow-2xl group hover:border-indigo-500/20 transition-all relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color.replace('text', 'bg')} opacity-5 blur-3xl -translate-y-12 translate-x-12 rounded-full`}></div>
                            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-[1.5rem] flex items-center justify-center mb-10 border border-white/5 group-hover:rotate-6 transition-all shadow-xl`}>
                                <stat.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-6 leading-none">{stat.title}</h3>
                            <p className="text-slate-500 text-[10px] font-black leading-relaxed uppercase tracking-widest opacity-80">
                                {stat.desc}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Technical Reach */}
                <section className="bg-[#0f172a] p-16 lg:p-24 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[150px] rounded-full translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-20 items-center">
                        <div className="w-48 h-48 bg-[#070b14] rounded-full border border-white/5 shrink-0 flex items-center justify-center font-black text-4xl text-indigo-400 shadow-3xl group-hover:scale-110 transition-transform">
                             CORE
                        </div>
                        <div className="space-y-8 text-center md:text-left">
                            <h3 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none text-white">Zero Latency Learning</h3>
                            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed max-w-2xl">
                                Our platform leverages neural recognition and real-time synchronization to unify campus operations. It provides a seamless, high-speed interface for all academic participants across every mobile terminal.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-4 font-black text-indigo-400 uppercase tracking-[0.4em] text-[10px] group/btn transition-all">
                                ACCESS CHANNEL <IconChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
}
