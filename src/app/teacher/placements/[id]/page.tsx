"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, endpoints, API_URL } from "@/lib/api";
import { 
    IconBuilding, IconBriefcase, IconCurrencyDollar, 
    IconCalendarTime, IconArrowLeft, IconMapPin,
    IconUsers, IconFileDescription, IconCircleCheck,
    IconExternalLink, IconTimeline
} from "@tabler/icons-react";

export default function PlacementDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applicationCount, setApplicationCount] = useState<number | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchJobDetails();
            fetchApplicationCount();
        }
    }, [params.id]);

    const fetchJobDetails = async () => {
        try {
            const res = await api.get(endpoints.placements.getById(params.id as string));
            setJob(res.data);
        } catch (err) {
            console.error("Failed to fetch placement details", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationCount = async () => {
        try {
            const res = await api.get(endpoints.placements.getApplications);
            const jobId = String(params.id);
            setApplicationCount(res.data.filter((application: any) => String(application.jobId) === jobId).length);
        } catch (err) {
            console.error("Failed to fetch placement application count", err);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#07111d] p-6 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-200"></div>
                    <p className="text-sm text-slate-400">Loading placement details…</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#07111d] p-6 font-sans">
                <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0c1a29] text-slate-400">
                        <IconBriefcase size={25} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Placement not found</h3>
                    <button onClick={() => router.back()} className="rounded-lg bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100">
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const driveStatus = job.status || "Not specified";
    const isActive = driveStatus.toLowerCase() === "active";

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
          <div className="mx-auto max-w-6xl space-y-5">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-5 sm:p-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button onClick={() => router.back()} aria-label="Go back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"><IconArrowLeft size={18} /></button>
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100">Career opportunities</p>
                        <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Placement details</h1>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${isActive ? "border-emerald-200/10 bg-emerald-200/[0.05] text-emerald-100" : "border-slate-200/10 bg-white/[0.04] text-slate-300"}`}><span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-slate-400"}`} /> {driveStatus}</span>
            </header>

            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
                <div className="space-y-5">
                    <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-cyan-100"><IconBuilding size={21} /></span>
                            <div className="min-w-0">
                                <h2 className="break-words text-xl font-semibold text-white sm:text-2xl">{job.company}</h2>
                                <p className="mt-1 break-words text-sm text-slate-400">{job.role}</p>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                                <p className="flex items-center gap-2 text-xs text-slate-400"><IconCurrencyDollar size={15} className="text-cyan-100" /> Package (CTC)</p>
                                <p className="mt-2 break-words text-lg font-semibold text-white">{job.package}</p>
                            </div>
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                                <p className="flex items-center gap-2 text-xs text-slate-400"><IconCalendarTime size={15} className="text-cyan-100" /> Last date to apply</p>
                                <p className="mt-2 break-words text-lg font-semibold text-white">{job.deadline}</p>
                            </div>
                        </div>
                        <div className="mt-5 border-t border-white/[0.07] pt-5">
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-white"><IconFileDescription size={16} className="text-cyan-100" /> Job description</h3>
                            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">{job.description || "No job description provided."}</p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Eligibility criteria</h3>
                            <IconCircleCheck size={18} className="text-cyan-100" />
                        </div>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {(Array.isArray(job.eligibilityCriteria) ? job.eligibilityCriteria : []).map((item: string, i: number) => (
                                <div key={i} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-sm text-slate-300">
                                    <IconCircleCheck size={16} className="shrink-0 text-emerald-200" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                        {(!Array.isArray(job.eligibilityCriteria) || job.eligibilityCriteria.length === 0) && <p className="text-sm text-slate-400">No eligibility criteria provided.</p>}
                    </section>
                </div>

                <aside className="space-y-5">
                    <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5">
                        <h3 className="text-sm font-semibold text-white">Quick information</h3>
                        <div className="mt-4 space-y-2.5">
                            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><span className="text-cyan-100"><IconMapPin size={17} /></span><div className="min-w-0"><p className="text-[11px] text-slate-500">Location</p><p className="break-words text-sm text-slate-200">{job.location || "Not provided"}</p></div></div>
                            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><span className="text-cyan-100"><IconUsers size={17} /></span><div><p className="text-[11px] text-slate-500">Applications</p><p className="text-sm text-slate-200">{applicationCount === null ? "Unavailable" : `${applicationCount} ${applicationCount === 1 ? "student" : "students"}`}</p></div></div>
                            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><span className="text-cyan-100"><IconTimeline size={17} /></span><div className="min-w-0"><p className="text-[11px] text-slate-500">Contact</p><p className="break-words text-sm text-slate-200">{job.contactInfo || "Not provided"}</p></div></div>
                            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><span className="text-cyan-100"><IconTimeline size={17} /></span><div><p className="text-[11px] text-slate-500">Status</p><p className="text-sm text-slate-200">{driveStatus}</p></div></div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5">
                        <h3 className="text-sm font-semibold text-white">Action center</h3>
                        <div className="mt-4 space-y-2.5">
                            {job.link ? <a href={job.link} target="_blank" rel="noreferrer" className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100"><IconExternalLink size={16} /> Company Portal</a> : <span className="flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-500">Company portal not provided</span>}
                            {job.noticeUrl ? <a href={`${API_URL}/public${job.noticeUrl}`} target="_blank" rel="noreferrer" className="flex min-h-10 w-full items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04]">Download Notice</a> : <span className="flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-500">No notice uploaded</span>}
                        </div>
                    </section>

                </aside>
            </div>
          </div>
        </main>
    );
}
