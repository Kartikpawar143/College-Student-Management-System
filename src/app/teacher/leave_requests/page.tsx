"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconPlus, IconCalendarEvent, IconClock, IconMessage2,
    IconCheck, IconX, IconHistory, IconAlertCircle,
    IconPlaneDeparture, IconArrowRight, IconLoader2
} from "@tabler/icons-react";

export default function TeacherLeavePage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        type: "Casual Leave",
        start_date: "",
        end_date: "",
        reason: ""
    });

    const fetchLeaves = async () => {
        if (!user?.id) return;
        try {
            const res = await api.get(endpoints.leave.getByUser(user.id));
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch leaves", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);

        const payload = {
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            reason: formData.reason,
            start_date: formData.start_date,
            end_date: formData.end_date,
            status: "Pending",
            type: formData.type // Although not in the original model, we can add it or just put in reason
        };

        try {
            await api.post(endpoints.leave.apply, payload);
            setIsModalOpen(false);
            setFormData({ type: "Casual Leave", start_date: "", end_date: "", reason: "" });
            fetchLeaves();
        } catch (err) {
            console.error("Failed to submit leave", err);
            alert("Failed to submit leave request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 space-y-12 text-slate-200">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-rose-600/10 blur-[120px] rounded-full"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Leave Chronicles</h2>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-3">Registry of Official Absences & Petitions</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-rose-600/20 transition-all flex items-center justify-center gap-4 uppercase text-[10px] tracking-widest active:scale-95 relative z-10"
                >
                    <IconPlus size={18} /> New Petition
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Active & History Feed */}
                <div className="md:col-span-8 space-y-10">
                    <div className="bg-[#0f172a] rounded-[4.5rem] border border-white/5 shadow-2xl overflow-hidden min-h-[500px] flex flex-col relative group">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-[#070b14]/50">
                            <h3 className="font-black text-white flex items-center gap-4 text-sm uppercase tracking-widest leading-none">
                                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span> Archive Registry
                            </h3>
                        </div>

                        <div className="divide-y divide-white/5 flex-1 relative z-10">
                            {loading ? (
                                <div className="py-24 text-center flex flex-col items-center gap-6">
                                    <IconLoader2 size={40} className="animate-spin text-indigo-500" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">Syncing Chronological Data...</p>
                                </div>
                            ) : requests.length > 0 ? (
                                requests.slice().reverse().map((req) => (
                                    <div key={req._id} className="p-12 group/item hover:bg-white/5 transition-all relative">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                                            <div className="flex items-start gap-8">
                                                <div className="w-20 h-20 rounded-[2.5rem] bg-[#070b14] text-rose-500 flex items-center justify-center border border-white/5 shadow-2xl group-hover/item:bg-rose-600 group-hover/item:text-white transition-all duration-500">
                                                    <IconPlaneDeparture size={36} />
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="font-black text-white tracking-tight text-3xl uppercase leading-none">{req.type || "Casual Petition"}</h4>
                                                    <div className="flex flex-wrap items-center gap-8">
                                                        <span className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                            <IconCalendarEvent size={18} className="text-rose-500" /> {new Date(req.start_date).toLocaleDateString()} — {new Date(req.end_date).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                            <IconHistory size={18} className="text-indigo-500" /> LOGGED: {new Date(req.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="mt-6 p-6 bg-[#070b14] rounded-[2.5rem] border border-white/5 group-hover/item:border-rose-500/20 transition-all font-sans relative">
                                                        <IconMessage2 className="absolute top-6 right-6 text-slate-800" size={16} />
                                                        <p className="text-sm text-slate-400 font-medium leading-[1.8] tracking-normal not-uppercase lowercase first-letter:uppercase pr-8 pl-1">"{req.reason}"</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 lg:flex-col lg:justify-center">
                                                <div className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border shadow-2xl ${
                                                    req.status === 'Approved' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                    : req.status === 'Rejected'
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {req.status === 'Approved' ? <IconCheck size={16} /> : req.status === 'Rejected' ? <IconX size={16} /> : <IconAlertCircle size={16} />}
                                                    {req.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-44 text-center flex flex-col items-center justify-center space-y-10">
                                    <div className="w-24 h-24 bg-[#070b14] rounded-[3.5rem] flex items-center justify-center text-slate-900 border border-white/5 shadow-2xl">
                                        <IconHistory size={64} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-black text-slate-700 uppercase tracking-[0.5em]">Timeline Empty</p>
                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">No leaf sequences detected in active registry</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Context - Quota */}
                <div className="md:col-span-4 space-y-10">
                    <div className="bg-[#0f172a] rounded-[4rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-600/10 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-all"></div>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-12 relative z-10 leading-none">Sequence Quota</h3>
                        
                        <div className="space-y-10 relative z-10">
                            {[
                                { label: "Casual Cycle", used: requests.filter(r => r.type === "Casual Leave" && r.status === "Approved").length, total: 12, color: "bg-indigo-500", glow: "shadow-[0_0_15px_rgba(79,70,229,0.5)]" },
                                { label: "Physiological Recovery", used: requests.filter(r => r.type === "Sick Leave" && r.status === "Approved").length, total: 8, color: "bg-rose-500", glow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]" },
                                { label: "Emergency Override", used: requests.filter(r => r.type === "Emergency" && r.status === "Approved").length, total: 3, color: "bg-amber-500", glow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]" },
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">{item.total - item.used} Rem</span>
                                    </div>
                                    <div className="h-2.5 bg-[#070b14] rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className={`h-full ${item.color} ${item.glow} transition-all duration-1000`} 
                                            style={{ width: `${Math.max(0, ((item.total - item.used) / item.total) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-14 p-8 bg-[#070b14]/50 border border-white/5 rounded-[3rem] text-[9px] font-black text-slate-600 leading-relaxed uppercase tracking-[0.3em] text-center border-dashed">
                            Institutional protocols require 24h advance signaling for standard petitions.
                        </div>
                    </div>

                    <div className="bg-[#0f172a] rounded-[4rem] border border-white/5 p-12 shadow-2xl flex flex-col items-center text-center space-y-10 group transition-all hover:border-indigo-500/20">
                        <div className="w-24 h-24 rounded-[3rem] bg-[#070b14] text-indigo-400 flex items-center justify-center border border-white/5 shadow-2xl group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                            <IconMessage2 size={44} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Registry Support</h4>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-[1.8] px-2">Contact academic node controllers for cycle extensions or data corrections.</p>
                        </div>
                        <button className="w-full py-6 bg-[#070b14] text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all active:scale-95 border border-white/5 shadow-xl">
                            Connect with Controller
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/80 backdrop-blur-xl animate-in fade-in duration-300 font-sans">
                    <div className="bg-[#0f172a] w-full max-w-2xl rounded-[4.5rem] p-14 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] scrollbar-hide relative group">
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-600/5 blur-[80px] rounded-full"></div>
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div>
                                <h3 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Initialize Petition</h3>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-3">Formalize Leave Sequence Request</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-700 hover:text-rose-500 transition-all p-5 bg-[#070b14] rounded-[2rem] border border-white/5 shadow-xl hover:rotate-90">
                                <IconX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12 uppercase tracking-[0.1em] font-black relative z-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Cycle Designation</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-12 py-7 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="Casual Leave">Casual Sequence</option>
                                        <option value="Sick Leave">Physiological Break</option>
                                        <option value="Emergency">Emergency Override</option>
                                        <option value="On Duty">Institutional Duty (OD)</option>
                                    </select>
                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">
                                        <IconArrowRight className="rotate-90" size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Start Sync</label>
                                    <input 
                                        required
                                        type="date"
                                        className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-12 py-7 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all uppercase"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Terminal Sync</label>
                                    <input 
                                        required
                                        type="date"
                                        className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-12 py-7 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all uppercase"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Justification Transmission</label>
                                <textarea 
                                    required
                                    rows={4}
                                    placeholder="DETAILED PURPOSE LOG..."
                                    className="w-full bg-[#070b14] border border-white/5 rounded-[3rem] px-12 py-10 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all resize-none font-sans not-uppercase placeholder:text-slate-900"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-rose-600 hover:bg-rose-50 text-rose-50 hover:text-rose-600 font-black py-8 rounded-[4rem] shadow-2xl shadow-rose-600/30 transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.5em] active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? <IconLoader2 className="animate-spin" size={24} /> : <IconPlaneDeparture size={24} />}
                                {submitting ? "Processing Transmission" : "Deploy Petition"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
