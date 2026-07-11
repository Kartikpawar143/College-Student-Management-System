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
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 space-y-12 font-sans text-slate-200">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full"></div>
                
                <div className="flex items-center gap-6 relative z-10 font-sans">
                    <div className="w-16 h-16 bg-[#0f172a] border border-white/5 rounded-[2.2rem] flex items-center justify-center text-indigo-400 shadow-2xl">
                        <IconCalendarWeek size={32} stroke={1.5} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-2">
                             <IconSparkles size={10} className="text-indigo-400" />
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Schedule Hub</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Class Schedule</h2>
                        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-2 leading-none">
                            Check your weekly <span className="text-indigo-400">classes and subjects</span> here.
                        </p>
                    </div>
                </div>
                
                <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-xl relative z-10">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        <IconTableShortcut size={16} /> Table View
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        <IconLayoutDashboard size={16} /> List View
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="py-48 text-center flex flex-col items-center gap-8">
                    <div className="p-8 bg-[#0f172a] rounded-full border border-white/5 shadow-2xl">
                        <IconLoader2 size={44} className="animate-spin text-indigo-500" stroke={1.5} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800 animate-pulse">Loading Schedule...</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* GRID VIEW (TABLE FORMAT) */
                <div className="bg-[#0f172a] rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="p-10 border-b border-white/5 bg-[#070b14]/50 flex items-center gap-4">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">Your Weekly Timetable</h3>
                    </div>
                    
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#070b14]/30">
                                    <th className="p-10 border-r border-b border-white/5 text-[10px] font-black text-slate-700 uppercase tracking-widest w-44">Time</th>
                                    {days.map(day => (
                                        <th key={day} className="p-10 border-b border-white/10 text-[11px] font-black text-white uppercase tracking-widest min-w-[220px]">
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
                                                    <IconClock size={18} className="text-slate-800" />
                                                    <span className="text-[11px] font-black text-indigo-400 tracking-[0.2em]">{time}</span>
                                                </div>
                                            </td>
                                            {days.map(day => {
                                                const slot = fullSchedule.find(s => s.day === day && s.time === time);
                                                return (
                                                    <td key={day} className="p-6 relative">
                                                        {slot ? (
                                                            <div className="p-8 rounded-[2.5rem] bg-[#070b14] border border-white/5 group-hover/row:border-indigo-500/20 transition-all hover:bg-indigo-600/10 group relative overflow-hidden shadow-2xl">
                                                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-600/5 blur-2xl rounded-full transition-all group-hover:bg-indigo-600/10"></div>
                                                                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3 leading-tight transition-colors group-hover:text-indigo-300">{slot.subject}</h4>
                                                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-white/5 ${slot.type === 'Practical' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                                        {slot.type}
                                                                    </span>
                                                                    <span className="text-[9px] font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-widest">
                                                                        <IconMapPin size={12} stroke={2} /> {slot.room}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                                                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                                        <IconUser size={12} stroke={2} />
                                                                    </div>
                                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{slot.teacher}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-24 flex items-center justify-center opacity-10 grayscale group-hover/row:opacity-100 group-hover/row:grayscale-0 transition-all border border-dashed border-white/5 rounded-[2.5rem]">
                                                                <IconBook size={24} className="text-slate-800" />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-40 text-center">
                                            <div className="flex flex-col items-center gap-8">
                                                <div className="w-24 h-24 bg-[#070b14] rounded-[3rem] flex items-center justify-center border border-white/5 shadow-2xl text-slate-900">
                                                    <IconBook size={48} />
                                                </div>
                                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.6em]">No Classes Found</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 font-sans">
                    {days.map(day => {
                        const daySchedule = fullSchedule.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time));
                        return (
                            <div key={day} className="bg-[#0f172a] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden group hover:border-indigo-500/20 transition-all flex flex-col min-h-[450px] relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[80px] rounded-bl-full group-hover:bg-indigo-600/10 transition-all"></div>
                                <div className="p-10 border-b border-white/5 bg-[#070b14]/50 flex items-center justify-between relative z-10">
                                    <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">{day}</h3>
                                    <span className="text-[10px] font-black text-slate-500 bg-[#070b14] px-5 py-2 rounded-2xl border border-white/5 shadow-xl uppercase tracking-widest">{daySchedule.length} Classes</span>
                                </div>
                                <div className="p-10 space-y-6 flex-1 relative z-10">
                                    {daySchedule.length > 0 ? daySchedule.map(slot => (
                                        <div key={slot._id} className="p-8 bg-[#070b14] rounded-[2.5rem] border border-white/5 hover:border-indigo-500/20 transition-all group/item shadow-2xl">
                                            <div className="flex items-center gap-5 mb-5">
                                                <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 shadow-xl group-hover/item:scale-110 transition-all">
                                                    <IconClock size={20} />
                                                </div>
                                                <span className="text-sm font-black text-white tracking-[0.2em]">{slot.time}</span>
                                            </div>
                                            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4 leading-none group-hover/item:text-indigo-400 transition-colors">{slot.subject}</h4>
                                            <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-white/5">
                                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border tracking-widest uppercase ${slot.type === 'Practical' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>{slot.type}</span>
                                                <span className="text-[9px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest">
                                                    <IconUser size={14} className="text-slate-700" /> {slot.teacher}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center py-12 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                            <IconBook size={64} className="mb-6 text-slate-800" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800">No Classes</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
