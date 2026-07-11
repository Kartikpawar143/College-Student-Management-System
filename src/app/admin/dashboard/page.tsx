"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import { 
    IconUsers, IconUserStar, IconCircleCheck, 
    IconAlertCircle, IconDoor, IconBriefcase, 
    IconChartBar, IconFileDownload, IconActivity,
    IconSparkles, IconShieldCheck, IconArrowUpRight, IconSettings,
    IconSearch, IconFilter, IconCalendarClock
} from "@tabler/icons-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        attendanceToday: 0,
        pendingLeaves: 0,
        pendingGatepass: 0,
        placementStats: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("http://localhost:8001/stats/admin");
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconSparkles size={10} className="text-indigo-400" />
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Admin Hub</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Admin Hub</h2>
                        <p className="text-xs font-bold text-slate-500 leading-none">
                            Today is <span className="text-indigo-400 font-black">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>.
                        </p>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto relative z-10">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0f172a] border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all">
                            <IconFileDownload size={16} /> Downloads
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                            <IconSettings size={18} /> Manage
                        </button>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Total Students", val: stats.totalStudents, icon: IconUsers, color: "text-indigo-400", bg: "bg-indigo-500/10", desc: "All Profile Nodes" },
                        { title: "Teacher Members", val: stats.totalTeachers, icon: IconUserStar, color: "text-purple-400", bg: "bg-purple-500/10", desc: "Our Faculty" },
                        { title: "Daily Attendance", val: `${stats.attendanceToday}%`, icon: IconCircleCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "Today's Record" },
                        { title: "New Leave", val: stats.pendingLeaves, icon: IconAlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", desc: "Wait for Approval" },
                        { title: "Gate Passes", val: stats.pendingGatepass, icon: IconDoor, color: "text-rose-400", bg: "bg-rose-500/10", desc: "Recent Requests" },
                        { title: "Active Jobs", val: stats.placementStats, icon: IconBriefcase, color: "text-blue-400", bg: "bg-blue-500/10", desc: "Job Placements" },
                    ].map((stat, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] bg-[#0f172a] border border-white/5 shadow-xl hover:border-indigo-500/20 transition-all duration-300 cursor-pointer overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.color.replace('text', 'bg')} opacity-5 blur-2xl -translate-y-8 translate-x-8 rounded-full`}></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:rotate-3 transition-all border border-white/5 shadow-sm`}>
                                    <stat.icon size={22} />
                                </div>
                                <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all border border-white/5">
                                    <IconArrowUpRight size={14} />
                                </div>
                            </div>
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 relative z-10">{stat.title}</h4>
                            <p className="text-3xl font-black text-white tracking-tight mb-3 relative z-10">{stat.val}</p>
                            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest relative z-10">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Large Activity View */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-[#0f172a] p-10 rounded-[3rem] shadow-xl border border-white/5 relative overflow-hidden group font-sans">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Total Activity</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Checking how college is performing</p>
                            </div>
                            <div className="flex items-center gap-3">
                                 <div className="flex p-1 bg-[#070b14]/50 border border-white/5 rounded-xl">
                                    {['Weekly', 'Monthly'].map(period => (
                                        <button key={period} className="px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-indigo-400 transition-all leading-none">
                                            {period}
                                        </button>
                                    ))}
                                 </div>
                            </div>
                        </div>

                        <div className="h-64 w-full bg-[#070b14]/40 rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center group-hover:bg-[#070b14]/60 transition-all relative z-10">
                             <div className="w-14 h-14 rounded-full bg-[#0f172a] flex items-center justify-center text-slate-600 mb-4 shadow-xl border border-white/5 group-hover:text-indigo-400 transition-colors">
                                <IconChartBar size={32} />
                             </div>
                             <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Reports & Live View</h5>
                             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2 px-10 text-center max-w-sm">Global data will update here as things happen across college.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
