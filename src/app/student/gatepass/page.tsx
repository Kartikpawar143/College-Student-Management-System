"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconClock, IconCheck,
    IconLoader2, IconX,
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
            <main className="min-h-screen bg-[#07111d] flex items-center justify-center p-5 font-sans text-slate-200 sm:p-7">
                <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c1a29] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-300 sm:p-10">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cyan-300/[0.06] blur-3xl"></div>
                    
                    <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/10 bg-emerald-300/10 text-emerald-100">
                        <IconShieldCheck size={26} />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                        <h3 className="text-xl font-semibold text-white">Request sent successfully</h3>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Your leave request has been sent to the teacher. Please wait for approval.
                        </p>
                    </div>

                    <div className="relative z-10 pt-6">
                         <button onClick={() => setSubmitted(false)} className="rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 active:scale-95">
                              Back to leave requests
                         </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6 relative font-sans">
                
                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative z-10">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                            <IconSparkles size={13} /> Leave management
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Short leave</h1>
                        <p className="mt-2 text-sm text-slate-400">Submit a request and check the status of your applications.</p>
                    </div>
                    
                    <button type="button" onClick={fetchHistory} className="relative z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-100/20 hover:bg-white/[0.07]">
                        <IconHistory size={17} className={fetchingHistory ? "animate-spin text-cyan-100" : "text-cyan-100"} /> Refresh history
                    </button>
                </header>

                <div className="relative z-10 grid grid-cols-1 items-start gap-5 font-sans xl:grid-cols-[minmax(19rem,0.8fr)_minmax(0,1.6fr)]">
                    {/* Security Directives Column */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 text-white sm:p-6 relative overflow-hidden group">
                            <h2 className="mb-4 flex items-center justify-between text-base font-semibold text-white">
                                Before you apply
                                <IconLock size={18} className="text-cyan-100" />
                            </h2>
                            
                            <div className="space-y-3 relative z-10 font-sans">
                                {[
                                    { title: "Parent's Permission", desc: "Talk to your parents before applying for leave." },
                                    { title: "Show Gate Pass", desc: "Show your approved pass to the security guard." },
                                    { title: "Time Limit", desc: "Make sure to come back to college on time." },
                                    { title: "Valid Reasons", desc: "Only apply for leave for important personal work." }
                                ].map((item, i) => (
                                    <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                                        <h3 className="text-sm font-medium text-slate-200">{item.title}</h3>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 text-center sm:p-6">
                            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300/10 text-amber-100">
                                <IconScan size={21} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white">Need help?</h2>
                                <p className="mt-1 text-xs leading-relaxed text-slate-400">Contact the office if your request is taking a long time to approve.</p>
                            </div>
                        </section>
                    </div>

                    {/* Operational Egress Form */}
                    <div className="space-y-5">
                        <form onSubmit={handleSubmit} className="relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6 font-sans">
                             <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cyan-300/[0.04] blur-3xl"></div>
                             
                             <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                 <div className="space-y-2">
                                     <label className="text-sm font-medium text-slate-300">Type of leave</label>
                                     <div className="relative group/select">
                                         <select 
                                            className="w-full rounded-xl border border-white/10 bg-[#081522] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10 appearance-none cursor-pointer"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                         >
                                             <option value="Emergency" className="bg-[#0f172a]">Medical / Emergency</option>
                                             <option value="Personal" className="bg-[#0f172a]">Personal Work</option>
                                             <option value="Event" className="bg-[#0f172a]">College Event</option>
                                             <option value="Off-Day" className="bg-[#0f172a]">Going Home Early</option>
                                         </select>
                                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                             <IconChevronRight size={16} className="rotate-90" />
                                         </div>
                                     </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-3 font-sans">
                                     <div className="space-y-2">
                                         <label className="text-sm font-medium text-slate-300">Departure time</label>
                                         <input 
                                            required
                                            type="time"
                                            className="w-full rounded-xl border border-white/10 bg-[#081522] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10 custom-time-input"
                                            value={formData.departureTime}
                                            onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                                         />
                                     </div>

                                     <div className="space-y-2">
                                         <label className="text-sm font-medium text-slate-300">Return time</label>
                                         <input 
                                            required
                                            type="time"
                                            className="w-full rounded-xl border border-white/10 bg-[#081522] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10 custom-time-input"
                                            value={formData.returnTime}
                                            onChange={(e) => setFormData({...formData, returnTime: e.target.value})}
                                         />
                                     </div>
                                 </div>
                             </div>

                             <div className="relative z-10 space-y-2">
                                 <label className="text-sm font-medium text-slate-300">Reason for leave</label>
                                 <textarea 
                                    required
                                    rows={4}
                                    placeholder="Briefly explain why you need to leave"
                                    className="w-full rounded-xl border border-white/10 bg-[#081522] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10 resize-y"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                 />
                             </div>

                             <div className="relative z-10 border-t border-white/[0.07] pt-4">
                                 <button 
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 font-sans"
                                 >
                                    {loading ? <IconLoader2 className="animate-spin" size={28} /> : <IconWalk size={28} stroke={2} className="group-hover:translate-x-3 transition-transform duration-700" />}
                                    {loading ? "Sending request…" : "Submit leave request"}
                                 </button>
                             </div>
                        </form>

                        {/* Application History List */}
                        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
                             <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] px-5 py-4">
                                  <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                                      <IconHistory size={17} className="text-cyan-100" /> Application history
                                  </h2>
                                  <button type="button" className="text-xs font-medium text-cyan-100 hover:text-white" onClick={fetchHistory} disabled={fetchingHistory}>
                                      {fetchingHistory ? "Refreshing…" : "Refresh"}
                                  </button>
                             </div>

                             <div className="divide-y divide-white/[0.06]">
                                {history.length === 0 ? (
                                    <div className="p-8 text-center">
                                         <p className="text-sm text-slate-400">No leave requests yet.</p>
                                    </div>
                                ) : (
                                    history.map((item: any) => (
                                        <article key={item._id} className="flex flex-col justify-between gap-4 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:px-6">
                                             <div className="min-w-0 flex-1">
                                                 <div className="mb-2 flex flex-wrap items-center gap-2">
                                                      <span className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                                                          item.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                          item.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                                          'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                      }`}>
                                                          {item.status}
                                                      </span>
                                                      <span className="text-xs text-slate-400">{item.type}</span>
                                                 </div>
                                                 <p className="break-words text-sm font-medium text-slate-200">{item.reason}</p>
                                                 <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                                      <div className="flex items-center gap-1.5">
                                                           <IconClock size={14} />
                                                           <span>{item.departureTime} – {item.returnTime || 'N/A'}</span>
                                                      </div>
                                                 </div>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                 <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                                                     item.status === 'Approved' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' :
                                                     item.status === 'Rejected' ? 'bg-rose-500/5 text-rose-500 border-rose-500/10' :
                                                     'bg-amber-500/5 text-amber-500 border-amber-500/10'
                                                 }`}>
                                                     {item.status === 'Approved' ? <IconCheck size={18} /> : item.status === 'Rejected' ? <IconX size={18} /> : <IconActivity size={18} className="animate-pulse" />}
                                                 </div>
                                             </div>
                                        </article>
                                    ))
                                )}
                             </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
