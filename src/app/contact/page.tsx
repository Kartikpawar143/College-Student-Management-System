"use client";
import React from "react";
import Link from "next/link";
import { 
    IconMail, IconPhone, IconMapPin, IconMessageCircle2, IconClock, 
    IconBrandLinkedin, IconBrandTwitter, IconBrandGithub, IconSparkles, IconRocket, IconChevronRight 
} from "@tabler/icons-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
            {/* Split Header */}
            <div className="grid lg:grid-cols-2 min-h-[70vh] border-b border-white/5">
                <div className="bg-[#0a101d] px-12 lg:px-24 py-32 flex flex-col justify-center relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 to-transparent"></div>
                     <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
                     
                     <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Help & Support</span>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">Communication <br /> Gateway</h1>
                        <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed max-w-sm opacity-60">
                           Our strategic support nodes are active 24/7. Initialize a transmission and our tactical team will respond within the current cycle.
                        </p>
                        <div className="mt-12 flex items-center gap-6">
                             <Link href="/" className="text-[10px] font-black text-white uppercase tracking-widest bg-white/5 border border-white/5 px-10 py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-95 shadow-2xl">← RETURN TO HOME</Link>
                        </div>
                     </div>
                </div>

                <div className="bg-[#070b14] p-12 lg:p-24 flex flex-col justify-center relative group">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    
                    <form className="space-y-8 relative z-10 uppercase tracking-widest">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3 group/input">
                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-4 transition-colors group-focus-within/input:text-indigo-400">Registry Name</label>
                                <input type="text" placeholder="NODE IDENTITY..." className="w-full bg-[#0f172a] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl" />
                            </div>
                            <div className="space-y-3 group/input">
                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-4 transition-colors group-focus-within/input:text-indigo-400">Sync Email</label>
                                <input type="email" placeholder="IDENTITY@NODE.COM..." className="w-full bg-[#0f172a] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl lowercase" />
                            </div>
                        </div>
                        <div className="space-y-3 group/input">
                             <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-4 transition-colors group-focus-within/input:text-indigo-400">Transmission Vector</label>
                             <input type="text" placeholder="SUBJECT OF INQUIRY..." className="w-full bg-[#0f172a] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl" />
                        </div>
                        <div className="space-y-3 group/input">
                             <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-4 transition-colors group-focus-within/input:text-indigo-400">Encrypted Message</label>
                             <textarea rows={4} placeholder="TYPE YOUR TRANSMISSION HERE..." className="w-full bg-[#0f172a] border border-white/5 rounded-[3rem] px-8 py-6 text-[10px] font-black text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl resize-none"></textarea>
                        </div>
                        <button className="w-full bg-indigo-600 text-white font-black px-10 py-7 rounded-[4rem] uppercase text-[11px] tracking-[0.5em] hover:bg-indigo-500 transition-all shadow-3xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-4">
                            INITIALIZE SYNC <IconRocket size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Info Cards */}
            <div className="max-w-7xl mx-auto px-6 py-40 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[180px] rounded-full -z-10"></div>

                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        { title: "Digital Channel", val: "HELLO@SMARTCAMPUS.AI", icon: IconMail, color: "text-indigo-400", bg: "bg-indigo-500/10", note: "SYNCED IN 2 HOURS" },
                        { title: "Temporal Window", val: "OPEN 24/7/365", icon: IconClock, color: "text-rose-400", bg: "bg-rose-500/10", note: "TACTICAL SUPPORT LIVE" },
                        { title: "Central Command", val: "TECH PARK, PUNE", icon: IconMapPin, color: "text-emerald-400", bg: "bg-emerald-500/10", note: "PHYSICAL NODE" }
                    ].map((card, i) => (
                        <div key={i} className="p-12 bg-[#0f172a] rounded-[4rem] border border-white/5 hover:border-indigo-500/20 transition-all duration-500 group relative overflow-hidden shadow-2xl">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${card.color.replace('text', 'bg')} opacity-5 blur-3xl -translate-y-12 translate-x-12 rounded-full`}></div>
                            <div className={`w-16 h-16 ${card.bg} ${card.color} mb-12 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl group-hover:scale-110 transition-transform`}>
                                <card.icon size={32} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 mb-3">{card.title}</h4>
                            <p className="text-xl font-black text-white mb-6 tracking-tight uppercase leading-none">{card.val}</p>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-[#070b14] border border-white/5 inline-block px-4 py-2 rounded-xl shadow-xl">{card.note}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-16 relative z-10">
                    <div className="flex gap-12">
                        <IconBrandLinkedin className="text-slate-700 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110" size={32} />
                        <IconBrandTwitter className="text-slate-700 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110" size={32} />
                        <IconBrandGithub className="text-slate-700 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110" size={32} />
                    </div>
                    <div>
                         <div className="flex items-center gap-5 bg-indigo-600 text-white px-10 py-6 rounded-[3rem] shadow-[0_30px_60px_rgba(79,70,229,0.3)] active:scale-95 transition-all cursor-pointer">
                             <div className="w-12 h-12 bg-[#070b14] rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 shadow-2xl">
                                <IconPhone size={24} />
                             </div>
                             <div className="leading-tight uppercase tracking-widest">
                                <p className="text-[10px] font-black mb-1 opacity-70 tracking-[0.2em]">Live Audio Feed</p>
                                <p className="text-xs font-black">1800-SMART-CAMPUS</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
