"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { 
    IconBellRinging, IconCalendar, IconUser, IconNews, IconSearch, IconBell,
    IconBroadcast, IconActivity, IconCircleCheck, IconLoader2, IconFileDescription, IconArrowRight
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
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12 relative text-left">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
                
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative">
                    <div className="flex items-center gap-10 relative z-10">
                        <div className="w-24 h-24 bg-[#0f172a] border border-white/5 rounded-[3rem] flex items-center justify-center text-indigo-500 shadow-2xl relative group overflow-hidden">
                             <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-all"></div>
                            <IconBroadcast size={44} stroke={1.5} className="relative z-10" />
                        </div>
                        <div className="space-y-4">
                             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                 <IconBell size={12} className="text-indigo-400" />
                                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Notices</span>
                            </div>
                            <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Latest Announcements</h2>
                            <p className="text-sm font-bold text-slate-500 leading-none">Stay updated with the latest college instructions and news.</p>
                        </div>
                    </div>
                </header>

                <div className="bg-[#0f172a] rounded-[5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden min-h-[600px] flex flex-col relative font-sans">
                    <div className="p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white/2 relative z-10">
                        <h3 className="text-[11px] font-black text-slate-700 flex items-center gap-5 uppercase tracking-[0.5em] leading-none">
                            <IconNews size={22} className="text-indigo-500" /> READ ALL NOTICES ({filteredNotices.length})
                        </h3>
                        <div className="relative group w-full md:w-[26rem]">
                            <IconSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-indigo-500 transition-colors" size={24} />
                            <input 
                                type="text" 
                                placeholder="SEARCH NOTICES..." 
                                className="w-full bg-[#070b14] border border-white/5 rounded-[3rem] pl-20 pr-10 py-6 text-[11px] font-black uppercase tracking-[0.3em] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder:text-slate-900 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-white/5 flex-1 relative z-10 font-sans">
                        {loading ? (
                            <div className="py-48 text-center flex flex-col items-center gap-10">
                                <div className="p-10 bg-[#070b14] rounded-full border border-white/5 shadow-2xl">
                                    <IconLoader2 size={48} className="animate-spin text-indigo-500" stroke={1.5} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800">Synchronizing notices...</p>
                            </div>
                        ) : filteredNotices.length > 0 ? (
                            filteredNotices.map((notice) => (
                                <div key={notice._id} className="p-16 group hover:bg-white/[0.02] transition-all duration-700">
                                    <div className="flex flex-col lg:flex-row justify-between gap-16">
                                        <div className="flex-1 space-y-10">
                                            <div className="flex items-center gap-6">
                                                <span className={`text-[10px] font-black px-6 py-3 rounded-[1.2rem] uppercase tracking-[0.3em] border-2 shadow-2xl transition-all duration-700 ${
                                                    notice.type === 'Urgent' 
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                }`}>{notice.type}</span>
                                                <h4 className="text-4xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-indigo-400 transition-all duration-700">{notice.title}</h4>
                                            </div>
                                            
                                            <div className="space-y-8">
                                                <p className="text-base text-slate-400 font-medium leading-[1.8] max-w-5xl tracking-normal whitespace-pre-line">
                                                    {notice.content}
                                                </p>

                                                {notice.pdfUrl && (
                                                    <div className="pt-4">
                                                        <a 
                                                            href={`http://localhost:8001/public${notice.pdfUrl}`} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-4 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all group/btn"
                                                        >
                                                            <IconFileDescription size={20} />
                                                            Download instructions PDF
                                                            <IconArrowRight size={16} className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-10 pt-4 uppercase font-black tracking-[0.3em] text-[10px]">
                                                <div className="flex items-center gap-4 text-slate-800 bg-[#070b14] px-8 py-4 rounded-[1.5rem] border border-white/5 group-hover:text-slate-400 transition-colors">
                                                    <IconCalendar size={20} stroke={2} className="text-indigo-500" />
                                                    <span>PUBLISHED: {notice.date}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-800 bg-[#070b14] px-8 py-4 rounded-[1.5rem] border border-white/5 group-hover:text-slate-400 transition-colors">
                                                    <IconUser size={20} stroke={2} className="text-indigo-500" />
                                                    <span>FOR: {notice.audience}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex lg:items-center justify-center">
                                            <div className="w-24 h-24 bg-[#070b14] text-slate-800 rounded-[3rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_20px_50px_rgba(79,70,229,0.4)] group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 shadow-inner border border-white/5 group-hover:border-indigo-600">
                                                <IconBellRinging size={44} stroke={1.5} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) )
                        ) : (
                            <div className="py-60 text-center space-y-12 flex flex-col items-center justify-center grayscale group">
                                <IconBell size={100} stroke={0.5} className="text-slate-800" />
                                <div className="space-y-4">
                                    <p className="text-2xl font-black text-slate-800 uppercase tracking-[0.6em]">Matrix Null</p>
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-relaxed">No notices are currently available in the broadcast registry.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
