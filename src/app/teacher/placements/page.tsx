"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import Link from "next/link";
import { 
    IconBriefcase, IconBuilding, IconCurrencyDollar, IconCalendarTime, 
    IconSearch, IconChevronRight, IconActivity
} from "@tabler/icons-react";

export default function TeacherPlacementsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const res = await api.get(endpoints.placements.getAll);
            setJobs(res.data);
        } catch (err) {
            console.error("Failed to fetch placements", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-5 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-100/10 bg-cyan-100/[0.06] text-cyan-100"><IconBriefcase size={21} /></span>
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100">Career opportunities</span>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Placements</h1>
                            <p className="mt-1 text-sm text-slate-400">Recruitment drives and company information.</p>
                        </div>
                    </div>
                    <span className="w-fit rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-slate-300">{jobs.length} drives</span>
                </header>

                <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
                    <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-white"><IconActivity size={17} className="text-cyan-100" /> Recruitment drives</h2>
                        <div className="relative w-full sm:max-w-xs">
                            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" aria-label="Filter companies" placeholder="Filter companies" className="w-full rounded-xl border border-white/10 bg-[#081522] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="px-5 py-14 text-center text-sm text-slate-400 animate-pulse">Loading recruitment drives…</div>
                    ) : jobs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
                            {jobs.map((job) => (
                                <article key={job._id} className="flex min-w-0 flex-col rounded-2xl border border-white/[0.07] bg-[#081522] p-5 transition hover:border-cyan-100/20 hover:bg-[#0d1d2d]">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-cyan-100"><IconBuilding size={19} /></span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/10 bg-emerald-200/[0.05] px-2.5 py-1 text-[11px] text-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Active drive</span>
                                    </div>
                                    <div className="mt-4 min-w-0">
                                        <h3 className="break-words text-lg font-semibold text-white">{job.company}</h3>
                                        <p className="mt-1 break-words text-sm text-slate-400">{job.role}</p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                                            <p className="text-[11px] text-slate-500">Package</p>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-200"><IconCurrencyDollar size={15} className="text-cyan-100" />{job.package}</p>
                                        </div>
                                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                                            <p className="text-[11px] text-slate-500">Apply by</p>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-200"><IconCalendarTime size={15} className="text-cyan-100" />{job.deadline}</p>
                                        </div>
                                    </div>
                                    <Link href={`/teacher/placements/${job._id}`} className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-4 py-2 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100">View drive <IconChevronRight size={16} /></Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400"><IconBriefcase size={22} /></span>
                            <h3 className="text-sm font-semibold text-slate-200">No recruitment drives</h3>
                            <p className="mt-1 text-xs text-slate-500">There are no placement opportunities available right now.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
