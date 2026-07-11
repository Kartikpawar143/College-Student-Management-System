"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import Link from "next/link";
import { 
    IconBriefcase, IconBuilding, IconCurrencyDollar, IconCalendarTime, 
    IconSearch, IconChevronRight, IconActivity, IconExternalLink
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
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-rose-600/10 blur-[120px] rounded-full"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-[#0f172a] border border-white/5 rounded-[2.2rem] flex items-center justify-center text-rose-400 shadow-2xl">
                        <IconBriefcase size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Career Matrix</h2>
                        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-3 mr-4">Corporate Acquisitions & Recruitment Drives</p>
                    </div>
                </div>
            </header>

            <div className="bg-[#0f172a] rounded-[4.5rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden min-h-[500px] flex flex-col relative group">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#070b14]/50">
                    <h3 className="font-black text-white flex items-center gap-4 text-sm uppercase tracking-widest leading-none">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span> Transmission Feed
                    </h3>
                    <div className="relative group/search w-full md:w-80 uppercase tracking-widest shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-[#070b14]">
                        <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-rose-400 transition-colors" size={16} />
                        <input type="text" placeholder="FILTER CORPORATE..." className="w-full bg-transparent border-0 pl-14 pr-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none text-white focus:ring-4 focus:ring-rose-500/10 transition-all placeholder:text-slate-800" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-12 flex-1 relative z-10">
                    {loading ? (
                        <div className="col-span-full py-24 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] animate-pulse">Syncing corporate database...</div>
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div key={job._id} className="bg-[#070b14] border border-white/5 p-10 rounded-[3.5rem] hover:bg-[#0f172a] hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:border-rose-500/20 transition-all group relative overflow-hidden flex flex-col font-sans uppercase tracking-widest">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="relative z-10 flex flex-col h-full uppercase tracking-widest">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-16 h-16 bg-[#0f172a] rounded-3xl flex items-center justify-center shadow-2xl border border-white/5 text-rose-500 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                                            <IconBuilding size={32} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-12">
                                        <h4 className="text-3xl font-black text-white tracking-tight group-hover:text-rose-400 transition-colors leading-[1]">{job.company}</h4>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{job.role}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="p-5 bg-[#0f172a] border border-white/5 rounded-2xl shadow-xl">
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 leading-none">Yield</p>
                                            <p className="text-xs font-black text-white uppercase leading-none tracking-widest">{job.package}</p>
                                        </div>
                                        <div className="p-5 bg-[#0f172a] border border-white/5 rounded-2xl shadow-xl">
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 leading-none">Protocol</p>
                                            <p className="text-[8px] font-black text-emerald-400 uppercase leading-none tracking-widest">ACTIVE DRIVE</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                                        <span className="flex items-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">
                                            <IconCalendarTime size={18} className="text-rose-500" /> SEAL: {job.deadline}
                                        </span>
                                        <Link 
                                            href={`/teacher/placements/${job._id}`}
                                            className="bg-rose-600 text-white rounded-xl px-6 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20 active:scale-95 flex items-center gap-3"
                                        >
                                            RECORDS <IconChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center space-y-10 flex flex-col items-center justify-center border-t border-white/5 font-sans">
                            <div className="w-24 h-24 bg-[#070b14] rounded-[3.5rem] border border-white/5 flex items-center justify-center text-slate-900 shadow-2xl">
                                <IconBriefcase size={64} />
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-black text-slate-700 uppercase tracking-[0.5em]">Network Offline</p>
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">No recruitment signals detected in the matrix</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
