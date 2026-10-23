"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { 
    IconCalendarWeek, IconClock, IconUser, IconMapPin,
    IconDownload, IconBook, IconLoader2, IconSearch, IconFilter, IconTableShortcut, IconLayoutDashboard, IconSparkles
} from "@tabler/icons-react";

export default function AdminTimetablePage() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [fullSchedule, setFullSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Filters
    const [selectedBranch, setSelectedBranch] = useState<string>("all");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAllSchedules = async () => {
        setLoading(true);
        try {
            const allPromises = days.map(day => api.get(endpoints.timetable.getDay(day)));
            const results = await Promise.all(allPromises);
            const combined = results.flatMap((res, idx) => 
                res.data.map((item: any) => ({ ...item, day: days[idx] }))
            );
            setFullSchedule(combined);
        } catch (err) {
            console.error("Failed to fetch schedules", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllSchedules();
    }, []);

    const filteredSchedule = fullSchedule.filter(slot => {
        const matchesBranch = selectedBranch === "all" || (slot.branch?.toUpperCase() === selectedBranch.toUpperCase());
        const matchesSem = selectedSemester === "all" || slot.semester?.toString() === selectedSemester;
        const matchesSearch = slot.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            slot.teacher.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBranch && matchesSem && matchesSearch;
    });

    const timeSlots = Array.from(new Set(filteredSchedule.map(s => s.time))).sort();

    return (
        <main className="admin-feature-page min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans text-slate-200">
            <div className="max-w-[1600px] mx-auto space-y-12 relative">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none"></div>
                
                <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 pb-12 border-b border-white/5 relative z-10">
                    <div className="text-left space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Admin Control</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Full College Timetable</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">View and manage schedules across all branches and semesters</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-xl">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                            >
                                <IconTableShortcut size={16} /> Table View
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                            >
                                <IconLayoutDashboard size={16} /> List View
                            </button>
                        </div>

                        <div className="flex items-center gap-4 bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-xl">
                            <select 
                                className="bg-transparent text-[10px] font-black text-white px-6 py-3 outline-none uppercase tracking-widest cursor-pointer border-r border-white/5"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="all" className="bg-[#0f172a]">ALL BRANCHES</option>
                                {["IT", "CS", "ENTC", "Automobile"].map(b => (
                                    <option key={b} value={b} className="bg-[#0f172a]">{b} BRANCH</option>
                                ))}
                            </select>
                            <select 
                                className="bg-transparent text-[10px] font-black text-white px-6 py-3 outline-none uppercase tracking-widest cursor-pointer"
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                            >
                                <option value="all" className="bg-[#0f172a]">ALL SEMESTERS</option>
                                {["1", "2", "3", "4", "5", "6", "7", "8"].map(s => (
                                    <option key={s} value={s} className="bg-[#0f172a]">SEM {s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </header>

                <div className="bg-[#0f172a] rounded-[4rem] border border-white/5 shadow-3xl overflow-hidden relative group">
                    <div className="p-10 border-b border-white/5 bg-[#070b14]/50 flex items-center justify-between relative z-20">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-[#070b14] rounded-2xl flex items-center justify-center text-indigo-500 border border-white/5">
                                <IconFilter size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Filters</h3>
                                <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-2 leading-none">Find specific classes instantly</p>
                            </div>
                        </div>
                        <div className="relative group/search w-72">
                            <IconSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-indigo-400" size={16} />
                            <input 
                                type="text"
                                placeholder="SEARCH CLASS..."
                                className="w-full bg-[#070b14] border border-white/5 rounded-2xl pl-14 pr-6 py-3.5 text-[10px] font-black text-white outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-900 uppercase tracking-widest"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar relative z-10 font-sans">
                        {loading ? (
                            <div className="py-48 text-center flex flex-col items-center gap-10">
                                <div className="p-12 bg-[#070b14] rounded-[3rem] border border-white/5 shadow-2x">
                                    <IconLoader2 size={64} className="animate-spin text-indigo-500" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-800 animate-pulse">Loading global timetable...</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#070b14]/30">
                                        <th className="p-10 border-r border-b border-white/5 text-[10px] font-black text-slate-800 uppercase tracking-widest w-44">Time</th>
                                        {days.map(day => (
                                            <th key={day} className="p-10 border-b border-white/10 text-[11px] font-black text-white uppercase tracking-widest min-w-[240px]">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {timeSlots.length > 0 ? (
                                        timeSlots.map(time => (
                                            <tr key={time} className="group/row hover:bg-white/[0.02] transition-all">
                                                <td className="p-10 border-r border-white/5 text-center bg-[#070b14]/10">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <IconClock size={16} className="text-slate-800" />
                                                        <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em]">{time}</span>
                                                    </div>
                                                </td>
                                                {days.map(day => {
                                                    const slots = filteredSchedule.filter(s => s.day === day && s.time === time);
                                                    return (
                                                        <td key={day} className="p-4 relative min-h-[140px]">
                                                            <div className="space-y-4">
                                                                {slots.length > 0 ? slots.map((slot, idx) => (
                                                                    <div key={idx} className="p-6 rounded-[2rem] bg-[#070b14] border border-white/5 hover:border-indigo-500/20 transition-all group/item shadow-2xl relative overflow-hidden text-left">
                                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 blur-xl group-hover/item:bg-indigo-600/10"></div>
                                                                        <h4 className="text-[11px] font-black text-white uppercase tracking-tight mb-2 leading-none">{slot.subject}</h4>
                                                                        <div className="flex items-center gap-2 mb-3">
                                                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${slot.type === 'Practical' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                                                                                {slot.type}
                                                                            </span>
                                                                            <span className="text-[8px] font-black text-slate-700 bg-white/5 px-2 py-0.5 rounded border border-white/5 tracking-widest uppercase">
                                                                                {slot.branch} SEM {slot.semester}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex flex-col gap-1.5 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                                                            <p className="text-[8px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                                                                <IconUser size={10} /> {slot.teacher}
                                                                            </p>
                                                                            <p className="text-[8px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
                                                                                <IconMapPin size={10} /> Room {slot.room}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )) : (
                                                                    <div className="h-12 border border-dashed border-white/5 rounded-2xl opacity-5"></div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="p-48 text-center">
                                                <div className="flex flex-col items-center gap-8">
                                                    <div className="w-20 h-20 bg-[#070b14] rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2x text-slate-900">
                                                        <IconBook size={40} />
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.6em]">No classes found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                                {days.map(day => {
                                    const daySchedule = filteredSchedule.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time));
                                    return (
                                        <div key={day} className="bg-[#070b14]/50 rounded-[3rem] border border-white/5 p-8 space-y-6">
                                            <h4 className="text-[12px] font-black text-white uppercase tracking-[0.3em] pb-4 border-b border-white/5 text-left">{day}</h4>
                                            {daySchedule.length > 0 ? daySchedule.map((slot, idx) => (
                                                <div key={idx} className="p-6 bg-[#070b14] rounded-3xl border border-white/5 border-l-4 border-l-indigo-600 shadow-xl text-left">
                                                    <div className="flex justify-between items-start mb-3">
                                                       <span className="text-[10px] font-black text-indigo-400 tracking-widest">{slot.time}</span>
                                                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{slot.branch} SEM {slot.semester}</span>
                                                    </div>
                                                    <h5 className="font-black text-white uppercase text-base tracking-tight mb-3 leading-none">{slot.subject}</h5>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><IconUser size={12} /> {slot.teacher}</span>
                                                        <span className="text-[9px] font-bold text-slate-600 uppercase flex items-center gap-1.5"><IconMapPin size={12} /> Room {slot.room}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest text-center py-10 opacity-20">No classes</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
