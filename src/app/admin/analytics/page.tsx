"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import {
    IconChartBar, IconUsers, IconActivity, IconTrophy, IconUser,
    IconCalendarStats, IconArrowUpRight, IconArrowDownRight,
    IconDotsVertical, IconChecklist, IconSparkles, IconTrendingUp,
    IconSchool, IconCpu, IconShieldLock, IconTerminal2, IconLoader2
} from "@tabler/icons-react";

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        attendanceRate: "84.2%",
        efficiency: "98.8%"
    });

    const fetchRealStats = async () => {
        setLoading(true);
        try {
            const res = await api.get(endpoints.attendance.adminStats);
            const data = res.data;

            setStats({
                totalStudents: data.totalStudents,
                totalTeachers: data.totalTeachers,
                attendanceRate: `${data.attendanceToday}%`,
                efficiency: "99.2%"
            });
        } catch (err) {
            console.error("Metrix acquisition failure", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealStats();
    }, []);

    return (
        <main className="admin-feature-page admin-reports-page min-h-screen bg-[#07111d] p-5 font-sans text-slate-200">
            <div className="mx-auto max-w-7xl space-y-6 relative font-sans report-workspace">

                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
                    <div className="relative min-w-0">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                            <IconSparkles size={13} />
                            <span>Administration workspace</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Reports &amp; analytics</h1>
                        <p className="mt-2 text-sm text-slate-400">Attendance and campus performance at a glance.</p>
                    </div>

                    <div className="relative flex gap-3">
                        <select aria-label="Report period" className="min-h-11 rounded-xl border border-white/10 bg-[#07111d]/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-200/40 focus:ring-4 focus:ring-cyan-200/10">
                            <option className="bg-[#0c1a29]">Current semester</option>
                            <option className="bg-[#0c1a29]">Annual audit</option>
                        </select>
                    </div>
                </header>

                {/* Tactical KPI Grid */}
                <div className="report-kpis grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10 font-sans">
                    {[
                        { label: "Total students", value: stats.totalStudents, trend: "Enrolled", icon: IconUsers, color: "text-cyan-200", bg: "bg-cyan-300/10" },
                        { label: "Total teachers", value: stats.totalTeachers, trend: "Faculty", icon: IconTeacher, color: "text-violet-200", bg: "bg-violet-300/10" },
                        { label: "Today's attendance", value: stats.attendanceRate, trend: "Today", icon: IconActivity, color: "text-emerald-200", bg: "bg-emerald-300/10" },
                        { label: "Operational efficiency", value: stats.efficiency, trend: "Overall", icon: IconTrophy, color: "text-amber-200", bg: "bg-amber-300/10" },
                    ].map((kpi, idx) => (
                        <div key={idx} className="report-kpi flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20">
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                <div className={`report-kpi-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                                    <kpi.icon size={21} stroke={1.8} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-400">{kpi.label}</p>
                                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{loading ? "—" : kpi.value}</p>
                                </div>
                                <span className="ml-auto shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[10px] text-slate-500">
                                    {kpi.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Primary Data Matrix */}
                <div className="report-content-grid grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 font-sans">
                    {/* Visual Analytics Hub */}
                    <div className="report-chart-card lg:col-span-8 bg-[#0c1a29] border border-white/[0.08] rounded-2xl p-5 sm:p-6 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-5 relative z-10">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Attendance overview</h2>
                                <p className="mt-1 text-xs text-slate-500">Attendance reporting activity</p>
                            </div>
                        </div>

                        <div className="report-chart-placeholder min-h-64 rounded-xl border border-white/[0.07] bg-[#07111d]/60 flex flex-col items-center justify-center gap-3 px-5 py-10 transition group-hover:bg-[#07111d]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-100">
                                <IconChartBar size={23} stroke={1.7} />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-slate-300">Attendance reports</p>
                                <p className="text-xs text-slate-500">Detailed charts will appear as reporting data becomes available.</p>
                            </div>
                        </div>
                    </div>

                    {/* Operational Intelligence */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="report-insights-card bg-[#0c1a29] rounded-2xl p-5 sm:p-6 text-white border border-white/[0.08] relative overflow-hidden group hover:border-cyan-100/20 transition-all">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center bg-cyan-300/10 rounded-xl text-cyan-100">
                                        <IconTrendingUp size={20} />
                                    </div>
                                    <h2 className="text-base font-semibold font-sans">Strategic insights</h2>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed tracking-normal">
                                    Operational efficiency has peaked at <span className="text-indigo-400 font-black uppercase tabular-nums tracking-widest">99.2%</span> since the full deployment of advanced facial recognition protocols.
                                </p>
                                <button className="w-full min-h-10 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-100/20 hover:text-white">
                                    Report details
                                </button>
                            </div>
                        </div>

                        <div className="report-departments-card bg-[#0c1a29] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 group hover:border-cyan-100/20 transition-all font-sans">
                            <h2 className="text-base font-semibold text-white">Department overview</h2>
                            <div className="space-y-5 font-sans">
                                {[
                                    { name: "IT Branch", score: 98, color: "bg-cyan-200", icon: IconSchool },
                                    { name: "CS Branch", score: 94, color: "bg-sky-300", icon: IconCpu },
                                    { name: "ENTC Branch", score: 89, color: "bg-blue-300", icon: IconTerminal2 },
                                    { name: "Automobile Branch", score: 82, color: "bg-slate-400", icon: IconActivity },
                                ].map((dept, idx) => (
                                    <div key={idx} className="space-y-2 group/row">
                                        <div className="flex justify-between items-center text-xs leading-none">
                                            <div className="flex items-center gap-3">
                                                <dept.icon size={15} className="text-slate-500 group-hover/row:text-cyan-100 transition-colors" />
                                                <span className="text-slate-300 group-hover/row:text-white transition-colors">{dept.name}</span>
                                            </div>
                                            <span className="text-slate-400 tabular-nums">{dept.score}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[#07111d] rounded-full overflow-hidden">
                                            <div className={`h-full ${dept.color} transition-all`} style={{ width: `${dept.score}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function IconTeacher({ size }: { size: number }) {
    return <IconUser size={size} />;
}
