"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconCalendarWeek, IconClock, IconUser, IconMapPin,
    IconPlus, IconTrash, IconX, IconBook, IconCheck,
    IconTableShortcut, IconLayoutDashboard
} from "@tabler/icons-react";

export default function TeacherTimetablePage() {
    const { user } = useAuth();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const branches = ["IT", "CS", "ENTC", "Automobile"];
    const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
    
    const [fullSchedule, setFullSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    const [newSlot, setNewSlot] = useState({
        day: "Monday",
        time: "",
        subject: "",
        teacher: user?.name || "",
        room: "",
        type: "Lecture",
        branch: user?.department || "CS",
        semester: "1"
    });

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
    }, [user]);

    const handleAddSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            if (newSlot.day === "All Working Days") {
                const promises = days.map(day => 
                    api.post(endpoints.timetable.add, { ...newSlot, day })
                );
                await Promise.all(promises);
            } else {
                await api.post(endpoints.timetable.add, newSlot);
            }
            
            setIsModalOpen(false);
            setIsSuccessOpen(true);
            setNewSlot({ 
                day: "Monday", 
                time: "", 
                subject: "", 
                teacher: user?.name || "", 
                room: "", 
                type: "Lecture",
                branch: user?.department || "CS",
                semester: "1"
            });
            fetchAllSchedules();
        } catch (err) {
            alert("Conflict detected. This time slot might already be taken by another class.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this class from the schedule?")) return;
        try {
            await api.delete(endpoints.timetable.delete(id));
            fetchAllSchedules();
        } catch (err) {
            alert("Failed to delete class.");
        }
    };

    const timeSlots = Array.from(new Set(fullSchedule.map(s => s.time))).sort();

    return (
        <main className="teacher-timetable min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-300/[0.06] blur-[100px] rounded-full"></div>
                
                <div className="flex items-center gap-6 relative z-10 font-sans">
                    <div className="w-11 h-11 bg-cyan-300/10 border border-cyan-100/10 rounded-xl flex items-center justify-center text-cyan-100">
                        <IconCalendarWeek size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight leading-tight">Teaching timetable</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage weekly classes and room assignments</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4 relative z-10">
                    <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-white/5 shadow-xl">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}
                        >
                            <IconTableShortcut size={16} /> Grid View
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}
                        >
                            <IconLayoutDashboard size={16} /> List View
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-cyan-200 hover:bg-cyan-100 text-[#07111d] font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <IconPlus size={18} stroke={3} /> Add Class
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="py-24 text-center text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] animate-pulse">Loading all schedules...</div>
            ) : viewMode === 'grid' ? (
                <div className="bg-[#0c1a29] rounded-2xl border border-white/[0.08] overflow-hidden relative">
                    <div className="p-4 sm:px-5 border-b border-white/[0.07] bg-white/[0.02] flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-white">Weekly schedule</h2>
                        <span className="text-xs text-slate-400">{fullSchedule.length} classes</span>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar relative z-10">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#070b14]/30">
                                    <th className="p-10 border-r border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest w-40">Time</th>
                                    {days.map(day => (
                                        <th key={day} className="p-10 border-b border-white/10 text-[11px] font-black text-white uppercase tracking-widest min-w-[200px]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.length > 0 ? (
                                    timeSlots.map(time => (
                                        <tr key={time} className="group/row hover:bg-white/[0.02] transition-all">
                                            <td className="p-8 border-r border-b border-white/5 text-center bg-[#070b14]/5">
                                                <div className="flex flex-col items-center gap-2">
                                                    <IconClock size={16} className="text-slate-700" />
                                                    <span className="text-[10px] font-black text-indigo-400 tracking-widest">{time}</span>
                                                </div>
                                            </td>
                                            {days.map(day => {
                                                const slot = fullSchedule.find(s => s.day === day && s.time === time);
                                                return (
                                                    <td key={day} className="p-6 border-b border-white/5 relative">
                                                        {slot ? (
                                                            <div className="p-6 rounded-3xl bg-[#070b14] border border-white/5 group-hover/row:border-indigo-500/30 transition-all hover:bg-indigo-600/10 group relative overflow-hidden shadow-xl text-left">
                                                                <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => handleDelete(slot._id)} className="p-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-xl">
                                                                        <IconTrash size={12} />
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs font-black text-white uppercase tracking-tight mb-2 leading-tight">{slot.subject}</p>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${slot.type === 'Practical' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                                        {slot.type}
                                                                    </span>
                                                                    <span className="text-[8px] font-black text-slate-600 flex items-center gap-1 uppercase">
                                                                        <IconMapPin size={10} /> Room {slot.room}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between gap-1 opacity-60 group-hover:opacity-100 transition-all">
                                                                    <p className="text-[8px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                                                        <IconUser size={10} /> {slot.teacher}
                                                                    </p>
                                                                    <span className="text-[8px] font-black text-indigo-500 uppercase">{slot.branch} SEM {slot.semester}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-20 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all border border-dashed border-white/5 rounded-3xl group/cell">
                                                                <button 
                                                                    onClick={() => {
                                                                        setNewSlot({...newSlot, day, time});
                                                                        setIsModalOpen(true);
                                                                    }}
                                                                    className="text-slate-800 hover:text-indigo-400 p-2 transition-transform hover:scale-125"
                                                                >
                                                                    <IconPlus size={20} stroke={3} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                            <td colSpan={7} className="p-10 text-center">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="w-20 h-20 bg-[#070b14] rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2xl text-slate-800">
                                                    <IconBook size={40} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">No classes scheduled yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 font-sans">
                    {days.map(day => {
                        const daySchedule = fullSchedule.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time));
                        return (
                            <div key={day} className="bg-[#0c1a29] rounded-2xl border border-white/[0.08] overflow-hidden group hover:border-cyan-100/20 transition-all flex flex-col min-h-0">
                                <div className="p-4 border-b border-white/[0.07] bg-white/[0.02] flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-white">{day}</h3>
                                    <span className="text-xs text-slate-400">{daySchedule.length} classes</span>
                                </div>
                                <div className="p-8 space-y-4 flex-1">
                                    {daySchedule.length > 0 ? daySchedule.map(slot => (
                                        <div key={slot._id} className="p-6 bg-[#070b14] rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group/item relative shadow-lg text-left">
                                            <button onClick={() => handleDelete(slot._id)} className="absolute top-4 right-4 p-2 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-xl">
                                                <IconX size={14} stroke={3} />
                                            </button>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center text-indigo-400 border border-white/5">
                                                        <IconClock size={16} stroke={2} />
                                                    </div>
                                                    <span className="text-xs font-black text-white tracking-widest">{slot.time}</span>
                                                </div>
                                                <span className="text-[8px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{slot.branch} S{slot.semester}</span>
                                            </div>
                                            <h4 className="text-base font-black text-white uppercase tracking-tight mb-2 leading-none">{slot.subject}</h4>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border ${slot.type === 'Practical' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>{slot.type}</span>
                                                <span className="text-[9px] font-bold text-slate-600 flex items-center gap-1 uppercase"><IconUser size={12} /> {slot.teacher}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center py-10 opacity-20 grayscale">
                                            <IconBook size={40} className="mb-4" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">No classes</p>
                                        </div>
                                    )}
                                </div>
                                <div className="px-5 pb-5">
                                    <button 
                                        onClick={() => {
                                            setNewSlot({...newSlot, day});
                                            setIsModalOpen(true);
                                        }}
                                        className="w-full py-5 border-2 border-dashed border-white/5 rounded-2xl text-slate-700 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-white/5 transition-all flex items-center justify-center gap-3 group/add"
                                    >
                                        <IconPlus size={16} stroke={3} /> <span className="text-[10px] font-black uppercase tracking-widest">Add Class</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-xl animate-in fade-in duration-500 font-sans">
                    <div className="bg-[#0f172a] w-full max-w-2xl rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full translate-x-12 -translate-y-12"></div>
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div className="text-left">
                                <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Add New Class</h3>
                                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-3">
                                    {newSlot.day === "All Working Days" ? "Adding for all working days" : `Adding class for ${newSlot.day}`}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                <IconX size={20} stroke={3} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSlot} className="space-y-8 relative z-10 uppercase tracking-widest text-left">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Select Day</label>
                                <select className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer uppercase shadow-xl"
                                    value={newSlot.day} onChange={e => setNewSlot({...newSlot, day: e.target.value})}>
                                    <option value="All Working Days" className="bg-[#0f172a]">All Cycle Days (Mon-Sat)</option>
                                    {days.map(d => (
                                        <option key={d} value={d} className="bg-[#0f172a]">{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Select Branch</label>
                                    <select className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer uppercase shadow-xl"
                                        value={newSlot.branch} onChange={e => setNewSlot({...newSlot, branch: e.target.value})}>
                                        {branches.map(b => (
                                            <option key={b} value={b} className="bg-[#0f172a]">{b} Branch</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Select Semester</label>
                                    <select className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer uppercase shadow-xl"
                                        value={newSlot.semester} onChange={e => setNewSlot({...newSlot, semester: e.target.value})}>
                                        {semesters.map(s => (
                                            <option key={s} value={s} className="bg-[#0f172a]">Semester {s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Time (e.g. 10:00 - 11:00)</label>
                                    <input required type="text" placeholder="Start - End Time" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 shadow-xl"
                                        value={newSlot.time} onChange={e => setNewSlot({...newSlot, time: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Subject Name</label>
                                    <input required type="text" placeholder="Enter Subject Name" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 shadow-xl"
                                        value={newSlot.subject} onChange={e => setNewSlot({...newSlot, subject: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Teacher Name</label>
                                    <input required type="text" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 shadow-xl"
                                        value={newSlot.teacher} onChange={e => setNewSlot({...newSlot, teacher: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Room Number</label>
                                    <input required type="text" placeholder="e.g. 101 or LAB-1" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 shadow-xl"
                                        value={newSlot.room} onChange={e => setNewSlot({...newSlot, room: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Class Type</label>
                                <select className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer uppercase shadow-xl"
                                    value={newSlot.type} onChange={e => setNewSlot({...newSlot, type: e.target.value})}>
                                    <option value="Lecture" className="bg-[#0f172a]">Core Lecture</option>
                                    <option value="Practical" className="bg-[#0f172a]">Practical Lab</option>
                                    <option value="Seminar" className="bg-[#0f172a]">Seminar</option>
                                    <option value="Workshop" className="bg-[#0f172a]">Workshop</option>
                                </select>
                            </div>

                            <button type="submit" disabled={uploading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-7 rounded-[4rem] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4 uppercase text-[11px] tracking-[0.4em] active:scale-95 mt-4 disabled:opacity-50">
                                <IconCheck size={20} stroke={3} /> {uploading ? "Adding to schedule..." : "Add to Timetable"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {isSuccessOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500 font-sans">
                    <div className="bg-[#0f172a] w-full max-sm:max-w-xs max-w-sm rounded-[3.5rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-500 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full"></div>
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl transition-all hover:scale-110">
                            <IconCheck size={40} stroke={3} />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-3 leading-none">Class Added</h3>
                        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mb-10 leading-none">The timetable has been updated successfully</p>
                        <button 
                            onClick={() => setIsSuccessOpen(false)}
                            className="w-full bg-indigo-600 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-xl shadow-indigo-600/10"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
            </div>
        </main>
    );
}
