"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconCalendarWeek, IconClock, IconUser, IconMapPin,
    IconTableShortcut, IconLayoutDashboard, IconLoader2, IconBook, IconSparkles
} from "@tabler/icons-react";

export default function StudentTimetablePage() {
    const { user } = useAuth();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [fullSchedule, setFullSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchAllSchedules = async () => {
        setLoading(true);
        try {
            const allPromises = days.map(day => api.get(endpoints.timetable.getDay(day)));
            const results = await Promise.all(allPromises);
            
            // Flatten and filter by student's department if available
            const combined = results.flatMap((res, idx) => 
                res.data.map((item: any) => ({ ...item, day: days[idx] }))
            );

            // Precise filtering for branch and semester nodes
            const filtered = combined.filter((s: any) => {
                const studentDept = user?.department?.trim().toUpperCase() || "";
                const slotDept = s.branch?.trim().toUpperCase() || "";
                const studentSem = user?.semester?.toString() || "";
                const slotSem = s.semester?.toString() || "";
                
                const matchesBranch = !slotDept || slotDept === studentDept || slotDept.includes(studentDept);
                const matchesSem = !slotSem || slotSem === studentSem;
                
                return matchesBranch && matchesSem;
            });

            setFullSchedule(filtered);
        } catch (err) {
            console.error("Failed to fetch schedules", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllSchedules();
    }, [user]);

    // Extract unique time slots for vertical axis, sorted
    const timeSlots = Array.from(new Set(fullSchedule.map(s => s.time))).sort();

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                
                <div className="flex items-center gap-6 relative z-10 font-sans">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-100/10 bg-cyan-300/10 text-cyan-100">
                        <IconCalendarWeek size={22} />
                    </div>
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                             <IconSparkles size={13} /> Schedule
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Class schedule</h1>
                        <p className="mt-2 text-sm text-slate-400">Weekly classes for {user?.department || "your department"}, semester {user?.semester || 1}.</p>
                    </div>
                </div>
                
                <div className="relative z-10 flex w-fit rounded-xl border border-white/[0.08] bg-[#0c1a29] p-1">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <IconTableShortcut size={16} /> Table View
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <IconLayoutDashboard size={16} /> List View
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="py-48 text-center flex flex-col items-center gap-8">
                    <div className="p-4 bg-[#0c1a29] rounded-xl border border-white/[0.08]">
                        <IconLoader2 size={28} className="animate-spin text-cyan-100" stroke={1.5} />
                    </div>
                    <p className="text-sm text-slate-400 animate-pulse">Loading schedule...</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* GRID VIEW (TABLE FORMAT) */
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] relative group">
                    <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] p-4 sm:px-5">
                        <div><h2 className="text-sm font-semibold text-white">Weekly timetable</h2><p className="mt-1 text-xs text-slate-500">Your classes by day and time</p></div>
                        <span className="text-xs text-slate-400">{fullSchedule.length} classes</span>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#070b14]/30">
                                    <th className="p-5 border-r border-b border-white/[0.07] text-xs font-medium text-slate-400 w-36">Time</th>
                                    {days.map(day => (
                                        <th key={day} className="p-5 border-b border-white/[0.07] text-xs font-semibold text-slate-200 min-w-[180px]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {timeSlots.length > 0 ? (
                                    timeSlots.map(time => (
                                        <tr key={time} className="group/row hover:bg-white/[0.02] transition-all">
                                            <td className="p-5 border-r border-white/[0.07] text-center bg-white/[0.015]">
                                                <div className="flex flex-col items-center gap-3">
                                                    <IconClock size={16} className="text-slate-500" />
                                                    <span className="text-xs font-medium text-cyan-100">{time}</span>
                                                </div>
                                            </td>
                                            {days.map(day => {
                                                const slot = fullSchedule.find(s => s.day === day && s.time === time);
                                                return (
                                                    <td key={day} className="p-6 relative">
                                                        {slot ? (
                                                            <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.04]">
                                                                <h4 className="mb-3 text-sm font-semibold text-white leading-tight transition-colors group-hover:text-cyan-100">{slot.subject}</h4>
                                                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                                    <span className={`rounded-md border border-white/[0.07] px-2 py-1 text-[10px] font-medium ${slot.type === 'Practical' ? 'bg-violet-300/10 text-violet-200' : 'bg-cyan-300/10 text-cyan-100'}`}>
                                                                        {slot.type}
                                                                    </span>
                                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                                        <IconMapPin size={12} stroke={2} /> {slot.room}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100 border border-cyan-200/10">
                                                                        <IconUser size={12} stroke={2} />
                                                                    </div>
                                                                    <span className="truncate text-xs text-slate-400">{slot.teacher}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                    <div className="h-20 flex items-center justify-center opacity-40 transition-all border border-dashed border-white/[0.06] rounded-xl">
                                                        <IconBook size={18} className="text-slate-500" />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400">
                                                    <IconBook size={21} />
                                                </div>
                                                <p className="text-sm font-medium text-slate-300">No classes found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* LIST VIEW (STACK FORMAT) */
                <div className="grid grid-cols-1 gap-5 font-sans md:grid-cols-2 xl:grid-cols-3">
                    {days.map(day => {
                        const daySchedule = fullSchedule.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time));
                        return (
                            <div key={day} className="flex min-h-72 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] transition hover:border-cyan-100/20 relative group">
                                <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-cyan-300/[0.04] blur-3xl"></div>
                                <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-5 py-4 relative z-10">
                                    <h3 className="text-sm font-semibold text-white">{day}</h3>
                                    <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-xs text-slate-400">{daySchedule.length} classes</span>
                                </div>
                                <div className="p-4 space-y-3 flex-1 relative z-10">
                                    {daySchedule.length > 0 ? daySchedule.map(slot => (
                                        <div key={slot._id} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-cyan-100/20 group/item">
                                            <div className="mb-3 flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100 border border-white/[0.06]">
                                                    <IconClock size={17} />
                                                </div>
                                                <span className="text-xs font-medium text-cyan-100">{slot.time}</span>
                                            </div>
                                            <h4 className="mb-3 text-sm font-semibold text-white leading-tight group-hover/item:text-cyan-100 transition-colors">{slot.subject}</h4>
                                            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-3">
                                                <span className={`rounded-md border px-2 py-1 text-[10px] font-medium ${slot.type === 'Practical' ? 'bg-violet-300/10 text-violet-200 border-violet-200/10' : 'bg-cyan-300/10 text-cyan-100 border-cyan-200/10'}`}>{slot.type}</span>
                                                <span className="flex items-center gap-2 text-xs text-slate-400">
                                                    <IconUser size={14} /> {slot.teacher}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex h-full flex-col items-center justify-center py-10">
                                            <IconBook size={24} className="mb-2 text-slate-500" />
                                            <p className="text-xs text-slate-400">No classes</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
          </div>
        </main>
    );
}
