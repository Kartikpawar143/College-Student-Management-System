"use client";
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
            const res = await fetch("http://localhost:8001/students/");
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
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconSparkles size={12} className="text-indigo-400" />
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Attendance Log</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Mark Attendance</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">
                            Daily roll call for <span className="text-indigo-400">{selectedDept} Branch</span>. Keep it updated!
                        </p>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto relative z-10">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-[#0f172a] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                            <IconFileExport size={18} /> Export Data
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
                        >
                            <IconDeviceFloppy size={20} /> Deploy Registry
                        </button>
                    </div>
                </header>

                {/* Search & Sort Hub */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10 bg-[#0f172a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
                    <div className="relative w-full md:w-[450px] group/search">
                        <IconSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-indigo-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="FIND MEMBER BY NAME..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#070b14] border border-white/5 rounded-3xl pl-16 pr-8 py-5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl text-white placeholder:text-slate-800"
                        />
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="hidden md:block text-[10px] font-black text-slate-600 uppercase tracking-widest">Select Branch:</div>
                        <div className="relative w-full md:w-72">
                            <select 
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="w-full bg-[#070b14] border border-white/5 text-white rounded-2xl px-8 py-5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-2xl cursor-pointer appearance-none"
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Total Members", value: stats.total, icon: IconUsers, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { label: "Active Presence", value: stats.present, icon: IconCircleCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Absentees", value: stats.absent, icon: IconCircleX, color: "text-rose-400", bg: "bg-rose-500/10" },
                        { label: "Presence Ratio", value: stats.avg, icon: IconActivity, color: "text-purple-400", bg: "bg-purple-500/10" },
                    ].map((stat, i) => (
                        <div key={i} className="group p-10 rounded-[3.5rem] bg-[#0f172a] border border-white/5 shadow-2xl hover:border-indigo-500/20 transition-all duration-500 overflow-hidden relative">
                             <div className={`absolute top-0 right-0 w-20 h-20 ${stat.color.replace('text', 'bg')} opacity-5 blur-3xl -translate-y-10 translate-x-10 rounded-full`}></div>
                             <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-10 border border-white/5 shadow-2xl group-hover:scale-110 transition-all`}>
                                <stat.icon size={32} />
                             </div>
                             <div>
                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">{stat.label}</p>
                                 <p className="text-4xl font-black text-white tracking-tight leading-none">{stat.value}</p>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Student Table List */}
                <div className="bg-[#0f172a] rounded-[4.5rem] border border-white/5 shadow-3xl overflow-hidden relative group">
                    <div className="p-10 border-b border-white/5 flex items-center justify-between bg-[#070b14]/50">
                         <div className="space-y-2">
                            <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-4 leading-none">
                                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                                {selectedDept} Operational Registry
                            </h3>
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] leading-none ml-6">Secured Academic Data Hub</p>
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
