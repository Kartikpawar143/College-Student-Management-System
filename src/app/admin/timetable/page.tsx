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
        <main className="admin-feature-page min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6 relative">
                <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-cyan-400/[0.06] blur-3xl pointer-events-none"></div>
                
                <header className="relative z-10 flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
                    <div className="text-left">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100">
                            <IconSparkles size={13} /> Admin schedule
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Full college timetable</h1>
                        <p className="mt-1.5 text-sm text-slate-400">Schedules across all branches and semesters</p>
                    </div>
                    
                    <div className="relative z-10 flex flex-wrap items-center gap-3">
                        <div className="flex bg-[#0c1a29] p-1 rounded-xl border border-white/[0.08]">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}
                            >
                                <IconTableShortcut size={16} /> Table View
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}
                            >
                                <IconLayoutDashboard size={16} /> List View
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0c1a29] p-1">
                            <select 
                                className="max-w-full bg-transparent px-3 py-2 text-xs font-medium text-white outline-none cursor-pointer border-r border-white/10"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="all" className="bg-[#0f172a]">ALL BRANCHES</option>
                                {["IT", "CS", "ENTC", "Automobile"].map(b => (
                                    <option key={b} value={b} className="bg-[#0f172a]">{b} BRANCH</option>
                                ))}
                            </select>
                            <select 
                                className="max-w-full bg-transparent px-3 py-2 text-xs font-medium text-white outline-none cursor-pointer"
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

                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] relative">
                    <div className="flex flex-col gap-3 border-b border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                                <IconFilter size={18} />
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-semibold text-white">Filters</h3>
                                <p className="mt-1 text-xs text-slate-500">Find specific classes</p>
                            </div>
                        </div>
                        <div className="relative w-full sm:max-w-sm">
                            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text"
                                placeholder="Search classes"
                                className="w-full rounded-xl border border-white/10 bg-[#081522] py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar relative z-10 font-sans">
                        {loading ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                                <IconLoader2 size={25} className="animate-spin text-cyan-100" />
                                <p className="text-sm text-slate-400">Loading timetable...</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#070b14]/30">
                                        <th className="p-4 border-r border-b border-white/5 text-xs font-semibold text-slate-400 text-left w-40">Time</th>
                                        {days.map(day => (
                                            <th key={day} className="p-4 border-b border-white/10 text-xs font-semibold text-white text-left min-w-[200px]">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {timeSlots.length > 0 ? (
                                        timeSlots.map(time => (
                                            <tr key={time} className="group/row hover:bg-white/[0.02] transition-all">
                                                <td className="p-3 border-r border-white/5 bg-[#070b14]/10">
                                                    <div className="flex items-center gap-2 text-xs font-medium tabular-nums text-cyan-100">
                                                        <IconClock size={14} className="text-slate-500" />
                                                        <span>{time}</span>
                                                    </div>
                                                </td>
                                                {days.map(day => {
                                                    const slots = filteredSchedule.filter(s => s.day === day && s.time === time);
                                                    return (
                                                        <td key={day} className="p-2 relative min-h-[100px]">
                                                            <div className="space-y-2">
                                                                {slots.length > 0 ? slots.map((slot, idx) => (
                                                                    <div key={idx} className="p-3 rounded-xl bg-[#081522] border border-white/[0.07] hover:border-cyan-100/20 transition-all group/item relative overflow-hidden text-left">
                                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-300/5 blur-xl group-hover/item:bg-cyan-300/10"></div>
                                                                        <h4 className="text-[11px] font-black text-white uppercase tracking-tight mb-2 leading-none">{slot.subject}</h4>
                                                                        <div className="flex items-center gap-2 mb-3">
                                                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${slot.type === 'Practical' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-cyan-100/[0.06] text-cyan-100 border-cyan-100/10'}`}>
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
                                            <td colSpan={7} className="px-5 py-14 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <IconBook size={25} className="text-slate-500" />
                                                    <p className="text-sm text-slate-400">No classes found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {days.map(day => {
                                    const daySchedule = filteredSchedule.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time));
                                    return (
                                        <div key={day} className="bg-[#081522] rounded-2xl border border-white/[0.07] p-4 space-y-3">
                                            <h4 className="text-sm font-semibold text-white pb-3 border-b border-white/5 text-left">{day}</h4>
                                            {daySchedule.length > 0 ? daySchedule.map((slot, idx) => (
                                                <div key={idx} className="p-4 bg-[#0c1a29] rounded-xl border border-white/[0.07] border-l-2 border-l-cyan-200 text-left">
                                                    <div className="flex justify-between items-start mb-3">
                                                       <span className="text-xs font-medium text-cyan-100 tracking-wide">{slot.time}</span>
                                                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{slot.branch} SEM {slot.semester}</span>
                                                    </div>
                                                    <h5 className="font-black text-white uppercase text-base tracking-tight mb-3 leading-none">{slot.subject}</h5>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><IconUser size={12} /> {slot.teacher}</span>
                                                        <span className="text-[9px] font-bold text-slate-600 uppercase flex items-center gap-1.5"><IconMapPin size={12} /> Room {slot.room}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-slate-500 text-center py-6">No classes</p>
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
