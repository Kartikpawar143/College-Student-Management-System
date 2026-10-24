"use client";
import { API_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { 
    IconUsers, IconChecklist, IconCalendarCheck, IconSearch, 
    IconFileExport, IconFilter, IconChevronRight, IconUserCircle,
    IconCircleCheck, IconCircleX, IconDeviceFloppy, IconSparkles, IconActivity
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";

export default function TeacherAttendancePage() {
    const { user } = useAuth();
    const [selectedDept, setSelectedDept] = useState("CS");
    const [searchTerm, setSearchTerm] = useState("");
    
    const departments = ["IT", "CS", "IOT", "DS", "AI", "AIML", "ETC", "MEC", "ELE"];
    const [students, setStudents] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, avg: "0%" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [selectedDept]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/students/`);
            const allStudents = await res.json();
            
            // Filter by department
            const filtered = allStudents
                .filter((s: any) => s.department === selectedDept)
                .map((s: any) => ({
                    id: s._id || s.id,
                    name: s.name,
                    roll: s.rollNo,
                    status: "Present",
                    lastSeen: "Today"
                }));
            
            setStudents(filtered);
            updateStats(filtered);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (list: any[]) => {
        const total = list.length;
        const present = list.filter(s => s.status === "Present").length;
        const absent = total - present;
        const avg = total > 0 ? `${Math.round((present / total) * 100)}%` : "0%";
        setStats({ total, present, absent, avg });
    };

    const toggleStatus = (id: string) => {
        setStudents(prev => {
            const newList = prev.map(s => 
                s.id === id ? { ...s, status: s.status === "Present" ? "Absent" : "Present" } : s
            );
            updateStats(newList);
            return newList;
        });
    };

    const handleSave = async () => {
        alert("Syncing Registry with Hub...");
        // Usually you'd loop and save or send a bulk update
        // For now, this confirms the UI is dynamic
    };

    return (
        <main className="teacher-attendance min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-100/[0.06] border border-cyan-100/15 rounded-full">
                             <IconSparkles size={13} className="text-cyan-100" />
                             <span className="text-[10px] font-semibold text-cyan-100 uppercase tracking-widest leading-none">Attendance</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight leading-tight">Mark attendance</h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Record and review the daily roll call for <span className="text-cyan-100">{selectedDept}</span>.
                        </p>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto relative z-10">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0c1a29] border border-white/[0.08] rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                            <IconFileExport size={18} /> Export attendance
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-200 text-[#07111d] rounded-xl text-sm font-semibold hover:bg-cyan-100 transition-all active:scale-95"
                        >
                            <IconDeviceFloppy size={20} /> Save attendance
                        </button>
                    </div>
                </header>

                {/* Search & Sort Hub */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative z-10 bg-[#0c1a29] p-4 sm:p-5 rounded-2xl border border-white/[0.08]">
                    <div className="relative w-full md:w-[450px] group/search">
                        <IconSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-indigo-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Find student by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#081522] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-100/10 transition-all text-white placeholder:text-slate-500"
                        />
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="hidden md:block text-[10px] font-black text-slate-600 uppercase tracking-widest">Select Branch:</div>
                        <div className="relative w-full md:w-72">
                            <select 
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="w-full bg-[#081522] border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-100/10 transition-all cursor-pointer appearance-none"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept} className="bg-[#0f172a]">{dept} Branch Hub</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">
                                <IconChevronRight className="rotate-90" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        { label: "Total Members", value: stats.total, icon: IconUsers, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { label: "Active Presence", value: stats.present, icon: IconCircleCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Absentees", value: stats.absent, icon: IconCircleX, color: "text-rose-400", bg: "bg-rose-500/10" },
                        { label: "Presence Ratio", value: stats.avg, icon: IconActivity, color: "text-purple-400", bg: "bg-purple-500/10" },
                    ].map((stat, i) => (
                        <div key={i} className="group p-5 rounded-2xl bg-[#0c1a29] border border-white/[0.08] transition-all duration-300 hover:border-cyan-100/20 overflow-hidden relative">
                             <div className={`absolute top-0 right-0 w-20 h-20 ${stat.color.replace('text', 'bg')} opacity-5 blur-3xl -translate-y-10 translate-x-10 rounded-full`}></div>
                             <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 border border-white/5`}>
                                <stat.icon size={20} />
                             </div>
                             <div>
                                 <p className="text-xs font-medium text-slate-400 mb-1">{stat.label}</p>
                                 <p className="text-2xl font-semibold text-white tracking-tight leading-none">{stat.value}</p>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Student Table List */}
                <div className="bg-[#0c1a29] rounded-2xl border border-white/[0.08] overflow-hidden relative group">
                    <div className="p-4 sm:px-5 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
                         <div className="space-y-2">
                            <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-4 leading-none">
                                <span className="w-2 h-2 bg-cyan-200 rounded-full"></span>
                                {selectedDept} attendance register
                            </h3>
                            <p className="text-xs text-slate-500 leading-none ml-4">Attendance records</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto max-h-[800px] scrollbar-hide">
                        <table className="w-full text-left font-sans">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-700">Member Identity</th>
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-700 text-center text-nowrap">Node ID</th>
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-700 text-center">Branch</th>
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-700 text-center">Status</th>
                                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-700 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 relative z-10">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-32 text-center text-[10px] font-black uppercase tracking-widest text-slate-800 animate-pulse">Synchronizing Node Data...</td></tr>
                                ) : students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                                    <tr key={student.id} className="group/row hover:bg-white/5 transition-all">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-[2rem] bg-[#070b14] border border-white/5 flex items-center justify-center text-indigo-500 shadow-2xl group-hover/row:bg-indigo-600 group-hover/row:text-white transition-all duration-500 font-black text-xl">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-base tracking-tight group-hover/row:text-indigo-400 transition-all uppercase leading-none">{student.name}</p>
                                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-2">Verified Academician</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className="font-black text-white text-xs tracking-widest bg-[#070b14] px-5 py-2 rounded-xl border border-white/5 shadow-xl">{student.roll}</span>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500/40"></div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{selectedDept} Unit</span>
                                            </div>
                                            <p className="text-[8px] text-slate-800 mt-2 font-black uppercase tracking-tighter">Last Seen: {student.lastSeen}</p>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-xl border transition-all shadow-2xl ${
                                                student.status === 'Present' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' 
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                                onClick={() => toggleStatus(student.id)}
                                                className={`p-4 rounded-2xl transition-all active:scale-90 border shadow-2xl ${
                                                    student.status === 'Present' 
                                                    ? 'bg-[#070b14] text-slate-700 border-white/5 hover:text-rose-400 hover:border-rose-500/20' 
                                                    : 'bg-indigo-600 text-white border-indigo-500 hover:bg-emerald-600 hover:border-emerald-500 hover:rotate-12'
                                                }`}
                                            >
                                                <IconChecklist size={24} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
