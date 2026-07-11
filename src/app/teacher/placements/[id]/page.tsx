"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, endpoints } from "@/lib/api";
import { 
    IconBuilding, IconBriefcase, IconCurrencyDollar, 
    IconCalendarTime, IconArrowLeft, IconMapPin,
    IconUsers, IconFileDescription, IconCircleCheck,
    IconExternalLink, IconTimeline
} from "@tabler/icons-react";
import Link from "next/link";

export default function PlacementDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchJobDetails();
        }
    }, [params.id]);

    const fetchJobDetails = async () => {
        try {
            const res = await api.get(endpoints.placements.getById(params.id as string));
            setJob(res.data);
        } catch (err) {
            console.error("Failed to fetch placement details", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-rose-600 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-slate-300">
                        <IconBriefcase size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Placement Not Found</h3>
                    <button onClick={() => router.back()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="p-8 max-w-5xl mx-auto space-y-12 font-sans mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between gap-6 pb-8 border-b border-slate-100 font-sans">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-90"
                    >
                        <IconArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none font-sans">Job Details</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 font-sans">Full view of the recruitment drive</p>
                    </div>
                </div>
                <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Drive</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Information */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12 space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/50 rounded-bl-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="relative z-10 flex items-start gap-10">
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl shadow-rose-100 flex items-center justify-center text-rose-600 border border-slate-50 font-sans group-hover:scale-105 transition-transform duration-500">
                                <IconBuilding size={48} />
                            </div>
                            <div className="space-y-3 font-sans">
                                <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none font-sans">{job.company}</h3>
                                <p className="text-lg font-black text-slate-400 uppercase tracking-widest font-sans">{job.role}</p>
                            </div>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-6 pt-10 border-t border-slate-50 font-sans uppercase font-black">
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-2">
                                <div className="flex items-center gap-2 text-rose-500 mb-2">
                                    <IconCurrencyDollar size={18} />
                                    <span className="text-[9px] uppercase tracking-widest font-black">Package (CTC)</span>
                                </div>
                                <p className="text-2xl tracking-tighter font-black text-slate-800 font-sans">{job.package}</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-2">
                                <div className="flex items-center gap-2 text-blue-500 mb-2">
                                    <IconCalendarTime size={18} />
                                    <span className="text-[9px] uppercase tracking-widest font-black">Last Date to Apply</span>
                                </div>
                                <p className="text-2xl tracking-tighter font-black text-slate-800 font-sans uppercase">{job.deadline}</p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-6 pt-10 font-sans uppercase font-black">
                            <div className="flex items-center gap-3 ml-4">
                                <IconFileDescription size={20} className="text-slate-400" />
                                <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-sans">Job Description</h4>
                            </div>
                            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 text-sm text-slate-600 leading-relaxed font-sans not-uppercase lowercase first-letter:uppercase tracking-normal">
                                {job.description || "The company has not provided a detailed job description for this role yet. Please contact the placement cell for more information regarding eligibility and requirements."}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl shadow-rose-900/10 relative overflow-hidden group font-sans">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 blur-[100px] rounded-full group-hover:bg-rose-600/20 transition-all duration-700"></div>
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center justify-between">
                                Eligibility Criteria
                                <IconCircleCheck size={28} className="text-rose-500" />
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                                {[
                                    "B.E. / B.Tech (CS/IT/ENTC)",
                                    "Minimum 60% with no backlogs",
                                    "Strong Analytical Skills",
                                    "Good Communication Skills"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all font-sans">
                                        <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center font-sans tracking-tight">
                                            <IconCircleCheck size={16} />
                                        </div>
                                        <span className="text-xs font-bold font-sans uppercase tracking-widest">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="lg:col-span-4 space-y-8 font-sans">
                    <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm space-y-8 font-sans">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 font-sans">Quick Info</h4>
                        <div className="space-y-6 font-sans">
                            <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-3xl font-sans">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-500 font-sans">
                                    <IconMapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-sans">Location</p>
                                    <p className="text-xs font-black text-slate-800 uppercase font-sans">On-site / Office</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-3xl font-sans">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 font-sans">
                                    <IconUsers size={24} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-sans">Applications</p>
                                    <p className="text-xs font-black text-slate-800 uppercase font-sans">45 Students</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-3xl font-sans">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-rose-500 font-sans">
                                    <IconTimeline size={24} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-sans">Status</p>
                                    <p className="text-xs font-black text-slate-800 uppercase font-sans">Under Process</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm font-sans">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-8 font-sans">Action Center</h4>
                         <div className="space-y-4 font-sans uppercase font-black">
                            <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3 font-sans">
                                <IconExternalLink size={18} /> Company Portal
                            </button>
                            <button className="w-full py-5 bg-white border border-slate-100 text-slate-500 rounded-[2rem] text-[10px] tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 font-sans">
                                Download Notice
                            </button>
                         </div>
                    </div>

                    <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 text-center space-y-4 font-sans">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-slate-200 font-sans">
                            <IconBriefcase size={32} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose font-sans">
                            For any queries regarding this drive, contact the TPO cell directly.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
