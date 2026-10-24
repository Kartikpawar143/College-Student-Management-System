"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IconUsers, IconUserStar, IconCircleCheck, IconAlertCircle, IconDoor, IconBriefcase, IconArrowUpRight, IconChartBar, IconSparkles } from "@tabler/icons-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, attendanceToday: 0, pendingLeaves: 0, pendingGatepass: 0 });
  const [placementCount, setPlacementCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      const [statsResult, placementsResult] = await Promise.allSettled([
        fetch(`${API_URL}/stats/admin`).then(res => {
          if (!res.ok) throw new Error("Failed to fetch admin statistics");
          return res.json();
        }),
        fetch(`${API_URL}/placements/`).then(res => {
          if (!res.ok) throw new Error("Failed to fetch placement records");
          return res.json();
        }),
      ]);

      if (statsResult.status === "fulfilled") setStats(statsResult.value);
      else console.error("Failed to fetch admin statistics", statsResult.reason);

      if (placementsResult.status === "fulfilled" && Array.isArray(placementsResult.value)) {
        setPlacementCount(placementsResult.value.length);
      } else {
        console.error("Failed to fetch placement records", placementsResult.status === "rejected" ? placementsResult.reason : undefined);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Students", value: stats.totalStudents, label: "Enrolled students", icon: IconUsers, href: "/admin/students", color: "text-cyan-200", bg: "bg-cyan-300/10" },
    { title: "Faculty", value: stats.totalTeachers, label: "Teaching staff", icon: IconUserStar, href: "/admin/teachers", color: "text-violet-200", bg: "bg-violet-300/10" },
    { title: "Attendance", value: `${stats.attendanceToday}%`, label: "Today's attendance", icon: IconCircleCheck, href: "/admin/analytics", color: "text-emerald-200", bg: "bg-emerald-300/10" },
    { title: "Leave requests", value: stats.pendingLeaves, label: "Awaiting review", icon: IconAlertCircle, href: "/admin/approvals", color: "text-amber-200", bg: "bg-amber-300/10" },
    { title: "Short leaves", value: stats.pendingGatepass, label: "Pending requests", icon: IconDoor, href: "/admin/gatepass", color: "text-rose-200", bg: "bg-rose-300/10" },
    { title: "Placements", value: placementCount ?? "—", label: "Placement drives", icon: IconBriefcase, href: "/admin/placements", color: "text-blue-200", bg: "bg-blue-300/10" },
  ];

  return <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100"><IconSparkles size={13} /> Administration workspace</div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Campus overview</h1>
          <p className="mt-2 text-sm text-slate-400">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} <span className="px-1 text-slate-600">·</span> Key activity and services at a glance</p>
        </div>
        <Link href="/admin/analytics" className="relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"><IconChartBar size={18} /> View reports <IconArrowUpRight size={15} /></Link>
      </header>

      <section aria-label="Campus statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, value, label, icon: Icon, href, color, bg }) => <Link key={title} href={href} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20 hover:bg-[#102033]">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}><Icon size={21} stroke={1.8} /></div>
          <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-400">{title}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-white">{loading ? "—" : value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>
          <IconArrowUpRight size={17} className="shrink-0 text-slate-600 transition group-hover:text-cyan-100" />
        </Link>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
        <div className="border-b border-white/[0.07] px-5 py-4 sm:px-6"><h2 className="text-lg font-semibold text-white">Campus activity</h2><p className="mt-1 text-xs text-slate-500">Summary of activity across college services</p></div>
        <div className="flex min-h-48 flex-col items-center justify-center px-5 py-8 text-center"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-100"><IconChartBar size={21} /></div><p className="text-sm font-medium text-slate-300">Activity reports</p><p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">Live activity reporting will appear here as data becomes available.</p></div>
      </section>
    </div>
  </main>;
}
