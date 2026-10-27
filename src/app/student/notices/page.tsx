"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import {
    IconCalendar, IconUser, IconNews, IconSearch, IconBell,
    IconBroadcast, IconLoader2, IconFileDescription, IconArrowRight
} from "@tabler/icons-react";

export default function StudentNoticesPage() {
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchNotices = async () => {
        try {
            const res = await api.get(endpoints.notices.getAll);
            // Show all notices or filter by general relevance
            const filtered = res.data.filter((n: any) =>
                n.audience === "All Students" || n.audience === "Final Year" || n.audience === "Departments"
            );
            setNotices(filtered);
        } catch (err) {
            console.error("Failed to fetch notices", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100"><IconBell size={13} /> Student updates</span>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Notices</h1><p className="mt-1.5 text-sm text-slate-400">College announcements, instructions, and important dates.</p></div>
                            <span className="text-sm text-slate-400">{filteredNotices.length} notices</span>
                        </div>
                    </div>
                </header>

                <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] min-h-[360px] flex flex-col relative font-sans">
                    <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-white"><IconNews size={17} className="text-cyan-100" /> All notices</h2>
                        <div className="relative w-full sm:max-w-sm">
                            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                            <input
                                type="text"
                                placeholder="Search notices"
                                aria-label="Search notices"
                                className="w-full rounded-xl border border-white/10 bg-[#081522] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-white/[0.06] flex-1 relative z-10 font-sans">
                        {loading ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                                <IconLoader2 size={25} className="animate-spin text-cyan-100" />
                                <p className="text-sm text-slate-400">Loading notices…</p>
                            </div>
                        ) : filteredNotices.length > 0 ? (
                            filteredNotices.map((notice) => (
                                <article key={notice._id} className="p-5 transition hover:bg-white/[0.02] sm:p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${notice.type === 'Urgent' ? 'border-rose-200/15 bg-rose-200/[0.07] text-rose-100' : 'border-cyan-100/15 bg-cyan-100/[0.06] text-cyan-100'}`}>{notice.type}</span>
                                                <h3 className="min-w-0 break-words text-base font-semibold text-white sm:text-lg">{notice.title}</h3>
                                            </div>
                                            <IconBroadcast size={18} className="shrink-0 text-cyan-100/70" />
                                    </div>
                                    <div>
                                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                                                    {notice.content}
                                                </p>

                                                {notice.pdfUrl && (
                                                    <div className="mt-4">
                                                        <a
                                                            href={`${API_URL}/public${notice.pdfUrl}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-cyan-200 px-4 py-2 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 group/btn"
                                                        >
                                                            <IconFileDescription size={20} />
                                                            Download instructions PDF
                                                            <IconArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
                                                    <IconCalendar size={14} className="text-cyan-100" />
                                                    <span>{notice.date}</span>
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
                                                    <IconUser size={14} className="text-cyan-100" />
                                                    <span>{notice.audience}</span>
                                                </div>
                                            </div>
                                </article>
                            ) )
                        ) : (
                            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400"><IconBell size={22} /></span>
                                <p className="text-sm font-semibold text-slate-200">No notices found</p>
                                <p className="mt-1 text-xs text-slate-500">There are no active notices matching this search.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
