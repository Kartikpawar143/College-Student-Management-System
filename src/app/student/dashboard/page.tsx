"use client";
import { API_URL } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    IconCalendarEvent, IconBriefcase, IconFileText, IconBell,
    IconClock, IconBooks, IconUserCheck, IconSparkles,
    IconTarget, IconChevronRight, IconSchool, IconPaperclip, IconArrowUpRight
} from "@tabler/icons-react";
import Link from "next/link";

export default function StudentDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [timetable, setTimetable] = useState<any[]>([]);
    const [notices, setNotices] = useState<any[]>([]);
    const [recentLeave, setRecentLeave] = useState<any>(null);
    const [placements, setPlacements] = useState<any[]>([]);

    const fetchStudentData = async () => {
        if (!user) return;
        try {
            const [profileRes, timetableRes, noticesRes, placementsRes, leaveRes] = await Promise.all([
                fetch(`${API_URL}/students/${user.id}/profile`),
                fetch(`${API_URL}/timetable/${encodeURIComponent(user.department || "CS")}/${user.semester || 1}`),
                fetch(`${API_URL}/notices/`),
                fetch(`${API_URL}/placements/`),
                fetch(`${API_URL}/gatepass/student/${user.id}`)
            ]);

            const profileData = await profileRes.json();
            setStats(profileData.stats);

            const timetableData = await timetableRes.json();
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            setTimetable(timetableData.filter((t: any) => t.day === today));

            const noticesData = await noticesRes.json();
            const filteredNotices = noticesData.filter((n: any) => 
                n.audience === "All Students" || n.audience === "Final Year" || n.audience === "Departments"
            );
            setNotices(filteredNotices.slice(0, 3));

            const placementsData = await placementsRes.json();
            setPlacements(placementsData.slice(0, 2));

            const leaveData = await leaveRes.json();
            if (leaveData.length > 0) {
                setRecentLeave(leaveData[leaveData.length - 1]);
            }

        } catch (err) {
            console.error("Error fetching dashboard data", err);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [user]);

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative min-w-0">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100"><IconSparkles size={13} /> Student workspace</div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Good to see you, {user?.name || "Student"}</h1>
                        <p className="mt-2 text-sm text-slate-400">Your classes, academic progress, and campus updates at a glance.</p>
                    </div>
                    <Link href="/student/profile" className="relative inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 transition hover:border-cyan-100/20 hover:bg-white/[0.07]">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100"><IconSchool size={19} /></span>
                        <span><span className="block text-sm font-semibold text-white">{user?.department || "Department not assigned"}</span><span className="mt-0.5 block text-xs text-slate-400">Semester {user?.semester || 1} <span className="px-1 text-slate-600">·</span> Roll no. {user?.rollNo || "N/A"}</span></span>
                    </Link>
                </header>

                <section aria-label="Academic overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { title: "Attendance", value: stats?.attendance || "0%", label: "Your presence rate", icon: IconUserCheck, color: "text-cyan-200", bg: "bg-cyan-300/10", href: "/student/attendance" },
                        { title: "Exam form", value: stats?.exams || "Done", label: "Current status", icon: IconFileText, color: "text-violet-200", bg: "bg-violet-300/10", href: "/student/exam_form" },
                        { title: "New placements", value: placements.length, label: "Open opportunities", icon: IconBriefcase, color: "text-emerald-200", bg: "bg-emerald-300/10", href: "/student/placements" },
                        { title: "Semester", value: user?.semester || 1, label: "Current semester", icon: IconSchool, color: "text-amber-200", bg: "bg-amber-300/10", href: "/student/timetable" },
                    ].map((stat) => <Link key={stat.title} href={stat.href} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20 hover:bg-[#102033]">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={21} stroke={1.8} /></div>
                        <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-400">{stat.title}</p><p className="mt-1 truncate text-2xl font-semibold tracking-tight text-white">{stat.value}</p><p className="mt-1 text-xs text-slate-500">{stat.label}</p></div>
                        <IconArrowUpRight size={17} className="shrink-0 text-slate-600 transition group-hover:text-cyan-100" />
                    </Link>)}
                </section>

                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,1fr)]">
                    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6"><div><h2 className="text-lg font-semibold text-white">Today&apos;s schedule</h2><p className="mt-1 text-xs text-slate-500">Your classes for today</p></div><Link href="/student/timetable" className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-100/10">Open timetable <IconChevronRight size={15} /></Link></div>
                        {timetable.length ? <div className="divide-y divide-white/[0.06] px-5 sm:px-6">{timetable.map((item, i) => <article key={i} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-cyan-100"><IconClock size={18} /></span><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-white">{item.subject}</h3><p className="mt-1 truncate text-xs text-slate-500">{item.teacher} <span className="px-1 text-slate-700">·</span> Room {item.room}</p></div></div><span className="ml-[3.25rem] inline-flex w-fit rounded-lg border border-cyan-100/10 bg-cyan-100/[0.06] px-3 py-1.5 text-xs font-medium tabular-nums text-cyan-100 sm:ml-0">{item.time}</span></article>)}</div> : <div className="flex flex-col items-center justify-center px-5 py-12 text-center"><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-slate-400"><IconCalendarEvent size={21} /></span><p className="text-sm font-medium text-slate-300">No classes scheduled today</p><p className="mt-1 text-xs text-slate-500">Your schedule will appear here when classes are listed.</p></div>}
                    </section>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                            <div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-semibold text-white">Recent updates</h2><p className="mt-1 text-xs text-slate-500">Notices and request status</p></div><IconBell size={19} className="text-cyan-100" /></div>
                            <div className="space-y-3">
                                {recentLeave && <Link href="/student/gatepass" className="block rounded-xl border border-cyan-100/10 bg-cyan-100/[0.04] p-4 transition hover:border-cyan-100/20"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-medium text-slate-200">{recentLeave.type || "Leave request"}</h3><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${recentLeave.status === "Approved" ? "bg-emerald-300/10 text-emerald-200" : recentLeave.status === "Rejected" ? "bg-rose-300/10 text-rose-200" : "bg-amber-300/10 text-amber-200"}`}>{recentLeave.status}</span></div><p className="mt-1.5 truncate text-xs text-slate-400">{recentLeave.reason}</p></Link>}
                                {notices.length > 0 ? notices.map((notice, i) => <article key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"><div className="mb-2 flex items-start justify-between gap-2"><p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100">{notice.type || "Notice"}</p>{notice.pdfUrl && <IconPaperclip size={14} className="shrink-0 text-slate-500" />}</div><h3 className="text-sm font-medium text-slate-200">{notice.title}</h3><p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{notice.content}</p></article>) : !recentLeave && <p className="py-5 text-center text-sm text-slate-400">No recent updates</p>}
                            </div>
                            <Link href="/student/notices" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05] hover:text-white">View all notices <IconChevronRight size={15} /></Link>
                        </section>

                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6"><div className="mb-4"><h2 className="text-base font-semibold text-white">Quick access</h2><p className="mt-1 text-xs text-slate-500">Frequently used student tools</p></div><div className="grid grid-cols-2 gap-2.5">{[
                            { label: "Exam form", href: "/student/exam_form", icon: IconFileText, color: "text-blue-200" },
                            { label: "Past papers", href: "/student/pyqs", icon: IconBooks, color: "text-amber-200" },
                            { label: "Study notes", href: "/student/notes", icon: IconFileText, color: "text-violet-200" },
                            { label: "Leave request", href: "/student/gatepass", icon: IconTarget, color: "text-rose-200" },
                        ].map((tool) => <Link key={tool.label} href={tool.href} className="flex min-h-20 flex-col justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05]"><tool.icon size={18} className={tool.color} /><span className="text-xs font-medium text-slate-300">{tool.label}</span></Link>)}</div></section>
                    </div>
                </div>
            </div>
        </main>
    );
}
