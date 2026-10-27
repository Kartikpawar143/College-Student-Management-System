"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconBriefcase, IconBuilding, IconCurrencyDollar, IconCalendarTime, 
    IconSearch, IconLoader2,
    IconCheck, IconUpload, IconFileDescription, IconX, IconSend
} from "@tabler/icons-react";

export default function StudentPlacementsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyingJob, setApplyingJob] = useState<any | null>(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [selectedResume, setSelectedResume] = useState<File | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

    const fetchJobs = async () => {
        try {
            const res = await api.get(endpoints.placements.getAll);
            setJobs(res.data);
            
            // Fetch applications to see what's already applied
            const appRes = await api.get(endpoints.placements.getApplications);
            const userApps = appRes.data.filter((a: any) => a.studentId === user?.id).map((a: any) => a.jobId);
            setAppliedJobs(userApps);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedResume(e.target.files[0]);
        }
    };

    const submitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !applyingJob || !selectedResume) return;
        
        setUploadingResume(true);
        try {
            // 1. Upload Resume
            const formData = new FormData();
            formData.append("file", selectedResume);
            const uploadRes = await api.post(endpoints.placements.uploadResume, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const resumeUrl = uploadRes.data.url;

            // 2. Submit Application
            await api.post("/placements/apply", {
                studentId: user.id,
                studentName: user.name,
                rollNo: user.rollNo,
                jobId: applyingJob._id || applyingJob.id,
                company: applyingJob.company,
                role: applyingJob.role,
                resumeUrl: resumeUrl
            });

            setAppliedJobs(prev => [...prev, applyingJob._id || applyingJob.id]);
            setApplyingJob(null);
            setSelectedResume(null);
            alert("Application sent successfully with your resume!");
        } catch (err) {
            console.error("Application failed", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setUploadingResume(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6 relative text-left">
                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative z-10">
                         <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                              <IconBriefcase size={13} />
                              <span>Career opportunities</span>
                         </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Job openings</h1>
                        <p className="mt-2 text-sm text-slate-400">Explore opportunities and apply with your resume.</p>
                    </div>
                </header>

                <section aria-label="Job openings" className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0c1a29] px-5 py-14 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                                <IconLoader2 size={22} className="animate-spin text-cyan-100" stroke={1.5} />
                            </div>
                            <p className="text-sm text-slate-400">Loading job openings…</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => {
                            const isApplied = appliedJobs.includes(job._id || job.id);
                            return (
                                <article key={job._id || job.id} className="group relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20 hover:bg-[#102033] sm:flex-row sm:items-center sm:p-6">
                                    <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-300/[0.04] blur-3xl"></div>
                                    <div className="relative z-10 flex min-w-0 items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-cyan-300/10 text-cyan-100">
                                            <IconBuilding size={21} />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="text-base font-semibold text-white transition-colors group-hover:text-cyan-100">{job.company}</h2>
                                            <p className="mt-1 text-sm text-slate-400">{job.role}</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-xs text-slate-300">
                                                    <IconCurrencyDollar size={15} className="text-emerald-200" /> {job.salary || job.package || "Salary not listed"}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-xs text-slate-300">
                                                    <IconCalendarTime size={15} className="text-cyan-100" /> Deadline: {job.deadline || "Not listed"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                     <button 
                                         disabled={isApplied}
                                         onClick={() => setApplyingJob(job)}
                                         className={`relative z-10 inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 active:scale-95 sm:w-auto ${
                                             isApplied 
                                             ? "cursor-default border border-emerald-200/15 bg-emerald-300/10 text-emerald-100"
                                             : "bg-cyan-200 text-[#07111d] hover:bg-cyan-100"
                                         }`}
                                     >
                                         {isApplied ? (
                                             <span className="flex items-center gap-2"><IconCheck size={17} /> Applied</span>
                                         ) : (
                                             <span className="flex items-center gap-2">Apply with resume <IconUpload size={17} /></span>
                                         )}
                                     </button>
                                </article>
                            );
                        } )
                    ) : (
                        <div className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-[#0c1a29] px-5 py-14 text-center">
                            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400"><IconBriefcase size={22} /></span>
                            <p className="text-sm font-semibold text-slate-200">No jobs available</p>
                            <p className="mt-1 text-xs text-slate-500">New opportunities will appear here when they are posted.</p>
                        </div>
                    )}
                </section>

                {/* Apply Modal */}
                {applyingJob && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#07111d]/90 p-4 backdrop-blur-xl animate-in fade-in duration-300 font-sans sm:p-6">
                        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 shadow-2xl animate-in zoom-in-95 duration-300 sm:p-6">
                             <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cyan-300/[0.06] blur-3xl"></div>
                             
                            <div className="relative z-10 mb-5 flex items-center justify-between gap-3 text-left">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                                        <IconFileDescription size={19} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Job application</h3>
                                        <p className="mt-1 truncate text-xs text-slate-400">{applyingJob.company} · {applyingJob.role}</p>
                                    </div>
                                </div>
                                <button aria-label="Close application form" onClick={() => setApplyingJob(null)} className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-2 text-slate-400 transition hover:text-white">
                                    <IconX size={18} />
                                </button>
                            </div>

                            <form onSubmit={submitApplication} className="relative z-10 space-y-5 text-left">
                                <div className="space-y-2">
                                    <label htmlFor="resume-upload" className="text-sm font-medium text-slate-200">Upload your resume (PDF)</label>
                                    <div className="relative group/file">
                                        <input 
                                            type="file" 
                                            accept=".pdf" 
                                            required
                                            onChange={handleFileUpload}
                                            className="hidden" 
                                            id="resume-upload" 
                                        />
                                        <label 
                                            htmlFor="resume-upload"
                                            className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.025] py-9 transition hover:border-cyan-100/25 hover:bg-cyan-100/[0.03]"
                                        >
                                            {selectedResume ? (
                                                <div className="flex items-center gap-3 text-cyan-100">
                                                    <IconFileDescription size={25} />
                                                    <div className="max-w-[15rem] text-left">
                                                        <p className="truncate text-sm font-medium">{selectedResume.name}</p>
                                                        <p className="mt-1 text-xs text-slate-400">Document ready</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
                                                        <IconUpload size={20} />
                                                    </div>
                                                    <p className="text-sm text-slate-300">Choose a resume PDF</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={uploadingResume} className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50">
                                    {uploadingResume ? (
                                        <><IconLoader2 size={18} className="animate-spin" /> Uploading and submitting…</>
                                    ) : (
                                        <><IconSend size={18} /> Submit application</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
