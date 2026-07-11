"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconFileCheck, IconBook, IconCurrencyDollar, IconCheck,
    IconLoader2, IconAlertCircle, IconArrowRight, IconSchool
} from "@tabler/icons-react";

export default function StudentExamFormPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [formData, setFormData] = useState({
        semester: user?.semester || 1,
        branch: user?.department || "N/A",
        subjects: [] as string[],
        feePaid: false
    });

    const subjectsList = [
        "Data Structures & Algorithms",
        "Operating Systems",
        "Database Management Systems",
        "Computer Networks",
        "Software Engineering",
        "Professional Ethics"
    ];

    const toggleSubject = (sub: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(sub) 
                ? prev.subjects.filter(s => s !== sub)
                : [...prev.subjects, sub]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        const payload = {
            studentId: user.id,
            studentName: user.name,
            rollNo: user.rollNo || "N/A",
            semester: formData.semester,
            branch: formData.branch,
            subjects: formData.subjects,
            feePaid: formData.feePaid
        };

        try {
            await api.post("/exam-forms/submit", payload);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission failed", err);
            alert("Failed to submit exam form.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#070b14] flex items-center justify-center p-8 lg:p-10 font-sans">
                <div className="bg-[#0f172a] p-16 rounded-[5rem] text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-emerald-500/20 animate-in zoom-in-95 duration-700 max-w-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full"></div>
                    
                    <div className="w-28 h-28 bg-emerald-500/10 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl mb-12 group-hover:scale-110 transition-transform duration-700">
                        <IconCheck size={56} stroke={3} />
                    </div>
                    
                    <div className="space-y-6">
                        <h3 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Form Submitted Successfully</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed px-8">
                            Your exam form has been sent to the University for approval. You can check the status later.
                        </p>
                    </div>

                    <div className="pt-12">
                         <button onClick={() => window.location.reload()} className="px-12 py-5 bg-[#070b14] text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border border-white/5 hover:text-white hover:border-white/10 transition-all active:scale-95">
                             Return to Hub
                         </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
                             <IconFileCheck size={12} className="text-rose-400" />
                             <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest leading-none">Critical Deadline</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Exam Registration</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">Fill your exam form for this semester below.</p>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <span className="px-8 py-4 bg-[#0f172a] text-rose-500 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] border border-rose-500/20 shadow-2xl">
                            Deadline: 15 April 2024
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Profile Card Section */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-[#0f172a] rounded-[3.5rem] p-12 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full group-hover:bg-indigo-600/10 transition-all duration-700"></div>
                            <h3 className="text-[11px] font-black tracking-[0.3em] uppercase mb-12 text-slate-700 flex items-center justify-between">
                                STUDENT DETAILS
                                <IconSchool size={18} />
                            </h3>
                            
                            <div className="space-y-4 relative z-10">
                                {[
                                    { label: "Full Name", val: user?.name, color: "text-white" },
                                    { label: "Roll Number", val: user?.rollNo, color: "text-indigo-400" },
                                    { label: "Branch", val: user?.department, color: "text-indigo-400" },
                                    { label: "Semester", val: `SEM ${user?.semester || 1}`, color: "text-indigo-400" }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-5 border-b border-white/5 last:border-0 hover:bg-white/5 px-4 rounded-2xl transition-all duration-300">
                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{item.label}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#070b14]/50 rounded-[3rem] p-10 border border-amber-500/10 space-y-6 relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/20"></div>
                            <div className="flex items-center gap-4 text-amber-500">
                                <IconAlertCircle size={28} />
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Important Note</h4>
                            </div>
                            <p className="text-[10px] font-black text-slate-700 leading-relaxed uppercase tracking-widest">
                                Please check all details carefully before submitting. You cannot change them later once submitted.
                            </p>
                        </div>
                    </div>

                    {/* Main Form Section */}
                    <form onSubmit={handleSubmit} className="lg:col-span-8 bg-[#0f172a] rounded-[4rem] border border-white/5 p-12 shadow-2xl space-y-16 relative overflow-hidden mt-auto">
                         <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
                         
                         <div className="space-y-12 relative z-10">
                             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-700 flex items-center gap-4">
                                 <IconSchool size={20} className="text-indigo-500" /> ACADEMIC DETAILS
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Current Semester</label>
                                     <div className="relative group/select">
                                         <select 
                                             required
                                             className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-12 py-7 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                                             value={formData.semester}
                                             onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                                         >
                                             {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>SEMESTER {s}</option>)}
                                         </select>
                                         <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 group-hover/select:text-indigo-400 transition-colors">
                                             <IconArrowRight className="rotate-90" size={18} />
                                         </div>
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Academic Year</label>
                                     <div className="relative group/select">
                                         <select 
                                             required
                                             className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-12 py-7 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                                         >
                                             <option value="2024-25">2024-2025</option>
                                             <option value="2025-26">2025-2026</option>
                                         </select>
                                         <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 group-hover/select:text-indigo-400 transition-colors">
                                             <IconArrowRight className="rotate-90" size={18} />
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-700 flex items-center gap-4">
                                 <IconBook size={20} className="text-indigo-500" /> SELECT YOUR SUBJECTS
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {subjectsList.map((sub, i) => (
                                     <div 
                                        key={i} 
                                        onClick={() => toggleSubject(sub)}
                                        className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex justify-between items-center group relative overflow-hidden ${
                                            formData.subjects.includes(sub) 
                                            ? "bg-indigo-600/10 border-indigo-600 text-white shadow-2xl shadow-indigo-600/20" 
                                            : "bg-[#070b14]/40 border-white/5 text-slate-700 hover:border-indigo-500/30 hover:bg-[#070b14]/80"
                                        }`}
                                     >
                                         <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${formData.subjects.includes(sub) ? 'text-indigo-400' : 'text-slate-700'} group-hover:text-indigo-400`}>{sub}</span>
                                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                             formData.subjects.includes(sub) ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "border-slate-800 group-hover:border-indigo-400"
                                         }`}>
                                             {formData.subjects.includes(sub) && <IconCheck size={14} stroke={3} />}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         <div className="pt-12 border-t border-white/5 space-y-12 relative z-10">
                             <div className="p-10 bg-[#070b14]/60 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-indigo-600 transition-all border border-white/5 shadow-2xl"
                                  onClick={() => setFormData({...formData, feePaid: !formData.feePaid})}>
                                 <div className="flex items-center gap-8">
                                     <div className={`w-16 h-16 ${formData.feePaid ? 'bg-white text-indigo-600' : 'bg-indigo-600/10 text-indigo-500'} rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500`}>
                                         <IconCurrencyDollar size={32} stroke={2} />
                                     </div>
                                     <div>
                                         <p className={`text-lg font-black tracking-tighter leading-none uppercase transition-colors ${formData.feePaid ? 'text-white' : 'text-slate-400'}`}>Exam Fee (₹2,500)</p>
                                         <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-3 ${formData.feePaid ? 'text-indigo-200' : 'text-slate-700'}`}>Status: {formData.feePaid ? "PAID" : "PENDING"}</p>
                                     </div>
                                 </div>
                                 <div className={`w-10 h-10 rounded-full border-4 transition-all duration-500 ${formData.feePaid ? "bg-white border-white scale-110" : "border-slate-800 group-hover:border-white shadow-xl"}`}>
                                      {formData.feePaid && <IconCheck size={24} className="text-indigo-600 mx-auto mt-0.5" stroke={4} />}
                                 </div>
                             </div>

                             <button 
                                type="submit"
                                disabled={loading || formData.subjects.length === 0}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[4rem] shadow-[0_25px_60px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.5em] active:scale-95 disabled:opacity-50"
                             >
                                {loading ? <IconLoader2 className="animate-spin" size={24} /> : <IconFileCheck size={24} stroke={2} />}
                                {loading ? "SUBMITTING..." : "SUBMIT EXAM FORM"}
                             </button>
                         </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
