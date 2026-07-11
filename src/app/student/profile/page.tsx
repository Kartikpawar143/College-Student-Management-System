"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
    IconUserCircle, IconMail, IconId, IconPhone, IconSchool, 
    IconCalendar, IconMapPin, IconEdit, IconCheck, IconLoader2,
    IconCamera, IconCertificate, IconShieldCheck, IconBooks
} from "@tabler/icons-react";

export default function StudentProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const stats = [
        { label: "Attendance", val: "84%", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "My CGPA", val: "8.92", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Credits", val: "124", color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Class Rank", val: "#04", color: "text-rose-600", bg: "bg-rose-50" },
    ];

    if (!user) return <div className="p-20 text-center font-bold text-slate-200 uppercase tracking-widest">Loading Your Profile...</div>;

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Profile Section */}
                <div className="relative h-[26rem] bg-[#0f172a] rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex items-end p-12 border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10"></div>
                     <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-end gap-12 relative z-10 w-full">
                        <div className="relative group">
                            <div className="w-48 h-48 rounded-[3.5rem] bg-[#070b14] p-2 border-4 border-[#0f172a] shadow-2xl overflow-hidden transition-all duration-700 group-hover:scale-105 group-hover:rotate-3">
                                 {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover rounded-[3rem]" />
                                 ) : (
                                    <div className="w-full h-full bg-[#0f172a] flex items-center justify-center text-slate-800 rounded-[3rem]">
                                        <IconUserCircle size={80} stroke={1} />
                                    </div>
                                 )}
                            </div>
                            <button className="absolute bottom-3 right-3 p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl hover:bg-indigo-500 transition-all border-4 border-[#0f172a] active:scale-90 group-hover:shadow-indigo-500/40 group-hover:rotate-12">
                                <IconCamera size={20} stroke={2.5} />
                            </button>
                        </div>

                        <div className="flex-1 pb-4 space-y-6 uppercase font-sans tracking-tight text-white">
                            <div className="flex items-center gap-6">
                                <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">{user.name}</h2>
                                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shadow-2xl transition-all duration-[3000ms] animate-pulse">
                                    <IconShieldCheck className="text-indigo-400" size={32} stroke={2} />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-slate-500 tracking-[0.3em] leading-none bg-[#070b14]/50 p-4 px-8 rounded-full border border-white/5 inline-flex">
                                <span className="flex items-center gap-3">
                                    <IconSchool size={18} stroke={2} className="text-indigo-400" /> {user.department || "BRANCH NOT ASSIGNED"}
                                </span>
                                <span className="flex items-center gap-3">
                                    <IconId size={18} stroke={2} className="text-rose-400" /> ROLL NO: {user.rollNo || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans tracking-tight">
                    {/* Left Card */}
                    <div className="lg:col-span-4 space-y-10 uppercase font-black tracking-widest text-[10px]">
                        <div className="bg-[#0f172a] rounded-[4rem] border border-white/5 p-12 shadow-2xl space-y-12 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-[5rem] translate-x-12 -translate-y-12"></div>
                             <h3 className="text-slate-700 font-sans font-black flex items-center gap-5 mb-12 tracking-[0.5em] leading-none">
                                <IconUserCircle size={22} className="text-indigo-500" /> PERSONAL DETAILS
                             </h3>
                             
                             <div className="space-y-6">
                                {[
                                    { icon: IconMail, label: "EMAIL ADDRESS", val: user.email, color: "text-indigo-400" },
                                    { icon: IconPhone, label: "MOBILE NUMBER", val: "+91 98XXX XXXXX", color: "text-emerald-400" },
                                    { icon: IconCalendar, label: "ADMISSION YEAR", val: "2021-22 SESSION", color: "text-rose-400" },
                                    { icon: IconMapPin, label: "CURRENT SEMESTER", val: `SEMESTER ${user.semester || 1}`, color: "text-amber-400" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-8 group hover:bg-[#070b14] transition-all duration-500 p-6 rounded-[2rem] border border-transparent hover:border-white/5 shadow-inner">
                                        <div className={`w-14 h-14 rounded-2xl bg-[#070b14] flex items-center justify-center ${item.color} group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-2xl`}>
                                            <item.icon size={28} stroke={1.5} />
                                        </div>
                                        <div className="flex-1 overflow-hidden space-y-1 text-left">
                                            <p className="text-slate-800 text-[9px] font-black tracking-[0.4em] transition-colors group-hover:text-indigo-500">{item.label}</p>
                                            <p className="text-slate-400 truncate uppercase font-sans tracking-widest text-[11px] group-hover:text-white transition-colors">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>

                             <button className="w-full py-7 bg-white/2 text-slate-700 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] border border-white/5 hover:bg-white/5 hover:text-white transition-all active:scale-95 shadow-2xl mt-8">
                                EDIT PROFILE
                             </button>
                        </div>

                        <div className="bg-[#0f172a] rounded-[4rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl"></div>
                             <h3 className="text-white text-[11px] mb-10 flex items-center gap-5 tracking-[0.5em] font-black uppercase leading-none font-sans">
                                <IconCertificate size={22} className="text-indigo-500" /> MY SKILLS
                             </h3>
                             <div className="flex flex-wrap gap-4">
                                 {["Python", "Fullstack", "UI/UX", "Data Science"].map((skill, i) => (
                                     <span key={i} className="px-6 py-3 bg-[#070b14] text-slate-700 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.3em] border border-white/5 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all cursor-pointer shadow-inner">{skill}</span>
                                 ))}
                             </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-8 space-y-12">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-[#0f172a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col items-center text-center group hover:bg-white/5 transition-all duration-700 relative overflow-hidden cursor-default">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-8 group-hover:-translate-y-8 transition-all duration-700"></div>
                                    <div className={`w-20 h-20 rounded-[2rem] bg-[#070b14] text-white flex items-center justify-center border border-white/5 shadow-inner mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)]`}>
                                         <p className="text-2xl font-black tracking-tighter uppercase">{stat.val}</p>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] transition-colors group-hover:text-indigo-400">{stat.label}</p>
                                </div>
                            ))}
                         </div>

                         <div className="bg-[#0f172a] rounded-[5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden relative">
                              <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 blur-[150px] rounded-full"></div>
                             <div className="p-12 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10 font-sans tracking-widest font-black uppercase">
                                 <h3 className="text-slate-700 uppercase tracking-[0.5em] text-[11px] leading-none flex items-center gap-5">
                                    <IconBooks size={22} className="text-indigo-500" /> EXAM RESULTS
                                </h3>
                                 <button className="text-[10px] font-black text-indigo-400 bg-[#070b14] border border-white/5 px-8 py-4 rounded-[1.5rem] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 uppercase tracking-[0.4em]">GET MARKSHEET</button>
                             </div>
                             <div className="p-32 flex flex-col items-center justify-center text-center space-y-10 relative z-10 group">
                                  <div className="w-28 h-28 bg-[#070b14] rounded-[3.5rem] flex items-center justify-center text-slate-900 shadow-inner group-hover:scale-110 transition-all duration-700 group-hover:rotate-12">
                                      <IconBooks size={64} stroke={0.5} />
                                  </div>
                                  <div className="space-y-4">
                                      <p className="text-2xl font-black text-slate-800 uppercase tracking-[0.6em]">Results Loading...</p>
                                      <p className="text-[10px] text-slate-900 font-black tracking-[0.2em] uppercase leading-relaxed max-w-sm">We are waiting for the college office to upload your final marksheet.</p>
                                  </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
