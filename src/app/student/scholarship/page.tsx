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
            <main className="min-h-screen bg-[#07111d] flex items-center justify-center p-5 font-sans sm:p-7">
                <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c1a29] p-6 text-center shadow-2xl animate-in zoom-in-95 sm:p-10">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-300/[0.06] blur-3xl"></div>
                    <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/10 bg-emerald-300/10 text-emerald-100">
                        <IconCheck size={26} />
                    </div>
                    <div className="relative z-10 mt-5 space-y-2">
                        <h3 className="text-xl font-semibold text-white">Application submitted</h3>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Your scholarship request has been successfully sent to the college office for review.
                        </p>
                    </div>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="relative z-10 mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05] active:scale-[0.99]"
                    >
                        Back to scholarships
                    </button>
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
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100"><IconCertificate size={13} /> Financial assistance</span>
                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Scholarships</h1>
                        <p className="mt-2 text-sm text-slate-400">Apply for financial assistance and review eligibility details.</p>
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <span className="relative z-10 inline-flex min-h-11 items-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 font-sans">
                            Scholarship cycle
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 items-start gap-5 font-sans xl:grid-cols-[minmax(19rem,0.8fr)_minmax(0,1.6fr)]">
                    {/* Guidelines Column */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 text-white sm:p-6">
                            <h2 className="relative z-10 mb-4 text-base font-semibold text-white">
                                Eligibility criteria
                            </h2>
                            
                            <div className="relative z-10 space-y-3 font-sans">
                                 <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 space-y-3">
                                     <div className="flex items-center justify-between gap-3">
                                          <span className="text-sm text-slate-300">Minimum CGPA required</span>
                                          <span className="text-lg font-semibold text-cyan-100">8.0</span>
                                     </div>
                                     <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                         <div className="h-full w-[80%] rounded-full bg-cyan-200"></div>
                                     </div>
                                 </div>

                                 <div>
                                     <p className="text-sm leading-relaxed text-slate-400 font-sans">
                                         Scholarships depend on your college grades and family income certificates.
                                     </p>
                                 </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-100">
                                <IconHistory size={21} />
                            </div>
                            <div className="font-sans">
                                <h2 className="text-sm font-semibold text-white">Past applications</h2>
                                <p className="mt-1 text-xs leading-relaxed text-slate-400">Check the status of your previous scholarship forms.</p>
                            </div>
                            <button className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-100/20 hover:text-white font-sans">
                                View history
                            </button>
                        </section>
                    </div>

                    {/* Main Form Column */}
                    <form onSubmit={handleSubmit} className="relative space-y-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                         <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cyan-300/[0.04] blur-3xl"></div>
                         <div className="relative z-10 space-y-5">
                             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 font-sans">
                                 <div className="space-y-2">
                                     <label className="text-sm font-medium text-slate-300">Scholarship type</label>
                                     <select 
                                        className="w-full rounded-xl border border-white/10 bg-[#081522] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10 appearance-none cursor-pointer"
                                        value={formData.scholarshipType}
                                        onChange={(e) => setFormData({...formData, scholarshipType: e.target.value})}
                                     >
                                         <option value="Merit-based">Merit Scholarship (Grades Based)</option>
                                         <option value="State Welfare">State Welfare Scholarship</option>
                                         <option value="Minority Fund">Minority scholarship</option>
                                         <option value="Special Interest">Income Based Scholarship</option>
                                     </select>
                                 </div>

                                 <div className="space-y-2">
                                     <label className="text-sm font-medium text-slate-300">Annual family income</label>
                                     <input 
                                        required
                                        type="text"
                                        placeholder="Example: 150000"
                                        className="w-full rounded-xl border border-white/10 bg-[#081522] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10"
                                        value={formData.income}
                                        onChange={(e) => setFormData({...formData, income: e.target.value})}
                                     />
                                 </div>
                             </div>

                             <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-white font-sans">
                                 <div className="relative z-10 flex items-center gap-3">
                                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                                         <IconFileUpload size={19} />
                                     </div>
                                     <div className="space-y-1 font-sans">
                                         <h2 className="text-sm font-semibold">Required documents</h2>
                                         <p className="text-xs text-slate-400">Income and identity certificates are linked.</p>
                                     </div>
                                 </div>
                                 
                                 <div className="relative z-10 mt-4 flex flex-wrap gap-2 text-xs font-medium">
                                     <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/10 bg-emerald-300/[0.06] px-3 py-2 text-emerald-100">
                                         <IconCheck size={15} /> Documents linked
                                     </div>
                                     <button type="button" className="rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-slate-300 transition hover:text-white font-sans">Edit docs</button>
                                 </div>
                             </div>
                         </div>

                         <div className="relative z-10 space-y-3 border-t border-white/[0.07] pt-5 font-sans">
                             <button 
                                type="submit"
                                disabled={loading}
                                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                             >
                                {loading ? <IconLoader2 className="animate-spin text-white" size={28} /> : <IconCertificate size={28} stroke={1.5} />}
                                {loading ? "Submitting…" : "Submit scholarship application"}
                             </button>
                             <p className="text-center text-xs leading-relaxed text-slate-400">Please check all details before submitting your application.</p>
                         </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
