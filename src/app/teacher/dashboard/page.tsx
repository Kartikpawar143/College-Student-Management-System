"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
    IconCalendarEvent, IconFileUpload, IconChecklist, 
    IconAlertCircle, IconSchool, IconExternalLink, 
    IconArrowRight, IconPresentation, IconChartBar, IconDownload,
    IconUsers, IconMessageCircle, IconClock, IconSparkles, IconSettings,
    IconChevronRight, IconPlus, IconUserCheck, IconFileSettings
} from "@tabler/icons-react";
import Link from "next/link";

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState<any[]>([]);
    const [teacherStats, setTeacherStats] = useState({
        totalStudents: 0,
        pendingLeaves: 0,
        totalFiles: 0,
        activeClasses: 0
    });

    useEffect(() => {
        if (user) {
            fetchTeacherData();
        }
    }, [user]);

    const fetchTeacherData = async () => {
        try {
            const res1 = await fetch(`http://localhost:8001/timetable/teacher/${encodeURIComponent(user?.name || "")}`);
            const data1 = await res1.json();
            setTimetable(Array.isArray(data1) ? data1 : []);

            const res2 = await fetch(`http://localhost:8001/stats/teacher/${encodeURIComponent(user?.name || "")}`);
            const data2 = await res2.json();
            setTeacherStats(data2);
        } catch (error) {
            console.error("Failed to fetch teacher data", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconSparkles size={10} className="text-indigo-400" />
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Teacher Dashboard</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Welcome Back</h2>
                        <p className="text-xs font-bold text-slate-500 leading-none">
                            Hello, <span className="text-indigo-400">Prof. {user?.name || "Member"}</span> 👋 • Have a great day at college!
                        </p>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto relative z-10">
                        <Link href="/teacher/attendance" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/10 active:scale-95">
                            <IconPresentation size={18} /> Mark Attendance
                        </Link>
                    </div>
                </header>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Today's Classes", val: timetable.length, icon: IconCalendarEvent, color: "text-indigo-400", bg: "bg-indigo-500/10", desc: "My Daily Schedule" },
                        { title: "Student Requests", val: teacherStats.pendingLeaves, icon: IconAlertCircle, color: "text-rose-400", bg: "bg-rose-500/10", desc: "Wait for My Approval" },
                        { title: "My Files", val: teacherStats.totalFiles, icon: IconFileUpload, color: "text-purple-400", bg: "bg-purple-500/10", desc: "Notes & Material" },
                        { title: "Total Students", val: teacherStats.totalStudents, icon: IconUsers, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "Enrolled in Classes" }
                    ].map((stat, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] bg-[#0f172a] border border-white/5 shadow-xl hover:border-indigo-500/20 transition-all duration-300 cursor-pointer overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-16 h-16 ${stat.color.replace('text', 'bg')} opacity-5 blur-2xl -translate-y-8 translate-x-8 rounded-full`}></div>
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-8 border border-white/5 shadow-sm`}>
                                <stat.icon size={22} />
                            </div>
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.title}</h4>
                            <p className="text-3xl font-black text-white tracking-tight mb-3">{stat.val}</p>
                            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Timetable List */}
                    <div className="lg:col-span-8 bg-[#0f172a] p-10 rounded-[3rem] shadow-xl border border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Class Schedule</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Checking your lectures today</p>
                            </div>
                            <Link href="/teacher/timetable" className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                                Full List <IconChevronRight size={12} />
                            </Link>
                        </div>

                        {timetable.length > 0 ? (
                            <div className="space-y-4 relative z-10">
                                {timetable.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-[#070b14]/40 rounded-[2rem] border border-white/5 hover:border-indigo-500/20 hover:bg-[#070b14]/70 transition-all group/item cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-[1.2rem] bg-[#0f172a] border border-white/5 flex items-center justify-center text-slate-500 group-hover/item:text-indigo-400 transition-all">
                                                <IconClock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-black uppercase text-base tracking-tight group-hover/item:text-indigo-400 transition-colors leading-none">{item.subject}</p>
                                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1.5 leading-none">Branch: {item.branch} • Sem {item.semester} • Rm: {item.room}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-indigo-400 text-xs mb-1 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/10 leading-none">
                                                {item.start_time} - {item.end_time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-[#070b14]/20 rounded-[2.5rem] border-2 border-dashed border-white/5">
                                <IconCalendarEvent size={48} className="text-white/5 mb-4" />
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">No classes today.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Tools Panel */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Student Updates */}
                        <div className="bg-[#0f172a] p-10 rounded-[3rem] shadow-xl border border-white/5 relative overflow-hidden group font-sans">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full group-hover:bg-indigo-600/20 transition-all"></div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none">Recent News</h3>
                                    <IconMessageCircle size={20} className="text-indigo-400" />
                                </div>
                                
                                <div className="space-y-4">
                                    {[
                                        { title: "Attendance Marked", desc: "Batch 2021 attendance is now saved." },
                                        { title: "New Leave Form", desc: "Rahul from CS Sem 4 applied for leave." }
                                    ].map((news, i) => (
                                        <div key={i} className="p-5 bg-[#070b14]/50 border border-white/5 rounded-[1.8rem] hover:bg-[#070b14]/80 transition-all cursor-pointer group/news">
                                            <h4 className="font-black text-white text-[11px] group-hover:text-indigo-400 transition-colors leading-tight mb-2 uppercase tracking-tight">{news.title}</h4>
                                            <p className="text-slate-500 text-[10px] font-medium leading-relaxed tracking-normal not-uppercase lowercase first-letter:uppercase">{news.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/10 active:scale-95">
                                    View All
                                </button>
                            </div>
                        </div>

                        {/* Teacher Fast Tools */}
                        <div className="bg-[#0f172a] p-10 rounded-[3rem] shadow-xl border border-white/5 relative overflow-hidden">
                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Fast Tools</h4>
                             <div className="grid grid-cols-2 gap-4 relative z-10">
                                 {[
                                     { name: "My Students", href: "/teacher/students", icon: IconUsers, color: "text-blue-400" },
                                     { name: "Add Files", href: "/teacher/notes", icon: IconFileUpload, color: "text-emerald-400" },
                                     { name: "Approvals", href: "/teacher/approvals", icon: IconChecklist, color: "text-indigo-400" },
                                     { name: "Full Reports", href: "/teacher/attendance", icon: IconChartBar, color: "text-rose-400" },
                                 ].map((tool, idx) => (
                                     <Link key={idx} href={tool.href} className="flex flex-col items-center gap-3 p-4 bg-[#070b14]/40 rounded-[2.2rem] hover:bg-[#070b14]/60 hover:shadow-xl transition-all border border-transparent hover:border-white/5 group active:scale-95 text-center">
                                         <tool.icon size={20} className={`${tool.color} group-hover:scale-110 transition-transform`} />
                                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400">{tool.name}</span>
                                     </Link>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
