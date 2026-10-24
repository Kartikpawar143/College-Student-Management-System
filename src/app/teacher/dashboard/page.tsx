"use client";
import { API_URL } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
    IconCalendarEvent, IconFileUpload, IconChecklist, 
    IconAlertCircle, IconPresentation, IconChartBar,
    IconUsers, IconMessageCircle, IconClock, IconSparkles,
    IconChevronRight
} from "@tabler/icons-react";
import Link from "next/link";

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState<any[]>([]);
    const [teacherStats, setTeacherStats] = useState({
        totalStudents: 0,
        pendingLeaves: 0,
        totalFiles: 0,
        activeClasses: 0
    });

    useEffect(() => {
        if (user) {
            fetchTeacherData();
        }
    }, [user]);

    const fetchTeacherData = async () => {
        try {
            const res1 = await fetch(`${API_URL}/timetable/teacher/${encodeURIComponent(user?.name || "")}`);
            const data1 = await res1.json();
            setTimetable(Array.isArray(data1) ? data1 : []);

            const res2 = await fetch(`${API_URL}/stats/teacher/${encodeURIComponent(user?.name || "")}`);
            const data2 = await res2.json();
            setTeacherStats(data2);
        } catch (error) {
            console.error("Failed to fetch teacher data", error);
        }
    };

    return (
        <main className="teacher-dashboard min-h-screen bg-[#07111d] p-5 text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative min-w-0">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                            <IconSparkles size={13} /> Faculty workspace
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Good to see you, {user?.name || "Teacher"}</h1>
                        <p className="mt-2 text-sm text-slate-400">Your classes, student activity, and teaching resources at a glance.</p>
                    </div>
                    <Link href="/teacher/attendance" className="relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">
                        <IconPresentation size={18} /> Mark attendance
                    </Link>
                </header>

                <section aria-label="Teaching overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { title: "Today's classes", val: timetable.length, icon: IconCalendarEvent, accent: "text-cyan-200", iconBg: "bg-cyan-300/10", desc: "Scheduled for today" },
                        { title: "Pending requests", val: teacherStats.pendingLeaves, icon: IconAlertCircle, accent: "text-amber-200", iconBg: "bg-amber-300/10", desc: "Awaiting your review" },
                        { title: "Teaching resources", val: teacherStats.totalFiles, icon: IconFileUpload, accent: "text-violet-200", iconBg: "bg-violet-300/10", desc: "Notes and materials" },
                        { title: "Total students", val: teacherStats.totalStudents, icon: IconUsers, accent: "text-emerald-200", iconBg: "bg-emerald-300/10", desc: "Across your classes" }
                    ].map((stat) => (
                        <article key={stat.title} className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20 hover:bg-[#102033]">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{stat.val}</p>
                                </div>
                                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} ${stat.accent}`}><stat.icon size={20} /></span>
                            </div>
                            <p className="mt-3 text-xs text-slate-500">{stat.desc}</p>
                        </article>
                    ))}
                </section>

                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,1fr)]">
                    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Today&apos;s schedule</h2>
                                <p className="mt-1 text-xs text-slate-500">Your teaching timetable</p>
                            </div>
                            <Link href="/teacher/timetable" className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-100/10">
                                Open timetable <IconChevronRight size={15} />
                            </Link>
                        </div>
                        {timetable.length ? (
                            <div className="divide-y divide-white/[0.06] px-5 sm:px-6">
                                {timetable.map((item: any, idx: number) => (
                                    <article key={idx} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-cyan-100"><IconClock size={18} /></span>
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-semibold text-white">{item.subject}</h3>
                                                <p className="mt-1 truncate text-xs text-slate-500">{item.branch} <span className="px-1 text-slate-700">·</span> Semester {item.semester} <span className="px-1 text-slate-700">·</span> Room {item.room}</p>
                                            </div>
                                        </div>
                                        <span className="ml-[3.25rem] inline-flex w-fit rounded-lg border border-cyan-100/10 bg-cyan-100/[0.06] px-3 py-1.5 text-xs font-medium tabular-nums text-cyan-100 sm:ml-0">
                                            {item.start_time} – {item.end_time}
                                        </span>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500"><IconCalendarEvent size={21} /></span>
                                <p className="text-sm font-medium text-slate-300">No classes scheduled today</p>
                                <p className="mt-1 text-xs text-slate-500">Your schedule will appear here when classes are listed.</p>
                            </div>
                        )}
                    </section>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-white">Recent updates</h2>
                                    <p className="mt-1 text-xs text-slate-500">A quick activity snapshot</p>
                                </div>
                                <IconMessageCircle size={19} className="text-cyan-100" />
                            </div>
                            <div className="space-y-3">
                                {[
                                    { title: "Attendance Marked", desc: "Batch 2021 attendance is now saved." },
                                    { title: "New Leave Form", desc: "Rahul from CS Sem 4 applied for leave." }
                                ].map((news, i) => (
                                    <article key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                                        <h3 className="text-sm font-medium text-slate-200">{news.title}</h3>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{news.desc}</p>
                                    </article>
                                ))}
                            </div>
                            <button type="button" className="mt-4 w-full rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05] hover:text-white">
                                View all
                            </button>
                        </section>

                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                            <div className="mb-4">
                                <h2 className="text-base font-semibold text-white">Quick access</h2>
                                <p className="mt-1 text-xs text-slate-500">Frequently used tools</p>
                            </div>
                            <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2.5">
                                {[
                                    { name: "My Students", href: "/teacher/students", icon: IconUsers, color: "text-blue-200" },
                                    { name: "Study Notes", href: "/teacher/notes", icon: IconFileUpload, color: "text-emerald-200" },
                                    { name: "Approvals", href: "/teacher/approvals", icon: IconChecklist, color: "text-violet-200" },
                                    { name: "Attendance", href: "/teacher/attendance", icon: IconChartBar, color: "text-amber-200" },
                                ].map((tool) => (
                                    <Link key={tool.name} href={tool.href} className="flex min-h-20 flex-col justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05]">
                                        <tool.icon size={18} className={tool.color} />
                                        <span className="text-xs font-medium text-slate-300">{tool.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
