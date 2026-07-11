"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconDoor, IconClock, IconMessage2, IconCheck,
    IconLoader2, IconX, IconAlertCircle, IconArrowRight,
    IconShieldCheck, IconChevronRight, IconSparkles, IconLock, IconWalk, IconScan, IconActivity,
    IconHistory
} from "@tabler/icons-react";

export default function StudentShortLeavesPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [history, setHistory] = useState<any[]>([]);
    const [fetchingHistory, setFetchingHistory] = useState(false);
    
    const [formData, setFormData] = useState({
        reason: "",
        departureTime: "",
        returnTime: "",
        type: "Emergency"
    });

    const fetchHistory = async () => {
        if (!user) return;
        setFetchingHistory(true);
        try {
            const res = await api.get(`/gatepass/student/${user.id}`);
            setHistory(res.data.reverse()); // Latest first
        } catch (err) {
            console.error("History fetch failed", err);
        } finally {
            setFetchingHistory(false);
        }
    };

    React.useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const payload = {
            studentId: user.id,
            studentName: user.name,
            rollNo: user.rollNo || "N/A",
            reason: formData.reason,
            departureTime: formData.departureTime,
            returnTime: formData.returnTime,
            status: "Pending",
            type: formData.type
        };

        try {
            await api.post("/gatepass/apply", payload);
            setSubmitted(true);
            fetchHistory(); // Refresh history
        } catch (err) {
            console.error("Gatepass failed", err);
            alert("Application failed.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#070b14] flex items-center justify-center p-8 lg:p-12 font-sans text-slate-200">
                <div className="bg-[#0f172a] p-16 lg:p-24 rounded-[5rem] text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-indigo-500/20 animate-in zoom-in-95 duration-700 max-w-2xl relative overflow-hidden group uppercase tracking-tight">
                    <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.5)]"></div>
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
                    
                    <div className="w-32 h-32 bg-[#070b14] text-indigo-400 rounded-[3rem] flex items-center justify-center mx-auto border border-white/5 shadow-2xl mb-14 group-hover:scale-110 transition-transform duration-700 group-hover:rotate-12">
                        <IconShieldCheck size={64} stroke={1} />
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Request Sent Successfully</h3>
                        <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] leading-relaxed px-16">
                            Your leave request has been sent to the teacher. Please wait for approval.
                        </p>
                    </div>

                    <div className="pt-16">
                         <button onClick={() => setSubmitted(false)} className="px-16 py-6 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95">
                              Back to Dashboard
                         </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans text-slate-200 uppercase tracking-tight">
            <div className="max-w-7xl mx-auto space-y-16 relative font-sans">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none"></div>
                
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Leave Management</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Short Leaves</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Submit new requests and monitor your historical applications</p>
                    </div>
                    
                    <div onClick={fetchHistory} className="flex items-center gap-6 relative z-10 uppercase tracking-widest font-black cursor-pointer group">
                         <div className="px-8 py-4 bg-[#0f172a] border border-white/5 rounded-2xl flex items-center gap-4 shadow-xl group-hover:border-indigo-500/30 transition-all">
                             <div className={`w-1.5 h-1.5 ${fetchingHistory ? 'bg-indigo-500 animate-spin' : 'bg-emerald-500'} rounded-full`}></div>
                             <span className="text-[10px] text-slate-500">History: <span className="text-white">Synced</span></span>
                         </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 font-sans relative z-10">
                    {/* Security Directives Column */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="bg-[#0f172a] rounded-[4.5rem] p-12 text-white shadow-3xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full group-hover:bg-indigo-600/10 transition-all duration-1000"></div>
                            <h3 className="text-[11px] font-black tracking-[0.4em] uppercase mb-12 text-slate-700 flex items-center justify-between leading-none">
                                RULES TO FOLLOW
                                <IconLock size={20} className="text-indigo-500" />
                            </h3>
                            
                            <div className="space-y-8 relative z-10 font-sans tracking-tight uppercase">
                                {[
                                    { title: "Parent's Permission", desc: "Talk to your parents before applying for leave." },
                                    { title: "Show Gate Pass", desc: "Show your approved pass to the security guard." },
                                    { title: "Time Limit", desc: "Make sure to come back to college on time." },
                                    { title: "Valid Reasons", desc: "Only apply for leave for important personal work." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3 border-l-2 border-indigo-500/20 pl-8 py-2 font-sans group/rule hover:border-indigo-500/80 transition-all">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white leading-none">{item.title}</h4>
                                        <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase tracking-widest opacity-60 group-hover/rule:opacity-100 transition-opacity uppercase">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#070b14] rounded-[4rem] border border-white/5 p-12 shadow-2xl flex flex-col items-center text-center space-y-10 group transition-all relative overflow-hidden hover:border-indigo-500/20">
                             <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/[0.02] transition-colors pointer-events-none"></div>
                            <div className="w-24 h-24 rounded-[2.8rem] bg-[#0f172a] text-amber-500 flex items-center justify-center border border-white/5 shadow-[0_20px_50px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-all duration-700 group-hover:rotate-12">
                                <IconScan size={44} stroke={1} className="animate-pulse" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white leading-none">Need Help?</h4>
                                <p className="text-[10px] font-black text-slate-800 tracking-widest leading-relaxed uppercase">Call the office if your request is taking too long to approve.</p>
                            </div>
                        </div>
                    </div>

                    {/* Operational Egress Form */}
                    <div className="lg:col-span-8 space-y-16">
                        <form onSubmit={handleSubmit} className="bg-[#0f172a] rounded-[5rem] border border-white/5 p-16 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-12 relative overflow-hidden flex flex-col uppercase tracking-widest font-sans group hover:border-white/10 transition-all">
                             <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none transition-all group-hover:bg-indigo-600/10"></div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                 <div className="space-y-4">
                                     <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-10">Type of Leave</label>
                                     <div className="relative group/select">
                                         <select 
                                            className="w-full bg-[#070b14] border border-white/5 rounded-[3rem] px-12 py-8 text-[11px] font-black text-white outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all appearance-none cursor-pointer uppercase tracking-widest shadow-2xl"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                         >
                                             <option value="Emergency" className="bg-[#0f172a]">Medical / Emergency</option>
                                             <option value="Personal" className="bg-[#0f172a]">Personal Work</option>
                                             <option value="Event" className="bg-[#0f172a]">College Event</option>
                                             <option value="Off-Day" className="bg-[#0f172a]">Going Home Early</option>
                                         </select>
                                         <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 group-focus-within/select:text-indigo-400 transition-colors">
                                             <IconChevronRight size={24} className="rotate-90 transition-transform duration-500" />
                                         </div>
                                     </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-8 font-sans">
                                     <div className="space-y-4">
                                         <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-10">Going Out Time</label>
                                         <input 
                                            required
                                            type="time"
                                            className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-8 text-[11px] font-black text-white outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-sans shadow-2xl custom-time-input whitespace-nowrap"
                                            value={formData.departureTime}
                                            onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                                         />
                                     </div>

                                     <div className="space-y-4">
                                         <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-10">Coming Back Time</label>
                                         <input 
                                            required
                                            type="time"
                                            className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-8 text-[11px] font-black text-white outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-sans shadow-2xl custom-time-input whitespace-nowrap"
                                            value={formData.returnTime}
                                            onChange={(e) => setFormData({...formData, returnTime: e.target.value})}
                                         />
                                     </div>
                                 </div>
                             </div>

                             <div className="space-y-4 relative z-10">
                                 <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-10">Explain Your Reason</label>
                                 <textarea 
                                    required
                                    rows={4}
                                    placeholder="WRITE YOUR REASON HERE..."
                                    className="w-full bg-[#070b14] border border-white/5 rounded-[4rem] px-12 py-10 text-[11px] font-black text-white outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all resize-none shadow-3xl placeholder:text-slate-900 uppercase tracking-[0.2em] leading-relaxed"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                 />
                             </div>

                             <div className="pt-8 border-t border-white/5 space-y-8 relative z-10 mt-auto">
                                 <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[4.5rem] shadow-[0_30px_70px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-6 uppercase text-[12px] tracking-[0.5em] active:scale-95 disabled:opacity-50 font-sans"
                                 >
                                    {loading ? <IconLoader2 className="animate-spin" size={28} /> : <IconWalk size={28} stroke={2} className="group-hover:translate-x-3 transition-transform duration-700" />}
                                    {loading ? "SENDING REQUEST..." : "SUBMIT LEAVE REQUEST"}
                                 </button>
                             </div>
                        </form>

                        {/* Application History List */}
                        <div className="space-y-8">
                             <div className="flex items-center justify-between px-10">
                                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-4">
                                      <IconHistory size={20} className="text-indigo-500" /> Application History
                                  </h3>
                                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest group cursor-pointer hover:text-indigo-400 transition-colors" onClick={fetchHistory}>
                                      Refresh Registry
                                  </span>
                             </div>

                             <div className="grid grid-cols-1 gap-6">
                                {history.length === 0 ? (
                                    <div className="bg-[#0f172a] rounded-[3rem] p-16 text-center border border-white/5 border-dashed">
                                         <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em]">No archive records found</p>
                                    </div>
                                ) : (
                                    history.map((item: any) => (
                                        <div key={item._id} className="bg-[#0f172a] rounded-[3rem] p-10 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:border-white/10 transition-all group/item shadow-xl drop-shadow-2xl">
                                             <div className="space-y-6 flex-1">
                                                 <div className="flex items-center gap-4">
                                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                          item.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                          item.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                                          'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                      }`}>
                                                          {item.status}
                                                      </span>
                                                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.type}</span>
                                                 </div>
                                                 <p className="text-sm font-black text-white tracking-tight leading-none truncate max-w-sm">{item.reason}</p>
                                                 <div className="flex items-center gap-6 text-slate-500">
                                                      <div className="flex items-center gap-2">
                                                           <IconClock size={12} />
                                                           <span className="text-[9px] font-black uppercase tracking-widest">{item.departureTime} - {item.returnTime || 'N/A'}</span>
                                                      </div>
                                                 </div>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xl ${
                                                     item.status === 'Approved' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' :
                                                     item.status === 'Rejected' ? 'bg-rose-500/5 text-rose-500 border-rose-500/10' :
                                                     'bg-amber-500/5 text-amber-500 border-amber-500/10'
                                                 }`}>
                                                     {item.status === 'Approved' ? <IconCheck size={24} stroke={3} /> : item.status === 'Rejected' ? <IconX size={24} stroke={3} /> : <IconActivity size={24} className="animate-pulse" />}
                                                 </div>
                                             </div>
                                        </div>
                                    ))
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
