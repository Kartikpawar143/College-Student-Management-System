"use client";
import React, { useState, useEffect } from "react";
import { 
    IconCheck, IconX, IconUser, IconMessage2, 
    IconCalendarEvent, IconClock, IconSparkles,
    IconShieldCheck, IconArrowUpRight, IconSearch,
    IconDownload, IconFilter
} from "@tabler/icons-react";
import { api } from "@/lib/api";

export default function AdminApprovalsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ approved: 0, rejected: 0 });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get("/approvals/pending");
            setRequests(res.data);
            const history = await api.get("/approvals/history");
            const app = history.data.filter((r: any) => r.status === 'Approved').length;
            const rej = history.data.filter((r: any) => r.status === 'Rejected').length;
            setStats({ approved: app, rejected: rej });
        } catch (err) {
            console.error("Failed to fetch approvals", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: string) => {
        try {
            await api.put(`/approvals/${id}`, { status });
            fetchRequests();
        } catch (err) {
            alert("Action failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconSparkles size={10} className="text-indigo-400" />
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Authority Hub</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Leave Approvals</h2>
                        <p className="text-xs font-bold text-slate-500 leading-none">Review and process <span className="text-indigo-400">clearance requests</span>.</p>
                    </div>
                </header>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Pending Review", val: requests.length, icon: IconSearch, color: "text-amber-400", bg: "bg-amber-500/10" },
                        { label: "Approved Overall", val: stats.approved, icon: IconShieldCheck, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { label: "Rejected Overall", val: stats.rejected, icon: IconX, color: "text-rose-400", bg: "bg-rose-500/10" }
                    ].map((stat, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] bg-[#0f172a] border border-white/5 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-white/5 shadow-inner transition-all group-hover:rotate-6`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                    <p className="text-4xl font-black text-white tracking-tighter leading-none">{stat.val}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Requests Container */}
                <div className="bg-[#0f172a] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden min-h-[500px] relative font-sans">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#070b14]/50">
                        <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Queue Analysis
                        </h3>
                    </div>

                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-24 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Decrypting Request Nodes...</div>
                        ) : requests.length > 0 ? (
                            requests.map((request) => (
                                <div key={request._id} className="p-10 group hover:bg-white/[0.02] transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                        <div className="flex items-start gap-8">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#070b14] flex items-center justify-center text-slate-700 border border-white/5 shadow-2xl group-hover:bg-indigo-600 transition-all group-hover:text-white">
                                                <IconUser size={28} />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-4">
                                                    <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none">{request.studentName || 'Faculty Member'}</h4>
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest bg-white/5 border border-white/5 text-slate-400 capitalize`}>
                                                        Node: {request.studentId ? 'Student' : 'Teacher'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-6 text-slate-500">
                                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                        <IconCalendarEvent size={14} className="text-indigo-400" /> {request.fromDate}
                                                    </span>
                                                    <span className="text-slate-800 text-xs">/</span>
                                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                        <IconClock size={14} className="text-rose-400" /> {request.toDate}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-4 p-5 bg-[#070b14]/50 rounded-[2rem] border border-white/5 group-hover:border-indigo-500/20 transition-all">
                                                    <IconMessage2 size={20} className="text-slate-700" />
                                                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic-none">{request.reason}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row lg:flex-col gap-4 justify-end">
                                            <button 
                                                onClick={() => handleAction(request._id, 'Approved')}
                                                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95"
                                            >
                                                <IconCheck size={18} /> Authorize
                                            </button>
                                            <button 
                                                onClick={() => handleAction(request._id, 'Rejected')}
                                                className="px-10 py-5 bg-[#070b14] text-slate-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white border border-white/5 transition-all flex items-center gap-3 active:scale-95"
                                            >
                                                <IconX size={18} /> Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-32 text-center space-y-6">
                                <div className="w-20 h-20 bg-[#070b14] rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/5 shadow-2xl text-slate-900">
                                    <IconShieldCheck size={40} />
                                </div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Clearance Queue Empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
