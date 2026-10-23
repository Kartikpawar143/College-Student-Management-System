"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { 
    IconDoor, IconCheck, IconX, IconClock, 
    IconUser, IconMapPin, IconCalendarEvent,
    IconSearch, IconShieldCheck, IconLogout2,
    IconFingerprint, IconScan, IconActivity, IconSparkles, IconLock, IconWalk
} from "@tabler/icons-react";

export default function AdminShortLeavesPage() {
    const [approvedPasses, setApprovedPasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchApprovedPasses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/gatepass/pending');
            setApprovedPasses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedPasses();
    }, []);

    const handleAction = async (id: string, newStatus: string) => {
        try {
            await api.put(endpoints.gatepass.approve(id, newStatus));
            setApprovedPasses(approvedPasses.filter(req => req._id !== id));
        } catch (err) {
            alert("Security Protocol Error");
        }
    };

    const filteredPasses = approvedPasses.filter(p => 
        p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.rollNo && p.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const studentsInQueue = new Set(approvedPasses.map(pass => pass.studentId || pass.studentName).filter(Boolean)).size;
    const requestsWithReason = approvedPasses.filter(pass => Boolean(pass.reason?.trim())).length;

    return (
        <main className="admin-feature-page admin-short-leaves-page min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans text-slate-200 uppercase tracking-tight">
            <div className="max-w-7xl mx-auto space-y-12 relative font-sans short-leave-workspace">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none"></div>
                
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative z-10 font-sans uppercase tracking-[0.3em]">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 leading-none">Security Registry</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Short Leaves Hub</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Monitoring campus movement authorization nodes in real-time [ADMIN]</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 font-sans uppercase tracking-widest font-black">
                         <div className="px-8 py-4 bg-[#0f172a] border border-white/5 rounded-2xl flex items-center gap-4 shadow-xl font-sans group">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                             <span className="text-[10px] text-slate-500 font-black uppercase">Pending in queue: <span className="text-white">{approvedPasses.length}</span></span>
                         </div>
                    </div>
                </header>

                {/* Tactical Stats Row */}
                <div className="short-leave-stats grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 font-sans uppercase">
                    {[
                        { label: "Pending requests", val: approvedPasses.length, icon: IconClock, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { label: "Students in queue", val: studentsInQueue, icon: IconUser, color: "text-cyan-200", bg: "bg-cyan-500/10" },
                        { label: "Requests with reason", val: requestsWithReason, icon: IconCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Search results", val: filteredPasses.length, icon: IconSearch, color: "text-amber-300", bg: "bg-amber-500/10" },
                    ].map((stat, i) => (
                        <div key={i} className="short-leave-stat bg-[#0f172a] p-8 rounded-[3.5rem] border border-white/5 shadow-2xl group hover:border-indigo-500/20 transition-all flex items-center gap-8">
                            <div className={`short-leave-stat-icon w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl border border-white/5`}>
                                <stat.icon size={26} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                <p className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors uppercase leading-none">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="short-leave-layout grid grid-cols-1 lg:grid-cols-12 gap-10 font-sans relative z-10">
                    {/* Security Ledger */}
                    <div className="leave-queue-panel lg:col-span-8 bg-[#0f172a] border border-white/5 rounded-[4.5rem] shadow-3xl overflow-hidden min-h-[650px] flex flex-col relative group uppercase">
                        <div className="leave-queue-toolbar p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white/[0.02] relative z-20">
                            <div className="flex items-center gap-6">
                                <div className="w-5 h-5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                                <h3 className="font-black text-white text-sm uppercase tracking-widest leading-none">Validation Queue</h3>
                            </div>
                            <div className="relative group/search w-full md:w-80">
                                <IconSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-indigo-400 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="QUERY BIOMETRICS..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] pl-16 pr-8 py-5 text-[10px] font-black uppercase tracking-widest outline-none shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder:text-slate-900" 
                                />
                            </div>
                        </div>

                        <div className="leave-queue-list flex-1 divide-y divide-white/5 relative z-10 font-sans uppercase">
                            {loading ? (
                                <div className="py-48 text-center flex flex-col items-center gap-10 grayscale opacity-40">
                                    <div className="p-12 bg-[#070b14] rounded-[3rem] border border-white/5 shadow-2xl">
                                        <IconScan size={64} className="animate-pulse text-indigo-500" stroke={1} />
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-800 animate-pulse">Scanning identity nodes...</p>
                                </div>
                            ) : filteredPasses.length > 0 ? (
                                filteredPasses.map((request) => (
                                    <div key={request._id} className="leave-request-card p-12 group/item hover:bg-white/[0.02] transition-all relative overflow-hidden uppercase font-sans">
                                        <div className="absolute top-0 right-0 w-80 h-full bg-indigo-600/0 group-hover/item:bg-indigo-600/[0.02] transition-colors skew-x-12 translate-x-20"></div>
                                        <div className="leave-request-layout flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
                                            <div className="leave-student flex items-start gap-10 font-sans">
                                                <div className="leave-avatar w-20 h-20 rounded-[2.5rem] bg-[#070b14] border border-white/5 flex items-center justify-center text-slate-800 group-hover/item:text-indigo-400 transition-colors">
                                                    <IconUser size={36} />
                                                </div>
                                                <div className="leave-details space-y-4 font-sans uppercase tracking-tight">
                                                    <div className="flex items-center gap-6 font-sans">
                                                        <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-none group-hover/item:text-indigo-400 transition-colors uppercase">{request.studentName}</h4>
                                                        <span className="text-[10px] font-black px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl uppercase tracking-widest border border-emerald-500/20 animate-pulse">Pending Commit</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-10 text-slate-600 font-sans tracking-widest uppercase">
                                                        <span className="flex items-center gap-3 text-[11px] font-black leading-none uppercase">
                                                            <IconCalendarEvent size={18} className="text-indigo-500" /> {request.date}
                                                        </span>
                                                        <span className="flex items-center gap-3 text-[11px] font-black leading-none uppercase">
                                                            <IconClock size={18} className="text-rose-500" /> Egress: {request.departureTime || request.time}
                                                        </span>
                                                        <span className={`text-[11px] font-black px-5 py-2 rounded-2xl border transition-all ${
                                                            request.reason.length > 3 ? 'bg-[#070b14] text-amber-500 border-amber-500/20' : 'bg-[#070b14] text-slate-700 border-white/5'
                                                        }`}>
                                                            {request.reason}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="leave-actions flex items-center gap-6 relative z-10">
                                                <button 
                                                    onClick={() => handleAction(request._id, 'Rejected')}
                                                    className="p-5 rounded-2xl border border-white/5 text-slate-800 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all active:scale-90 shadow-xl bg-[#070b14]"
                                                    title="Deny Vector"
                                                >
                                                    <IconX size={28} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(request._id, 'Exited')}
                                                    className="px-14 py-6 rounded-[3rem] bg-indigo-600 text-white hover:bg-emerald-600 transition-all text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 flex items-center justify-center gap-4 group/btn font-sans overflow-hidden relative"
                                                >
                                                    <IconLogout2 size={24} className="group-hover/btn:translate-x-2 transition-transform duration-500" /> Confirm Leave
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-48 text-center space-y-12 flex flex-col items-center justify-center grayscale opacity-10 group">
                                    <div className="w-32 h-32 bg-[#070b14] rounded-[4rem] border-2 border-dashed border-white/5 flex items-center justify-center text-slate-800 transition-all group-hover:scale-110 group-hover:rotate-12 duration-700 shadow-3xl">
                                        <IconWalk size={72} stroke={1} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-2xl font-black text-slate-800 uppercase tracking-[0.6em]">Aether Null</p>
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">No active Short Leave requests detected in the registry.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Security Control Panel */}
                    <div className="lg:col-span-4 space-y-10 font-sans uppercase">
                        <div className="leave-rules-card bg-[#070b14] rounded-[4rem] p-12 text-white shadow-3xl border border-white/5 relative overflow-hidden group font-sans uppercase transition-all hover:border-indigo-500/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-bl-full pointer-events-none"></div>
                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="p-4 bg-[#0f172a] rounded-2xl border border-white/5 shadow-2x">
                                    <IconLock size={32} className="text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase leading-none font-sans">Institutional Rules</h3>
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mt-3 leading-none">Short-Leave Logic [0-1]</p>
                                </div>
                            </div>
                            
                            <div className="space-y-10 font-sans relative z-10 uppercase tracking-widest">
                                {[
                                    { title: "Validation Gate", desc: "All student short leaves require official registry verification." },
                                    { title: "Temporal Decay", desc: "Approved nodes automatically terminate after 180 minutes of inactivity." },
                                    { title: "Audit Persistence", desc: "Every egress event is permanently logged in the institutional ledger." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-4 border-l-2 border-indigo-500/20 pl-8 py-2 font-sans group/rule hover:border-indigo-500/80 transition-all">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white leading-none">{item.title}</h4>
                                        <p className="text-xs text-slate-600 font-bold leading-relaxed uppercase tracking-widest opacity-60 group-hover/rule:opacity-100 transition-opacity uppercase">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="leave-clearance-card bg-[#0f172a] border border-white/5 rounded-[4rem] p-14 shadow-2xl text-center group hover:border-indigo-500/20 transition-all font-sans relative overflow-hidden uppercase">
                             <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/[0.02] transition-colors pointer-events-none"></div>
                             <div className="w-24 h-24 bg-[#070b14] text-indigo-500 rounded-[2.8rem] mx-auto flex items-center justify-center mb-10 shadow-3xl border border-white/5 group-hover:scale-110 transition-all duration-700">
                                <IconFingerprint size={48} stroke={1.5} />
                             </div>
                             <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] mb-4 font-sans leading-none">Access Clearance</h3>
                             <p className="text-5xl font-black text-white tracking-tighter mb-4 select-none uppercase leading-none tabular-nums">ADMIN</p>
                             <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#070b14] border border-white/5 rounded-full shadow-2xl">
                                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Session Active</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
