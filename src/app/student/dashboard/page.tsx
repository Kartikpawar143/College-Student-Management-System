"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
    IconCalendarEvent, IconUsers, IconBriefcase, IconFileText, 
    IconCheck, IconUserCircle, IconArrowRight, IconBell,
    IconClock, IconBooks, IconSmartHome, IconUserCheck,
    IconSparkles, IconTarget, IconStar, IconChevronRight, IconSchool, IconPaperclip
} from "@tabler/icons-react";
import Link from "next/link";

export default function StudentDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [timetable, setTimetable] = useState<any[]>([]);
    const [notices, setNotices] = useState<any[]>([]);
    const [recentLeave, setRecentLeave] = useState<any>(null);
    const [placements, setPlacements] = useState<any[]>([]);

    const fetchStudentData = async () => {
        if (!user) return;
        try {
            const [profileRes, timetableRes, noticesRes, placementsRes, leaveRes] = await Promise.all([
                fetch(`http://localhost:8001/students/${user.id}/profile`),
                fetch(`http://localhost:8001/timetable/${encodeURIComponent(user.department || "CS")}/${user.semester || 1}`),
                fetch(`http://localhost:8001/notices/`),
                fetch(`http://localhost:8001/placements/`),
                fetch(`http://localhost:8001/gatepass/student/${user.id}`)
            ]);

            const profileData = await profileRes.json();
            setStats(profileData.stats);

            const timetableData = await timetableRes.json();
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            setTimetable(timetableData.filter((t: any) => t.day === today));

            const noticesData = await noticesRes.json();
            const filteredNotices = noticesData.filter((n: any) => 
                n.audience === "All Students" || n.audience === "Final Year" || n.audience === "Departments"
            );
            setNotices(filteredNotices.slice(0, 3));

            const placementsData = await placementsRes.json();
            setPlacements(placementsData.slice(0, 2));

            const leaveData = await leaveRes.json();
            if (leaveData.length > 0) {
                setRecentLeave(leaveData[leaveData.length - 1]);
            }

        } catch (err) {
            console.error("Error fetching dashboard data", err);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [user]);

    return (
        <div className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-10">
                
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5 relative text-left">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconSparkles size={10} className="text-indigo-400" />
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Student Portal</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none">My Dashboard</h1>
                        <p className="text-xs font-bold text-slate-500 leading-none">
                            Welcome, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span> 👋 • Here's your study update.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-[#0f172a] p-3 px-6 rounded-[2rem] shadow-2xl border border-white/5 relative z-10 font-sans">
                        <div className="w-12 h-12 rounded-2xl bg-[#070b14] text-indigo-400 flex items-center justify-center border border-white/5">
                            <IconUserCircle size={28} stroke={1.5} />
                        </div>
                        <div className="text-left">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{user?.department || "BRANCH NOT ASSIGNED"}</p>
                            <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.4em]">ROLL NO: {user?.rollNo || "N/A"}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
                    {[
                        { label: "ATTENDANCE", val: stats?.attendance || "0%", icon: IconUserCheck, color: "text-indigo-400", bg: "bg-indigo-500/10", desc: "PRESENCE RATE" },
                        { label: "EXAM FORM", val: stats?.exams || "DONE", icon: IconFileText, color: "text-purple-400", bg: "bg-purple-500/10", desc: "CURRENT STATUS" },
                        { label: "NEW JOBS", val: placements.length, icon: IconBriefcase, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "OPEN JOBS" },
                        { label: "SEMESTER", val: user?.semester || 1, icon: IconSchool, color: "text-amber-400", bg: "bg-amber-500/10", desc: "CURRENT SECTIONS" },
                    ].map((stat, i) => (
                        <div key={i} className="group p-10 rounded-[3.5rem] bg-[#0f172a] border border-white/5 shadow-2xl hover:border-indigo-500/20 transition-all duration-700 cursor-default overflow-hidden relative">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-700 border border-white/5 shadow-2xl group-hover:bg-indigo-600 group-hover:text-white`}>
                                <stat.icon size={28} stroke={1.5} />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em] mb-4 transition-colors group-hover:text-indigo-500 leading-none">{stat.label}</h4>
                            <p className="text-4xl font-black text-white tracking-tighter mb-4 uppercase leading-none">{stat.val}</p>
                            <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 bg-[#0f172a] p-12 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[150px] rounded-full"></div>
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div className="text-left space-y-4">
                                <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Today's schedule</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800 leading-none">Your classes for today</p>
                            </div>
                            <Link href="/student/timetable" className="flex items-center gap-4 px-8 py-4 bg-[#070b14] text-indigo-400 border border-white/5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 group/btn">
                                VIEW ALL <IconChevronRight size={16} stroke={3} className="transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>

                        {timetable.length > 0 ? (
                            <div className="space-y-6 relative z-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                {timetable.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-8 bg-[#070b14]/50 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/20 hover:bg-[#070b14] transition-all duration-500 group/item cursor-pointer text-left">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-[2rem] bg-[#0f172a] border border-white/5 flex items-center justify-center text-slate-900 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-700 shadow-2xl">
                                                <IconClock size={32} stroke={1.5} />
                                            </div>
                                            <div className="text-left space-y-3">
                                                <h4 className="text-white font-black uppercase text-xl tracking-tight leading-none">{item.subject}</h4>
                                                <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.4em] leading-none">{item.teacher} • Room {item.room}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-indigo-400 text-[12px] uppercase tracking-widest">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-32 bg-[#070b14]/40 rounded-[3rem] border-2 border-dashed border-white/5">
                                <IconCalendarEvent size={72} stroke={0.5} className="text-slate-900 mb-8" />
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.5em]">NO CLASSES SCHEDULED TODAY</p>
                             </div>
                        )}
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-[#0f172a] p-12 rounded-[4rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10 space-y-12">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Latest News</h3>
                                    <IconBell size={24} className="text-amber-500" />
                                </div>
                                
                                {recentLeave && (
                                    <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[3rem] relative overflow-hidden group/leave">
                                         <div className="flex items-center justify-between mb-4">
                                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active Verification Node</span>
                                              <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                                  recentLeave.status === 'Approved' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-400' :
                                                  recentLeave.status === 'Rejected' ? 'bg-rose-500/20 border-rose-400/30 text-rose-400' :
                                                  'bg-amber-500/20 border-amber-400/30 text-amber-500'
                                              }`}>
                                                  {recentLeave.status}
                                              </span>
                                         </div>
                                         <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 leading-none">{recentLeave.type}</h4>
                                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none truncate pr-4">{recentLeave.reason}</p>
                                         <Link href="/student/gatepass" className="absolute top-0 right-0 p-4 opacity-0 group-hover/leave:opacity-100 transition-opacity">
                                              <IconChevronRight size={16} />
                                         </Link>
                                    </div>
                                )}
                                
                                <div className="space-y-6">
                                    {notices.length > 0 ? notices.map((notice, i) => (
                                        <div key={i} className="p-8 bg-[#070b14]/60 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/20 transition-all duration-500 cursor-default text-left relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-4">
                                                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em]">{notice.type}</p>
                                                {notice.pdfUrl && <IconPaperclip size={14} className="text-slate-600" />}
                                            </div>
                                            <h4 className="font-black text-white text-[13px] leading-tight mb-4 tracking-tight uppercase">{notice.title}</h4>
                                            <p className="text-[11px] text-slate-800 font-bold leading-relaxed line-clamp-2 uppercase">{notice.content}</p>
                                        </div>
                                    )) : (
                                        <p className="text-[10px] font-black text-slate-800 text-center uppercase py-8">No notices today</p>
                                    )}
                                </div>

                                <Link href="/student/notices" className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4">
                                     READ ALL <IconChevronRight size={18} stroke={4} />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] p-12 rounded-[4rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                             <div className="grid grid-cols-2 gap-6 relative z-10">
                                 {[
                                     { label: "EXAM FORM", href: "/student/exam_form", icon: IconFileText, color: "text-blue-400" },
                                     { label: "OLD PAPERS", href: "/student/pyqs", icon: IconBooks, color: "text-amber-400" },
                                     { label: "STUDY NOTES", href: "/student/notes", icon: IconFileText, color: "text-indigo-400" },
                                     { label: "LEAVE", href: "/student/gatepass", icon: IconTarget, color: "text-rose-400" },
                                 ].map((btn, i) => (
                                     <Link key={i} href={btn.href} className="flex flex-col items-center gap-6 p-8 bg-[#070b14]/80 rounded-[3rem] hover:bg-indigo-600 transition-all duration-700 border border-white/5 shadow-2xl group/link">
                                         <btn.icon size={28} className={`${btn.color} group-hover/link:text-white transition-all`} stroke={1.5} />
                                         <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] group-hover/link:text-white text-center leading-none transition-colors">{btn.label}</span>
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
