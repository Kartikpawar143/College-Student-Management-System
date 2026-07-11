"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
    IconSearch, IconBell, IconUser, IconChevronDown, 
    IconCommand, IconSettings, IconLogout, IconLayoutGrid,
    IconBroadcast, IconSparkles, IconActivity, IconShieldCheck
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getSectionName = () => {
        const parts = pathname.split("/");
        const last = parts[parts.length - 1];
        if (last === "dashboard") return "My Dashboard";
        return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
    };

    return (
        <nav className={`h-20 flex items-center justify-between px-8 sticky top-0 z-[45] transition-all duration-500 font-sans border-b border-white/5 ${
            scrolled ? "bg-[#070b14]/90 backdrop-blur-xl shadow-2xl" : "bg-[#070b14]"
        }`}>
            {/* Left: Section Identity */}
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <IconActivity size={10} className="text-indigo-500" />
                        <span>Status / {user?.role || "user"}</span>
                    </div>
                    <h2 className="text-lg font-black text-white tracking-tight leading-tight mt-0.5 uppercase">
                        {getSectionName()}
                    </h2>
                </div>

                {/* Status Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group cursor-default">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_#818cf8]"></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">System Working</span>
                </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-sm mx-10 hidden xl:block">
                <div className="relative group/search">
                    <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search for something..." 
                        className="w-full bg-[#0f172a] border border-white/5 rounded-xl pl-12 pr-12 py-3 text-[10px] font-bold text-white tracking-tight focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-[#0f172a] focus:border-indigo-500/20 transition-all placeholder:text-slate-600 uppercase"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-[#070b14] border border-white/5 rounded-lg">
                        <IconCommand size={8} className="text-slate-500" />
                        <span className="text-[8px] font-black text-slate-500">K</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 bg-[#0f172a] border border-white/5 rounded-xl transition-all active:scale-95 shadow-lg group">
                    <IconBell size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0f172a]"></span>
                </button>

                <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block"></div>

                {/* User Profile */}
                <div className="relative">
                    <div 
                        onClick={() => setShowProfile(!showProfile)}
                        className={`flex items-center gap-3 p-1.5 pr-4 rounded-xl cursor-pointer transition-all active:scale-95 border border-transparent ${
                            showProfile ? "bg-white border-white shadow-xl" : "hover:bg-white/5"
                        }`}
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shadow-lg transition-all ${
                            showProfile ? "bg-indigo-600 text-white" : "bg-[#070b14] text-indigo-400 border border-white/5"
                        }`}>
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="hidden md:block select-none leading-none">
                            <p className={`text-[10px] font-black tracking-tight transition-colors uppercase ${showProfile ? "text-[#070b14]" : "text-white"}`}>
                                {user?.name || "Member User"}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${showProfile ? "text-indigo-600" : "text-slate-500"}`}>
                                    {user?.role || "Access"}
                                </span>
                                <IconChevronDown size={8} className={`transition-transform duration-300 ${showProfile ? "rotate-180 text-indigo-600" : "text-slate-600"}`} />
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {showProfile && (
                        <div className="absolute right-0 mt-4 w-60 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden text-slate-100 font-sans">
                            <div className="p-3 bg-white/5 rounded-xl mb-3 border border-white/5">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">My Account</p>
                                <p className="text-white text-[10px] font-bold truncate lowercase">{user?.email || "syncing..."}</p>
                            </div>

                            <div className="space-y-1">
                                <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest group/btn">
                                    <IconSettings size={16} className="text-slate-500 group-hover:text-amber-400" /> Settings
                                </button>
                                <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest group/btn">
                                    <IconSparkles size={16} className="text-slate-500 group-hover:text-indigo-400" /> Personalize
                                </button>
                                <div className="h-px bg-white/5 my-2"></div>
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-white text-[#0f172a] hover:bg-rose-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest shadow-lg group/logout"
                                >
                                    <IconLogout size={16} className="group-hover/logout:-translate-x-1 transition-transform" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
