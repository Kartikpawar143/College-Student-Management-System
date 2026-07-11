"use client";
import React from "react";
import Link from "next/link";
import { IconBook, IconBus, IconWifi, IconBed, IconFirstAidKit, IconBallFootball, IconSparkles } from "@tabler/icons-react";

const facilities = [
    {
        title: "Modern Library",
        icon: IconBook,
        desc: "Access thousands of books and online research papers easily through our smart search system."
    },
    {
        title: "Smart Transport",
        icon: IconBus,
        desc: "Safe and comfortable buses that connect all major parts of the city to our campus."
    },
    {
        title: "Sports & Fun",
        icon: IconBallFootball,
        desc: "Play football, cricket, and more on our big athletic fields. We also have a dedicated gaming lounge."
    },
    {
        title: "High-Speed Wi-Fi",
        icon: IconWifi,
        desc: "Enjoy free, high-speed internet anywhere on campus so you can stay connected and study better."
    },
    {
        title: "Safe Hostels",
        icon: IconBed,
        desc: "Comfortable rooms with 24/7 security. It's like a second home for students coming from far away."
    },
    {
        title: "Health Center",
        icon: IconFirstAidKit,
        desc: "Quick medical help is always available on campus for any emergency or regular checkup."
    }
];

export default function FacilitiesPage() {
    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
            <div className="relative py-40 px-6 text-center border-b border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 space-y-10">
                    <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <IconSparkles size={12} className="text-indigo-400" />
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Campus Infrastructure</span>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.85]">Strategic <br /> Resource Nodes</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase text-[11px] tracking-widest leading-relaxed opacity-60">
                        Operational support systems and logistical framework designed for maximum efficiency and high-fidelity student life.
                    </p>
                    <Link href="/" className="mt-16 inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white bg-white/5 hover:bg-white/10 px-12 py-5 rounded-[2.5rem] border border-white/5 transition-all active:scale-95 shadow-3xl shadow-indigo-500/10">
                        ← RETURN TO NEXUS
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-40 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 blur-[200px] rounded-full -z-10"></div>
                
                <div className="grid md:grid-cols-2 gap-10">
                    {facilities.map((fac, idx) => (
                        <div key={idx} className="flex flex-col lg:flex-row gap-10 items-start p-12 bg-[#0f172a] rounded-[4rem] hover:border-indigo-500/20 hover:shadow-3xl transition-all border border-white/5 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="w-16 h-16 bg-[#070b14] text-indigo-400 rounded-3xl flex items-center justify-center shrink-0 border border-white/5 shadow-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all transform duration-700 group-hover:rotate-6">
                                <fac.icon size={32} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-tight leading-none">{fac.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-[10px] font-black uppercase tracking-widest opacity-80">
                                    {fac.desc}
                                </p>
                                <div className="pt-4 flex items-center gap-3">
                                    <div className="h-1 w-12 bg-indigo-500/20 rounded-full group-hover:w-20 transition-all duration-700"></div>
                                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Operational Phase 1.0</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
