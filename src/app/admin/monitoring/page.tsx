"use client";
import React, { useState, useEffect } from "react";
import { 
    IconDeviceCameraPhone, IconActivity, IconCircleCheck, 
    IconAlertCircle, IconBroadcast, IconHistory,
    IconMaximize, IconSettings, IconShieldCheck,
    IconSparkles, IconArrowUpRight, IconCapture
} from "@tabler/icons-react";

export default function AdminMonitoringPage() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans selection:bg-indigo-500/30 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-white/5 relative">
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/10 blur-[150px] rounded-full"></div>
                    <div className="space-y-3 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconBroadcast size={12} className="text-indigo-400" />
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Live Stream</span>
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Control Room</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">
                            Real-time <span className="text-indigo-400">authentication nodes</span> and campus coverage.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-[#0f172a] p-5 rounded-[2.5rem] shadow-2xl border border-white/5 relative z-10">
                         <div className="text-right">
                             <p className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">
                                 {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                             </p>
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                         </div>
                         <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
                             <IconActivity size={24} className="animate-pulse" />
                         </div>
                    </div>
                </header>

                {/* Status Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { title: "Live Nodes", val: "12/12", icon: IconDeviceCameraPhone, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "Cameras Active" },
                        { title: "Coverage", val: "99.8%", icon: IconShieldCheck, color: "text-indigo-400", bg: "bg-indigo-500/10", desc: "Campus Perimeter" },
                        { title: "Auto-ID", val: "Enabled", icon: IconCapture, color: "text-purple-400", bg: "bg-purple-500/10", desc: "Face Recognition" },
                        { title: "Alerts", val: "0 Active", icon: IconCircleCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "No Incidents" }
                    ].map((stat, i) => (
                        <div key={i} className="group p-10 rounded-[3.5rem] bg-[#0f172a] border border-white/5 shadow-2xl hover:border-indigo-500/30 transition-all duration-500 cursor-pointer overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color.replace('text', 'bg')} opacity-5 blur-3xl -translate-y-12 translate-x-12 rounded-full`}></div>
                            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-10 group-hover:rotate-6 transition-all duration-500 border border-white/5 shadow-sm`}>
                                <stat.icon size={32} />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{stat.title}</h4>
                            <p className="text-4xl font-black text-white tracking-tighter mb-4">{stat.val}</p>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Main Viewport */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Live Stream View */}
                    <div className="lg:col-span-8 bg-[#0f172a] p-12 rounded-[4rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Main Entrance Feed</h3>
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-2">Authenticated stream verification</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-4 bg-[#070b14] text-slate-500 hover:text-white rounded-2xl border border-white/5 transition-all">
                                    <IconMaximize size={20} />
                                </button>
                                <button className="p-4 bg-[#070b14] text-slate-500 hover:text-white rounded-2xl border border-white/5 transition-all">
                                    <IconSettings size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Stream Mock Container */}
                        <div className="aspect-video w-full bg-[#070b14] rounded-[3rem] border border-white/5 flex items-center justify-center shadow-inner relative overflow-hidden group/stream cursor-crosshair">
                            <div className="absolute inset-0 bg-[#070b14]/50 backdrop-blur-sm group-hover/stream:backdrop-blur-0 transition-all duration-700 pointer-events-none z-10"></div>
                            <IconCapture size={80} className="text-indigo-600/20 absolute z-20 group-hover/stream:text-indigo-600/40 transition-colors animate-pulse" />
                            
                            {/* Scanning HUD */}
                            <div className="absolute top-10 left-10 z-30 space-y-4">
                                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                                    Live Stream [HQ]
                                </div>
                                <div className="px-4 py-2 bg-[#070b14]/80 border border-white/10 rounded-xl text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] font-sans">
                                    Gate: NODE_01_A
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-10 z-30 font-sans">
                                <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] bg-indigo-600/80 px-4 py-2 rounded-xl backdrop-blur-md">Auto-Matching Active</p>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Side Panel */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Detection Feed */}
                        <div className="bg-[#0f172a] p-12 rounded-[4rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
                            <div className="relative z-10 space-y-10">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Activity Stack</h3>
                                    <IconHistory size={24} className="text-indigo-400" />
                                </div>
                                
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-6 p-6 bg-[#070b14]/50 border border-white/5 rounded-[2.5rem] hover:bg-[#070b14]/80 transition-all cursor-pointer group/item">
                                            <div className="w-12 h-12 rounded-2xl bg-[#0f172a] border border-white/5 flex items-center justify-center text-slate-600 group-hover/item:text-emerald-400 transition-colors">
                                                <IconCircleCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="text-white font-black uppercase text-xs tracking-tight leading-none">Access Verified</p>
                                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-2">{i*5}s ago • Node 0{i}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-5 bg-white text-[#070b14] rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                                    Access Registry Logs
                                </button>
                            </div>
                        </div>

                        {/* Signal Status */}
                        <div className="bg-[#0f172a] p-10 rounded-[4rem] shadow-2xl border border-white/5 flex items-center justify-between">
                             <div className="flex items-center gap-5">
                                 <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
                                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Sync Status</p>
                             </div>
                             <p className="text-white font-black text-xs uppercase">Optimal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
