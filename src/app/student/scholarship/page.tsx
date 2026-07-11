"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconCertificate, IconCurrencyDollar, IconDownload, IconCheck,
    IconLoader2, IconFileUpload, IconHistory, IconArrowRight
} from "@tabler/icons-react";

export default function StudentScholarshipPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [formData, setFormData] = useState({
        scholarshipType: "Merit-based",
        income: "",
        docsLink: "https://documents-vault.storage/student-docs" // Placeholder link
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const payload = {
            studentId: user.id,
            studentName: user.name,
            rollNo: user.rollNo || "N/A",
            scholarshipType: formData.scholarshipType,
            income: formData.income,
            documentsLink: formData.docsLink,
            status: "Pending"
        };

        try {
            await api.post("/scholarships/apply", payload);
            setSubmitted(true);
        } catch (err) {
            console.error("Scholarship application failed", err);
            alert("Failed to apply.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#070b14] flex items-center justify-center p-8 font-sans">
                <div className="bg-[#0f172a] p-20 rounded-[4rem] text-center shadow-[0_40px_100px_rgba(0,0,0,0.6)] space-y-10 animate-in zoom-in-95 max-w-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10"></div>
                    <div className="w-28 h-28 bg-[#070b14] text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600">
                        <IconCheck size={56} stroke={2} />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Application Submitted</h3>
                        <p className="text-[11px] font-black text-slate-700 tracking-[0.3em] uppercase leading-relaxed px-12">
                            Your scholarship request has been successfully sent to the college office for review.
                        </p>
                    </div>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="px-12 py-5 bg-[#070b14] text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] border border-white/5 hover:bg-white/5 hover:text-white transition-all shadow-2xl active:scale-95 relative z-10"
                    >
                        GO BACK
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Scholarship Hub</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none uppercase tracking-widest">Apply for scholarships and view your grant status.</p>
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <span className="px-8 py-4 bg-[#0f172a] text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border border-white/5 font-sans shadow-2xl">
                            CYCLE 2024-V
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans tracking-tight">
                    {/* Guidelines Column */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-[#0f172a] rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/5 opacity-50"></div>
                            <h3 className="text-[11px] font-black tracking-[0.5em] uppercase mb-12 text-slate-700 relative z-10 font-sans">
                                ELIGIBILITY CRITERIA
                            </h3>
                            
                            <div className="space-y-12 relative z-10 font-sans uppercase">
                                 <div className="p-10 bg-[#070b14]/50 border border-white/5 rounded-[2.5rem] space-y-6 shadow-inner group-hover:border-indigo-500/20 transition-all duration-700">
                                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
                                          <span className="text-slate-700 group-hover:text-indigo-500 transition-colors">Minimum CGPA Required</span>
                                          <span className="text-3xl font-black text-white group-hover:text-indigo-400 transition-all">8.0</span>
                                     </div>
                                     <div className="h-2 bg-[#070b14] rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
                                         <div className="h-full bg-indigo-500 w-[80%] rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:w-[85%] transition-all duration-1000"></div>
                                     </div>
                                 </div>

                                 <div className="space-y-4 px-4">
                                     <p className="text-[10px] font-black text-slate-900 leading-relaxed uppercase tracking-[0.3em] font-sans">
                                         Scholarships depend on your college grades and family income certificates.
                                     </p>
                                 </div>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] rounded-[4rem] border border-white/5 p-12 shadow-2xl flex flex-col items-center text-center space-y-10 group transition-all duration-700 hover:bg-white/5 cursor-default relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-600/5 blur-2xl"></div>
                            <div className="w-24 h-24 rounded-[3rem] bg-[#070b14] text-emerald-500 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)]">
                                <IconHistory size={48} stroke={1.5} />
                            </div>
                            <div className="space-y-4 px-4 uppercase font-sans">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 group-hover:text-white transition-colors leading-none">PAST APPLICATIONS</h4>
                                <p className="text-[10px] text-slate-900 font-black leading-relaxed tracking-widest uppercase">Check the status of your previous scholarship forms.</p>
                            </div>
                            <button className="w-full py-6 bg-[#070b14] text-slate-800 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] border border-white/5 hover:bg-white/5 hover:text-white transition-all shadow-2xl active:scale-95 font-sans">
                                VIEW HISTORY
                            </button>
                        </div>
                    </div>

                    {/* Main Form Column */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 bg-[#0f172a] rounded-[5rem] border border-white/5 p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] space-y-16 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                         <div className="space-y-12 relative z-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
                                 <div className="space-y-4">
                                     <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] ml-8 flex items-center gap-3">
                                         <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Select Scholarship Type
                                     </label>
                                     <select 
                                        className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-12 py-7 text-[11px] font-black text-white hover:text-indigo-400 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer uppercase tracking-[0.2em] shadow-inner"
                                        value={formData.scholarshipType}
                                        onChange={(e) => setFormData({...formData, scholarshipType: e.target.value})}
                                     >
                                         <option value="Merit-based">Merit Scholarship (Grades Based)</option>
                                         <option value="State Welfare">State Welfare Scholarship</option>
                                         <option value="Minority Fund">Minority scholarship</option>
                                         <option value="Special Interest">Income Based Scholarship</option>
                                     </select>
                                 </div>

                                 <div className="space-y-4">
                                     <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] ml-8 flex items-center gap-3">
                                         <span className="w-2 h-2 bg-rose-500 rounded-full"></span> Annual Family Income
                                     </label>
                                     <input 
                                        required
                                        type="text"
                                        placeholder="EX: 1,50,000"
                                        className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-12 py-7 text-[11px] font-black text-white outline-none focus:ring-4 focus:ring-rose-500/10 transition-all uppercase tracking-[0.2em] shadow-inner placeholder:text-slate-900"
                                        value={formData.income}
                                        onChange={(e) => setFormData({...formData, income: e.target.value})}
                                     />
                                 </div>
                             </div>

                             <div className="p-12 bg-[#070b14]/80 rounded-[4rem] text-white space-y-12 relative overflow-hidden font-sans border border-white/5 group/docs shadow-2xl">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl"></div>
                                 <div className="flex items-center gap-8 relative z-10">
                                     <div className="w-20 h-20 bg-[#0f172a] text-indigo-500 rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/5 transition-all duration-700 group-hover/docs:scale-110 group-hover/docs:rotate-12 group-hover/docs:bg-indigo-600 group-hover/docs:text-white group-hover/docs:border-indigo-600 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                                         <IconFileUpload size={40} stroke={1.5} />
                                     </div>
                                     <div className="space-y-2 uppercase font-sans">
                                         <h4 className="text-2xl font-black tracking-tighter uppercase leading-none">Required Documents</h4>
                                         <p className="text-[10px] font-black text-slate-700 tracking-[0.4em] leading-none uppercase">Please upload your income and ID certificates</p>
                                     </div>
                                 </div>
                                 
                                 <div className="flex gap-6 relative z-10 font-black uppercase tracking-[0.4em] text-[10px]">
                                     <div className="px-8 py-4 bg-[#0f172a] border border-emerald-500/20 rounded-2xl text-emerald-500 flex items-center gap-4 shadow-2xl">
                                         <IconCheck size={18} stroke={3} /> Documents Linked
                                     </div>
                                     <button type="button" className="px-8 py-4 bg-[#0f172a] text-slate-500 rounded-2xl hover:bg-white/5 hover:text-white transition-all uppercase tracking-[0.4em] border border-white/5 font-sans">EDIT Docs</button>
                                 </div>
                             </div>
                         </div>

                         <div className="pt-12 border-t border-white/5 space-y-10 uppercase font-black tracking-tight relative z-10 font-sans">
                             <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-10 rounded-[3rem] shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-6 uppercase text-[12px] tracking-[0.6em] active:scale-95 disabled:opacity-50 group-hover:shadow-indigo-500/40"
                             >
                                {loading ? <IconLoader2 className="animate-spin text-white" size={28} /> : <IconCertificate size={28} stroke={1.5} />}
                                {loading ? "SUBMITTING..." : "SUBMIT FORM"}
                             </button>
                             <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] text-center leading-relaxed px-20">Please check all details before submitting your form.</p>
                         </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
