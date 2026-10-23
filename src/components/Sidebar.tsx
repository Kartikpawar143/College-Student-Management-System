"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
    IconLayoutDashboard, IconUsers, IconUserStar, IconMessageCircle, 
    IconBriefcase, IconCircleCheck, IconChartBar, IconCalendarWeek, 
    IconNotes, IconFileUpload, IconLogout, IconDoor, 
    IconShieldLock, IconId, IconSchool, IconUserCircle, IconSettings,
    IconClipboardList, IconFileCheck, IconCertificate, IconSparkles, IconUserPlus, IconActivity, IconUserScan,
    IconWalk, IconFileText, IconCurrencyDollar
} from "@tabler/icons-react";

interface NavItem {
    label: string;
    href: string;
    icon: any;
}

export default function Sidebar({ mobileOpen = false, onNavigate, onClose }: { mobileOpen?: boolean; onNavigate?: () => void; onClose?: () => void } = {}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const role = user?.role || "student";

    const adminLinks: NavItem[] = [
        { label: "Dashboard", href: "/admin/dashboard", icon: IconLayoutDashboard },
        { label: "Students List", href: "/admin/students", icon: IconUsers },
        { label: "Teachers List", href: "/admin/teachers", icon: IconUserStar },
        { label: "Timetable", href: "/admin/timetable", icon: IconCalendarWeek },
        { label: "Notices", href: "/admin/notices", icon: IconMessageCircle },
        { label: "Placements", href: "/admin/placements", icon: IconBriefcase },
        { label: "Short Leaves", href: "/admin/gatepass", icon: IconWalk },
        { label: "Reports", href: "/admin/analytics", icon: IconChartBar },
        { label: "Settings", href: "/admin/settings", icon: IconSettings },
    ];

    const teacherLinks: NavItem[] = [
        { label: "Dashboard", href: "/teacher/dashboard", icon: IconLayoutDashboard },
        { label: "Approvals", href: "/teacher/approvals", icon: IconCircleCheck },
        { label: "Timetable", href: "/teacher/timetable", icon: IconCalendarWeek },
        { label: "Notices", href: "/teacher/notices", icon: IconMessageCircle },
        { label: "Placements", href: "/teacher/placements", icon: IconBriefcase },
        { label: "Study Notes", href: "/teacher/notes", icon: IconFileUpload },
        { label: "Old Papers", href: "/teacher/pyqs", icon: IconNotes },
        { label: "Add Students", href: "/teacher/students", icon: IconUserPlus },
        { label: "Attendance", href: "/teacher/attendance", icon: IconFileCheck },
        { label: "My Profile", href: "/teacher/profile", icon: IconUserCircle },
    ];

    const studentLinks: NavItem[] = [
        { label: "Dashboard", href: "/student/dashboard", icon: IconLayoutDashboard },
        { label: "Attendance", href: "/student/attendance", icon: IconCircleCheck },
        { label: "Timetable", href: "/student/timetable", icon: IconCalendarWeek },
        { label: "Notices", href: "/student/notices", icon: IconMessageCircle },
        { label: "Job Openings", href: "/student/placements", icon: IconBriefcase },
        { label: "Study Notes", href: "/student/notes", icon: IconFileUpload },
        { label: "Old Papers", href: "/student/pyqs", icon: IconNotes },
        { label: "Short Leaves", href: "/student/gatepass", icon: IconWalk },
        { label: "Documents", href: "/student/documents", icon: IconId },
        { label: "Exam Registration", href: "/student/exam_form", icon: IconFileText },
        { label: "Scholarship", href: "/student/scholarship", icon: IconCurrencyDollar },
        { label: "My Profile", href: "/student/profile", icon: IconUserCircle },
    ];

    const menuItems = role === "admin" ? adminLinks : role === "teacher" ? teacherLinks : studentLinks;

    return (
        <>
        {onClose && mobileOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-[59] bg-slate-950/65 backdrop-blur-sm lg:hidden" />}
        <aside className={`w-60 shrink-0 bg-[#0d1a29] border-r border-white/10 flex flex-col h-screen sticky top-0 z-[50] font-sans transition-transform duration-300 ${onClose ? (mobileOpen ? "fixed inset-y-0 left-0 translate-x-0 z-[60] lg:sticky lg:inset-auto" : "hidden lg:flex") : ""}`}>
            {/* Branding Section */}
            <div className="px-5 py-6 relative overflow-hidden group">
                <Link href="/" className="flex items-center gap-3 relative z-10 group/logo">
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-800">
                        <IconSchool size={26} stroke={1.5} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-sm font-bold text-white tracking-tight leading-none">GHRUA</h2>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Campus portal</p>
                    </div>
                </Link>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-3 space-y-1 py-3 overflow-y-auto scrollbar-hide relative z-10 font-sans">
                <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Workspace</p>
                {menuItems.map((item: NavItem) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.label + item.href} 
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative overflow-hidden ${
                                isActive 
                                ? "bg-cyan-200 text-[#07111d]" 
                                : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                            }`}
                        >
                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors"></div>
                            <item.icon size={21} stroke={1.6} className={`${isActive ? "text-[#07111d]" : "text-slate-500 group-hover:text-cyan-100"} transition-all duration-300 relative z-10`} />
                            <span className="text-sm font-medium relative z-10">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Intelligence Section */}
            <div className="p-3 mt-auto border-t border-white/10 relative z-10">
                <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 space-y-3 relative overflow-hidden group/profile">
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover/profile:bg-indigo-600/[0.03] transition-colors"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-9 h-9 rounded-lg bg-[#1e293b] flex items-center justify-center text-sky-300 font-bold text-sm border border-white/5">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-semibold text-white truncate leading-none mb-2">{user?.name || "User"}</p>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-[10px] text-slate-400 font-medium capitalize leading-none">{role}</p>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-slate-200 hover:bg-white/15 transition-colors text-xs font-medium relative z-10 font-sans"
                    >
                        <IconLogout size={16} stroke={2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
        </>
    );
}
