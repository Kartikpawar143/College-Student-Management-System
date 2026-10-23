"use client";
import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IconUsers, IconUserStar, IconCircleCheck, IconAlertCircle, IconDoor, IconBriefcase, IconArrowUpRight, IconChartBar } from "@tabler/icons-react";

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
    { title: "Students", value: stats.totalStudents, label: "Enrolled students", icon: IconUsers, href: "/admin/students", color: "text-blue-700", bg: "bg-blue-50" },
    { title: "Faculty", value: stats.totalTeachers, label: "Teaching staff", icon: IconUserStar, href: "/admin/teachers", color: "text-violet-700", bg: "bg-violet-50" },
    { title: "Attendance", value: `${stats.attendanceToday}%`, label: "Today's attendance", icon: IconCircleCheck, href: "/admin/analytics", color: "text-emerald-700", bg: "bg-emerald-50" },
    { title: "Leave requests", value: stats.pendingLeaves, label: "Awaiting review", icon: IconAlertCircle, href: "/admin/approvals", color: "text-amber-700", bg: "bg-amber-50" },
    { title: "Short leaves", value: stats.pendingGatepass, label: "Pending requests", icon: IconDoor, href: "/admin/gatepass", color: "text-rose-700", bg: "bg-rose-50" },
    { title: "Placements", value: placementCount ?? "—", label: "Placement drives", icon: IconBriefcase, href: "/admin/placements", color: "text-cyan-700", bg: "bg-cyan-50" },
  ];

  return <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 text-slate-900">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Administration</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Campus overview for {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <Link href="/admin/analytics" className="inline-flex w-fit items-center gap-2 rounded-lg bg-sky-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-900"><IconChartBar size={17} /> View reports <IconArrowUpRight size={15} /></Link>
      </header>

      <section aria-label="Campus statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, value, label, icon: Icon, href, color, bg }) => <Link key={title} href={href} className="group flex min-w-0 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-5">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}><Icon size={21} stroke={1.8} /></div>
          <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">{loading ? "—" : value}</p><p className="mt-0.5 text-xs text-slate-500">{label}</p></div>
          <IconArrowUpRight size={17} className="shrink-0 text-slate-300 transition group-hover:text-sky-700" />
        </Link>)}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-4 py-4 sm:px-5"><h2 className="font-semibold">Campus activity</h2><p className="text-sm text-slate-500">Summary of activity across college services</p></div>
        <div className="flex min-h-48 flex-col items-center justify-center px-5 py-8 text-center"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500"><IconChartBar size={22} /></div><p className="text-sm font-medium text-slate-700">Activity reports</p><p className="mt-1 max-w-md text-sm text-slate-500">Live activity reporting will appear here as data becomes available.</p></div>
      </section>
    </div>
  </div>;
}
