"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IconBell, IconSearch, IconCalendar, IconUser, IconChevronRight } from "@tabler/icons-react";

export default function NoticesPage() {
    const [filter, setFilter] = useState("all");

    const activeNotices = [
        { title: "New System Update Live", date: "Oct 12, 2026", cat: "system", desc: "Our new AI attendance system is now live for all students and teachers. It's faster and more secure." },
        { title: "Annual Science & Tech Fair", date: "Oct 10, 2026", cat: "event", desc: "Join us for the biggest science event of the year! Show your projects and win exciting prizes." },
        { title: "Exam Rules Updated", date: "Oct 08, 2026", cat: "exam", desc: "Please check the new rules for entering the exam hall. Remember to carry your ID card." },
        { title: "Weekend Network Maintenance", date: "Oct 05, 2026", cat: "system", desc: "The campus Wi-Fi will be down for a few hours this Sunday morning for a quick update." },
        { title: "Mega Job Fair Next Week", date: "Oct 01, 2026", cat: "jobs", desc: "Top companies are coming to our campus. Registered students please be ready with your resumes." },
    ];

    const categories = ["all", "system", "event", "exam", "jobs"];

    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
            {/* Header */}
            <div className="relative py-40 px-6 text-center border-b border-white/5 overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -z-10"></div>
                
                <div className="relative z-10 space-y-10">
                    <div className="w-20 h-20 bg-[#0f172a] rounded-[2.5rem] mx-auto flex items-center justify-center text-indigo-400 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group-hover:rotate-12 transition-all duration-700">
                        <IconBell size={40} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">Broadcast <br /> Matrix</h1>
                        <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase text-[11px] tracking-[0.4em] leading-relaxed opacity-60">
                           Strategic communications and institutional directives synchronized for the entire campus ecosystem.
                        </p>
                    </div>
                    <div className="mt-16 flex justify-center">
                         <Link href="/" className="px-10 py-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-3xl">
                            ← RETURN TO NEXUS
                         </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-40 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 blur-[200px] rounded-full -z-10"></div>
                
                {/* Search & Filter */}
                <div className="flex flex-col lg:flex-row gap-8 mb-24 relative z-10">
                    <div className="flex-1 relative group">
                        <IconSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors" size={24} />
                        <input type="text" placeholder="FILTER BROADCASTS..." className="w-full bg-[#0f172a] border border-white/5 rounded-[3rem] pl-20 pr-10 py-6 text-[10px] font-black tracking-[0.2em] text-white placeholder:text-slate-800 shadow-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 lg:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-10 py-6 rounded-[3rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border shadow-2xl ${
                                    filter === cat ? "bg-indigo-600 border-indigo-500 text-white shadow-3xl shadow-indigo-600/20" : "bg-[#0f172a] text-slate-600 hover:text-indigo-400 border-white/5"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notices List */}
                <div className="space-y-10 relative z-10">
                    {activeNotices.filter(n => filter === "all" || n.cat === filter).map((notice, idx) => (
                        <div key={idx} className="bg-[#0f172a] p-12 lg:p-16 rounded-[4.5rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.3)] hover:border-indigo-500/20 transition-all duration-700 group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[100%] blur-[80px]"></div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="px-6 py-2 bg-[#070b14] text-indigo-400 border border-indigo-500/20 rounded-xl text-[9px] font-black uppercase tracking-[0.4em] leading-none">
                                        {notice.cat}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-700 font-black text-[10px] uppercase tracking-[0.3em]">
                                        <IconCalendar size={18} className="text-indigo-400/50" /> {notice.date}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 group/link">
                                    SYNC DATA <IconChevronRight size={20} className="group-hover/link:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-6 leading-none group-hover:text-indigo-400 transition-colors uppercase">{notice.title}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed max-w-4xl text-[11px] uppercase tracking-[0.2em] opacity-80">
                                {notice.desc}
                            </p>

                            <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-2xl bg-[#070b14] border border-white/5 flex items-center justify-center text-indigo-400 shadow-2xl">
                                         <IconUser size={18} />
                                     </div>
                                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Institutional Registry Node</span>
                                 </div>
                                 <div className="flex gap-2">
                                     <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                     <div className="w-2 h-2 rounded-full bg-indigo-500/20"></div>
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-40 text-center">
                    <button className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 hover:text-white transition-all bg-[#0f172a] border border-white/5 px-16 py-7 rounded-[3rem] shadow-3xl active:scale-95">RETRIEVE ARCHIVED LOGS</button>
                </div>
            </div>
        </div>
    );
}
