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

export default function Sidebar() {
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
        <aside className="w-64 bg-[#0f172a] border-r border-white/5 flex flex-col h-screen sticky top-0 z-[50] font-sans transition-all duration-500">
            {/* Branding Section */}
            <div className="p-10 pb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                <Link href="/" className="flex items-center gap-4 relative z-10 group/logo">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)] group-hover/logo:rotate-12 transition-all duration-700">
                        <IconSchool size={26} stroke={1.5} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-[15px] font-black text-white tracking-tighter leading-none group-hover/logo:text-indigo-400 transition-colors uppercase">DPCOE Studion</h2>
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">Student Management</p>
                    </div>
                </Link>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-6 space-y-2 py-8 overflow-y-auto scrollbar-hide relative z-10 font-sans">
                <p className="px-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8">Navigation Menu</p>
                {menuItems.map((item: NavItem) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.label + item.href} 
                            href={item.href}
                            className={`flex items-center gap-5 px-6 py-4 rounded-[1.8rem] transition-all duration-500 group relative overflow-hidden ${
                                isActive 
                                ? "bg-indigo-600 text-white shadow-[0_20px_40px_rgba(79,70,229,0.3)] scale-[1.02]" 
                                : "text-slate-500 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors"></div>
                            <item.icon size={22} stroke={1.5} className={`${isActive ? "text-white" : "text-slate-600 group-hover:text-indigo-400"} transition-all duration-500 relative z-10`} />
                            <span className="text-[11px] font-black uppercase tracking-widest relative z-10">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Intelligence Section */}
            <div className="p-8 mt-auto border-t border-white/5 relative z-10 bg-white/[0.02]">
                <div className="p-5 bg-[#070b14] rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden group/profile">
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover/profile:bg-indigo-600/[0.03] transition-colors"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-[#1e293b] flex items-center justify-center text-indigo-400 font-extrabold text-sm border border-white/5 shadow-xl group-hover/profile:scale-110 transition-transform duration-500">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[11px] font-black text-white truncate uppercase tracking-tight leading-none mb-2">{user?.name || "User Node"}</p>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-none">{role} context</p>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-3 py-4.5 rounded-[1.5rem] bg-indigo-600 text-white hover:bg-rose-600 transition-all text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(79,70,229,0.2)] hover:shadow-rose-600/20 active:scale-95 relative z-10 font-sans"
                    >
                        <IconLogout size={16} stroke={2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
