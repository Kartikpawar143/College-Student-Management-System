"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { 
    IconChartBar, IconUsers, IconActivity, IconTrophy, IconUser,
    IconCalendarStats, IconArrowUpRight, IconArrowDownRight,
    IconDotsVertical, IconChecklist, IconSparkles, IconTrendingUp,
    IconSchool, IconCpu, IconShieldLock, IconTerminal2, IconLoader2
} from "@tabler/icons-react";

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        attendanceRate: "84.2%",
        efficiency: "98.8%"
    });

    const fetchRealStats = async () => {
        setLoading(true);
        try {
            const res = await api.get(endpoints.attendance.adminStats);
            const data = res.data;
            
            setStats({
                totalStudents: data.totalStudents,
                totalTeachers: data.totalTeachers,
                attendanceRate: `${data.attendanceToday}%`,
                efficiency: "99.2%"
            });
        } catch (err) {
            console.error("Metrix acquisition failure", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealStats();
    }, []);

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12 relative font-sans">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none"></div>
                
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative z-10 font-sans uppercase tracking-widest">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 leading-none">Intelligence Hub</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Performance Analytics</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Synthesizing institutional datasets and behavioral vectors [ADMIN ACCESS]</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <select className="bg-[#0f172a] border border-white/5 rounded-2xl px-10 py-5 text-[10px] font-black uppercase tracking-widest outline-none shadow-2xl focus:ring-4 focus:ring-indigo-500/10 transition-all text-white appearance-none cursor-pointer">
                            <option className="bg-[#0f172a]">Cycle: Current Semester</option>
                            <option className="bg-[#0f172a]">Cycle: Annual Audit</option>
                        </select>
                    </div>
                </header>

                {/* Tactical KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 font-sans uppercase">
                    {[
                        { label: "Institutional Load", value: stats.totalStudents, trend: "+45", icon: IconUsers, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Faculty Nodes", value: stats.totalTeachers, trend: "Sync", icon: IconTeacher, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { label: "Engagement Hub", value: stats.attendanceRate, trend: "+2.4%", icon: IconActivity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Efficiency Tier", value: stats.efficiency, trend: "Elite", icon: IconTrophy, color: "text-amber-400", bg: "bg-amber-500/10" },
                    ].map((kpi, idx) => (
                        <div key={idx} className="bg-[#0f172a] p-10 rounded-[4rem] border border-white/5 shadow-2xl space-y-6 hover:border-indigo-500/20 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`w-14 h-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-xl border border-white/5`}>
                                    <kpi.icon size={28} />
                                </div>
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-indigo-400 bg-white/5 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/5 leading-none">
                                    {kpi.trend}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 leading-none">{kpi.label}</p>
                                <p className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{loading ? "..." : kpi.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Primary Data Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 font-sans uppercase">
                    {/* Visual Analytics Hub */}
                    <div className="lg:col-span-8 bg-[#0f172a] border border-white/5 rounded-[4.5rem] p-14 shadow-3xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-14 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Attendance Vector mapping</h3>
                            </div>
                            <button className="p-4 bg-[#070b14] rounded-2xl border border-white/5 text-slate-700 hover:text-white transition-all shadow-xl">
                                <IconDotsVertical size={24} />
                            </button>
                        </div>

                        <div className="h-[450px] bg-[#070b14]/50 border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center space-y-8 group-hover:bg-[#070b14] transition-all duration-700 shadow-inner group-hover:border-indigo-500/20">
                            <div className="w-24 h-24 bg-[#0f172a] rounded-[2.5rem] flex items-center justify-center text-slate-900 group-hover:text-indigo-500 group-hover:shadow-[0_20px_60px_rgba(99,102,241,0.2)] transition-all duration-700 border border-white/5">
                                <IconChartBar size={56} stroke={1} />
                            </div>
                            <div className="text-center space-y-3">
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.5em] group-hover:text-slate-600 transition-colors">Initializing institutional data stream</p>
                                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Synchronizing spatial-temporal logs from all gates</p>
                            </div>
                        </div>
                    </div>

                    {/* Operational Intelligence */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-[#070b14] rounded-[4rem] p-12 text-white shadow-3xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-600/5 blur-[100px] rounded-bl-full pointer-events-none transition-all group-hover:bg-indigo-600/10"></div>
                            <div className="relative z-10 space-y-12">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-600/20 text-indigo-400">
                                        <IconTrendingUp size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase leading-tight font-sans tracking-tighter">Strategic Insights</h3>
                                </div>
                                <p className="text-sm text-slate-400 font-bold leading-relaxed lowercase first-letter:uppercase not-uppercase tracking-normal">
                                    Operational efficiency has peaked at <span className="text-indigo-400 font-black uppercase tabular-nums tracking-widest">99.2%</span> since the full deployment of advanced facial recognition protocols.
                                </p>
                                <button className="w-full py-6 bg-white text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95">
                                    Encrypt Report Pipeline
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] border border-white/5 rounded-[4rem] p-12 shadow-2xl space-y-10 group hover:border-indigo-500/10 transition-all font-sans">
                            <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] leading-none mb-4">Departmental Tier List</h3>
                            <div className="space-y-10 font-sans uppercase">
                                {[
                                    { name: "IT Branch", score: 98, color: "bg-indigo-600", icon: IconSchool },
                                    { name: "CS Branch", score: 94, color: "bg-indigo-500", icon: IconCpu },
                                    { name: "ENTC Branch", score: 89, color: "bg-blue-600", icon: IconTerminal2 },
                                    { name: "Automobile Br", score: 82, color: "bg-slate-600", icon: IconActivity },
                                ].map((dept, idx) => (
                                    <div key={idx} className="space-y-4 group/row">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest leading-none">
                                            <div className="flex items-center gap-3">
                                                <dept.icon size={16} className="text-slate-700 group-hover/row:text-indigo-400 transition-colors" />
                                                <span className="text-slate-400 group-hover/row:text-white transition-colors">{dept.name}</span>
                                            </div>
                                            <span className="text-indigo-400 tabular-nums">{dept.score}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-[#070b14] rounded-full overflow-hidden border border-white/5">
                                            <div className={`h-full ${dept.color} transition-all duration-[2000ms] shadow-[0_0_10px_rgba(99,102,241,0.5)]`} style={{ width: `${dept.score}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function IconTeacher({ size }: { size: number }) {
    return <IconUser size={size} />;
}
