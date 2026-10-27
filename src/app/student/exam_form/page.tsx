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
            <main className="min-h-screen bg-[#07111d] flex items-center justify-center p-5 font-sans sm:p-7">
                <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c1a29] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-300 sm:p-10">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-300/[0.06] blur-3xl"></div>
                    
                    <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/10 bg-emerald-300/10 text-emerald-100">
                        <IconCheck size={26} />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                        <h3 className="text-xl font-semibold text-white">Exam form submitted</h3>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Your exam form has been sent to the University for approval. You can check the status later.
                        </p>
                    </div>

                    <div className="relative z-10 pt-6">
                         <button onClick={() => window.location.reload()} className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05] active:scale-[0.99]">
                             Return to exam registration
                         </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative z-10">
                         <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                             <IconFileCheck size={13} /> Exam registration
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Exam registration</h1>
                        <p className="mt-2 text-sm text-slate-400">Complete your exam form for the current semester.</p>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <span className="relative z-10 inline-flex min-h-11 items-center rounded-xl border border-amber-200/15 bg-amber-300/[0.06] px-4 py-2.5 text-sm font-medium text-amber-100">
                            Deadline: 15 April 2024
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(0,1.6fr)]">
                    {/* Profile Card Section */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 text-white sm:p-6">
                            <h2 className="mb-4 flex items-center justify-between text-base font-semibold text-white">
                                Student details
                                <IconSchool size={18} className="text-cyan-100" />
                            </h2>
                            
                            <div className="relative z-10 divide-y divide-white/[0.06]">
                                {[
                                    { label: "Full Name", val: user?.name, color: "text-white" },
                                    { label: "Roll Number", val: user?.rollNo, color: "text-indigo-400" },
                                    { label: "Branch", val: user?.department, color: "text-indigo-400" },
                                    { label: "Semester", val: `SEM ${user?.semester || 1}`, color: "text-indigo-400" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 py-3">
                                        <span className="text-xs text-slate-400">{item.label}</span>
                                        <span className={`text-right text-sm font-medium ${item.color === "text-white" ? "text-white" : "text-cyan-100"}`}>{item.val || "—"}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-amber-200/10 bg-amber-300/[0.04] p-5 sm:p-6">
                            <div className="mb-2 flex items-center gap-2 text-amber-100">
                                <IconAlertCircle size={18} />
                                <h2 className="text-sm font-semibold">Before you submit</h2>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Please check all details carefully before submitting. You cannot change them later once submitted.
                            </p>
                        </section>
                    </div>

                    {/* Main Form Section */}
                    <form onSubmit={handleSubmit} className="relative mt-auto space-y-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                         <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-300/[0.04] blur-3xl"></div>
                         
                         <div className="relative z-10 space-y-5">
                             <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                                 <IconSchool size={18} className="text-cyan-100" /> Academic details
                             </h2>
                             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                 <div className="space-y-2">
                                     <label className="text-sm font-medium text-slate-300">Current semester</label>
                                     <div className="relative group/select">
                                         <select 
                                             required
                                             className="w-full rounded-xl border border-white/10 bg-[#081522] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10 appearance-none cursor-pointer"
                                             value={formData.semester}
                                             onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                                         >
                                             {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>SEMESTER {s}</option>)}
                                         </select>
                                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                             <IconArrowRight className="rotate-90" size={16} />
                                         </div>
                                     </div>
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-sm font-medium text-slate-300">Academic year</label>
                                     <div className="relative group/select">
                                         <select 
                                             required
                                             className="w-full rounded-xl border border-white/10 bg-[#081522] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10 appearance-none cursor-pointer"
                                         >
                                             <option value="2024-25">2024-2025</option>
                                             <option value="2025-26">2025-2026</option>
                                         </select>
                                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                             <IconArrowRight className="rotate-90" size={16} />
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                                 <IconBook size={18} className="text-cyan-100" /> Select subjects
                             </h2>
                             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                 {subjectsList.map((sub, i) => (
                                     <div 
                                        key={i} 
                                        onClick={() => toggleSubject(sub)}
                                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition ${
                                            formData.subjects.includes(sub) 
                                            ? "border-cyan-100/20 bg-cyan-100/[0.06] text-white"
                                            : "border-white/[0.06] bg-white/[0.025] text-slate-300 hover:border-cyan-100/20"
                                        }`}
                                     >
                                         <span className="text-sm font-medium">{sub}</span>
                                         <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                             formData.subjects.includes(sub) ? "border-cyan-200 bg-cyan-200 text-[#07111d]" : "border-white/20 text-transparent"
                                         }`}>
                                             {formData.subjects.includes(sub) && <IconCheck size={14} stroke={3} />}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         <div className="relative z-10 space-y-4 border-t border-white/[0.07] pt-5">
                             <div className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-cyan-100/20"
                                  onClick={() => setFormData({...formData, feePaid: !formData.feePaid})}>
                                 <div className="flex items-center gap-3">
                                     <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${formData.feePaid ? 'bg-emerald-300/10 text-emerald-100' : 'bg-cyan-300/10 text-cyan-100'}`}>
                                         <IconCurrencyDollar size={20} />
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium text-slate-200">Exam fee (₹2,500)</p>
                                         <p className={`mt-1 text-xs ${formData.feePaid ? 'text-emerald-200' : 'text-slate-400'}`}>Status: {formData.feePaid ? "Paid" : "Pending"}</p>
                                     </div>
                                 </div>
                                 <div className={`flex h-6 w-6 items-center justify-center rounded-md border ${formData.feePaid ? "border-emerald-200 bg-emerald-200 text-[#07111d]" : "border-white/20 text-transparent"}`}>
                                      {formData.feePaid && <IconCheck size={15} />}
                                 </div>
                             </div>

                             <button 
                                type="submit"
                                disabled={loading || formData.subjects.length === 0}
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                             >
                                {loading ? <IconLoader2 className="animate-spin" size={24} /> : <IconFileCheck size={24} stroke={2} />}
                                {loading ? "Submitting…" : "Submit exam form"}
                             </button>
                         </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
