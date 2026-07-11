"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { 
    IconCheck, IconX, IconClock, IconMessage2, 
    IconCalendarEvent, IconUser, IconChevronRight,
    IconFilter, IconDoor, IconPlaneDeparture,
    IconSearch, IconActivity, IconShieldCheck, IconSparkles, IconWalk, IconScan, IconFingerprint
} from "@tabler/icons-react";

export default function TeacherApprovalsPage() {
    const [activeTab, setActiveTab] = useState('leave');
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [gateRequests, setGateRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [leaveRes, gateRes] = await Promise.all([
                api.get(endpoints.leave.pending),
                api.get(endpoints.gatepass.pending)
            ]);
            setLeaveRequests(leaveRes.data);
            setGateRequests(gateRes.data);
            
            // Fetch all for history (optional, or just fetch on tab click)
            const allGateRes = await api.get('/gatepass/pending'); // This only gets pending, we need a better route for history
            // Actually, we should call a general history route if it exists
        } catch (err) {
            console.error("Failed to fetch approvals", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            // Since we don't have a global history route yet, we'll fetch all recorded gatepasses
            // In a real app, you'd have /gatepass/all
            // For now, let's just show what we have
        } catch (err) {}
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLeaveAction = async (id: string, newStatus: string) => {
        try {
            await api.put(endpoints.leave.approve(id, newStatus));
            setLeaveRequests(leaveRequests.filter(req => req._id !== id));
        } catch (err) {
            alert("Action failed");
        }
    };

    const handleGateAction = async (id: string, newStatus: string) => {
        try {
            await api.put(endpoints.gatepass.approve(id, newStatus));
            setGateRequests(gateRequests.filter(req => req._id !== id));
        } catch (err) {
            alert("Action failed");
        }
    };

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans text-slate-200 uppercase tracking-tight">
            <div className="max-w-7xl mx-auto space-y-12 relative font-sans">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none"></div>
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 pb-12 border-b border-white/5 relative z-10 font-sans uppercase tracking-[0.3em]">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 leading-none">Faculty Approval Hub</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Nodal Authorization</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Checking and <span className="text-white">authorizing institutional movement</span> nodes</p>
                    </div>
                    
                    <div className="flex bg-[#0f172a] p-2 rounded-[2rem] border border-white/5 relative z-10 shadow-2xl">
                        <button 
                            onClick={() => {setActiveTab('leave'); setShowHistory(false)}}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                                activeTab === 'leave' && !showHistory ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            Absence
                        </button>
                        <button 
                            onClick={() => {setActiveTab('gate'); setShowHistory(false)}}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                                activeTab === 'gate' && !showHistory ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            Short Leaves
                        </button>
                    </div>
                </header>

                {/* Content Table Area */}
                <div className="bg-[#0f172a] rounded-[5rem] border border-white/5 shadow-3xl overflow-hidden min-h-[650px] relative group uppercase font-sans flex flex-col">
                    <div className="p-12 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-20">
                        <div className="flex items-center gap-6">
                            <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)] ${activeTab === 'leave' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                            <h3 className="text-sm font-black text-white tracking-widest uppercase leading-none">
                                Pending {activeTab === 'leave' ? 'Absence Chronicles' : 'Short-Leave Vectors'}
                            </h3>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="px-6 py-2.5 bg-[#070b14] border border-white/5 rounded-2xl flex items-center gap-3">
                                 <IconActivity size={18} className="text-indigo-500 animate-pulse" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                     Registry: {(activeTab === 'leave' ? leaveRequests : gateRequests).length} NODES
                                 </span>
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 divide-y divide-white/5 relative z-10 font-sans">
                        {loading ? (
                            <div className="py-48 text-center flex flex-col items-center gap-10 grayscale opacity-40">
                                <div className="p-12 bg-[#070b14] rounded-[3rem] border border-white/5 shadow-2xl">
                                    <IconScan size={64} className="animate-pulse text-indigo-500" stroke={1} />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-800 animate-pulse">Scanning identity nodes...</p>
                            </div>
                        ) : (activeTab === 'leave' ? leaveRequests : gateRequests).length > 0 ? (
                            (activeTab === 'leave' ? leaveRequests : gateRequests).slice().reverse().map((request) => (
                                <div key={request._id} className="p-12 group/item hover:bg-white/[0.02] transition-all relative overflow-hidden uppercase font-sans">
                                    <div className="absolute top-0 right-0 w-[500px] h-full bg-indigo-600/0 group-hover/item:bg-indigo-600/[0.02] transition-colors skew-x-12 translate-x-40"></div>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                                        <div className="flex items-start gap-10 font-sans">
                                            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2xl transition-all duration-700 group-hover/item:scale-110 group-hover/item:rotate-12 ${
                                                activeTab === 'leave' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'
                                            }`}>
                                                {activeTab === 'leave' ? <IconPlaneDeparture size={40} stroke={1.5} /> : <IconWalk size={40} stroke={1.5} />}
                                            </div>
                                            <div className="space-y-4 uppercase tracking-tight font-sans">
                                                <div className="flex items-center gap-6 font-sans">
                                                    <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-none group-hover/item:text-indigo-400 transition-colors uppercase">{request.studentName || request.userName}</h4>
                                                    <span className="text-[10px] font-black px-4 py-1.5 bg-white/5 text-slate-500 rounded-xl border border-white/5 shadow-inner uppercase tracking-widest">{request.rollNo || 'N/A'}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-10 text-slate-600 font-sans tracking-widest uppercase">
                                                    <span className="flex items-center gap-3 text-[11px] font-black uppercase leading-none">
                                                        <IconCalendarEvent size={18} className="text-indigo-500" stroke={2} /> 
                                                        {activeTab === 'leave' ? `Chronicle: ${request.start_date} -> ${request.end_date}` : `Registry: ${request.date || 'Today'}`}
                                                    </span>
                                                    {activeTab === 'gate' && (
                                                        <span className="flex items-center gap-3 text-[11px] font-black uppercase leading-none">
                                                            <IconClock size={18} className="text-rose-500" stroke={2} /> Window: {request.departureTime || request.time}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-8 p-8 bg-[#070b14]/50 rounded-[2.5rem] border border-white/5 transition-all text-[11px] font-bold text-slate-500 shadow-inner max-w-2xl leading-relaxed uppercase tracking-widest group-hover/item:border-indigo-500/20">
                                                    <span className="font-black text-[9px] text-slate-700 block mb-3 opacity-60">RATIONALE VECTOR:</span>
                                                    {request.reason}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex lg:flex-col items-center gap-4 relative z-10">
                                            <button 
                                                onClick={() => activeTab === 'leave' ? handleLeaveAction(request._id, 'Rejected') : handleGateAction(request._id, 'Rejected')}
                                                className="w-full lg:w-48 py-5 rounded-2xl border border-white/5 text-slate-700 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 bg-[#070b14] shadow-xl"
                                            >
                                                Deny
                                            </button>
                                            <button 
                                                onClick={() => activeTab === 'leave' ? handleLeaveAction(request._id, 'Approved') : handleGateAction(request._id, 'Approved')}
                                                className="w-full lg:w-48 py-5 rounded-2xl bg-indigo-600 text-white hover:bg-emerald-600 transition-all text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-4 overflow-hidden group/btn font-sans"
                                            >
                                                <IconCheck size={20} stroke={2.5} className="group-hover/btn:scale-125 transition-transform" /> Authorize
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-56 text-center space-y-12 flex flex-col items-center justify-center grayscale opacity-10 group">
                                <div className="w-32 h-32 bg-[#070b14] rounded-[4rem] border-2 border-dashed border-white/5 flex items-center justify-center text-slate-800 transition-all group-hover:scale-110 group-hover:rotate-12 duration-700 shadow-3xl">
                                    <IconShieldCheck size={72} stroke={1} />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-2xl font-black text-slate-800 uppercase tracking-[0.6em]">Perimeter Secured</p>
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">No active nodes awaiting faculty authorization.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
