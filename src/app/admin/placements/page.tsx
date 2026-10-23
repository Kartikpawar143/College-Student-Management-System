"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import {
    IconBriefcase, IconChartBar, IconBuilding, IconCurrencyDollar,
    IconCalendarTime, IconSearch, IconPlus, IconExternalLink,
    IconMail, IconPhone, IconChevronRight, IconX, IconTrash,
    IconFileAnalytics, IconTarget, IconUsers, IconSparkles, IconActivity, IconTrophy,
    IconFileDescription, IconArrowRight, IconUser, IconDownload, IconCheck
} from "@tabler/icons-react";

export default function AdminPlacementsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingAppsFor, setViewingAppsFor] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newJob, setNewJob] = useState({
        company: "",
        role: "",
        package: "",
        description: "",
        deadline: "",
        link: "",
        status: "Active"
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res1 = await api.get(endpoints.placements.getAll);
            setJobs(res1.data);

            const res2 = await api.get(endpoints.placements.getApplications);
            setApplications(res2.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(endpoints.placements.add, newJob);
            setIsCreateModalOpen(false);
            setNewJob({ company: "", role: "", package: "", description: "", deadline: "", link: "", status: "Active" });
            fetchData();
        } catch (err) {
            alert("Failed to add placement drive. Please try again.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this placement drive?")) return;
        try {
            await api.delete(endpoints.placements.delete(id));
            fetchData();
        } catch (err) {
            alert("Failed to delete drive.");
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const appsForJob = applications.filter(app => app.jobId === (viewingAppsFor?._id || viewingAppsFor?.id));

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12 relative text-left">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none"></div>

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Career Intelligence</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Placement Drives</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Global opportunity nodes & recruitment pipelines</p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-[2.2rem] shadow-2xl transition-all flex items-center justify-center gap-4 uppercase text-[10px] tracking-widest active:scale-95 group"
                    >
                        <IconPlus size={20} className="group-hover:rotate-90 transition-transform" /> Deploy New Drive
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {[
                        { label: "Active Drives", val: jobs.length, icon: IconBriefcase, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                        { label: "Total Applications", val: applications.length, icon: IconUsers, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Pending Reviews", val: "14", icon: IconTarget, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Hired Nodes", val: "128", icon: IconTrophy, color: "text-amber-400", bg: "bg-amber-500/10" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#0f172a] p-8 rounded-[3.5rem] border border-white/5 shadow-2xl group hover:border-indigo-500/20 transition-all flex items-center gap-8">
                            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-xl border border-white/5`}>
                                <stat.icon size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                <p className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-indigo-400 transition-colors uppercase leading-none">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-[#0f172a] rounded-[4.5rem] border border-white/5 shadow-3xl overflow-hidden min-h-[600px] flex flex-col relative group">
                    <div className="p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white/[0.02] relative z-20 uppercase font-sans">
                        <div className="flex items-center gap-6">
                            <div className="w-5 h-5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                            <h3 className="font-black text-white text-sm uppercase tracking-widest leading-none">Operational recruitment Pipeline</h3>
                        </div>
                        <div className="relative group/search w-full md:w-96 text-left">
                            <IconSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="QUERY CAREER DATABASE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] pl-16 pr-8 py-5 text-[10px] font-black uppercase tracking-widest outline-none shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder:text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 p-12 flex-1 relative z-10">
                        {loading ? (
                             <div className="col-span-full py-48 text-center flex flex-col items-center gap-10 grayscale">
                                 <IconActivity size={64} className="animate-pulse text-indigo-500" stroke={1} />
                                 <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800">Synchronizing career vectors...</p>
                             </div>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => {
                                const jobApps = applications.filter(a => a.jobId === (job._id || job.id));
                                return (
                                    <div key={job._id || job.id} className="bg-[#070b14]/50 border border-white/5 p-12 rounded-[4.5rem] hover:bg-[#070b14] hover:shadow-[0_50px_100px_rgba(0,0,0,0.5)] hover:border-indigo-500/20 transition-all group relative overflow-hidden flex flex-col scale-100 hover:scale-[1.02] duration-700 uppercase">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="relative z-10 flex flex-col h-full uppercase tracking-tighter">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="w-20 h-20 bg-[#0f172a] rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/5 text-slate-700 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-700">
                                                    <IconBuilding size={40} />
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(job._id || job.id)}
                                                    className="p-4 bg-[#070b14] text-slate-800 hover:text-rose-500 hover:border-rose-500/20 transition-all rounded-2xl border border-white/5 shadow-xl"
                                                >
                                                    <IconTrash size={24} />
                                                </button>
                                            </div>

                                            <div className="space-y-4 mb-12 text-left">
                                                <h4 className="text-3xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors uppercase leading-[0.9]">{job.company}</h4>
                                                <p className="text-[11px] text-slate-800 font-black uppercase tracking-widest leading-none">{job.role}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mb-12">
                                                <div className="p-8 bg-[#0f172a] border border-white/5 rounded-[2.8rem] shadow-xl text-left">
                                                     <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-3 leading-none">Package</p>
                                                     <p className="text-lg font-black text-white uppercase leading-none tabular-nums">{job.package || job.salary}</p>
                                                </div>
                                                <div className="p-8 bg-[#0f172a] border border-white/5 rounded-[2.8rem] shadow-xl text-left">
                                                     <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-3 leading-none">Responses</p>
                                                     <p className="text-lg font-black text-indigo-400 uppercase leading-none tabular-nums">{jobApps.length} APPS</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setViewingAppsFor(job)}
                                                className="w-full py-6 bg-white/2 hover:bg-indigo-600 text-slate-800 hover:text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all border border-white/5 flex items-center justify-center gap-4 group/btn mt-auto"
                                            >
                                                VIEW APPLICANTS <IconArrowRight size={18} className="transition-transform group-hover/btn:translate-x-2" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                             <div className="col-span-full py-40 text-center grayscale opacity-20">
                                 <IconBriefcase size={80} stroke={0.5} className="text-slate-800 mb-8 mx-auto" />
                                 <p className="text-xl font-black text-slate-800 uppercase tracking-[0.5em]">No Drives Found</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Applications Modal */}
            {viewingAppsFor && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/95 backdrop-blur-3xl animate-in fade-in duration-500 font-sans">
                    <div className="bg-[#0f172a] w-full max-w-5xl rounded-[5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 overflow-hidden relative flex flex-col max-h-[90vh]">
                         <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/5 blur-[150px] rounded-full translate-x-24 -translate-y-24"></div>

                        <div className="flex justify-between items-center mb-14 relative z-10 text-left shrink-0">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                                    <IconUsers size={32} />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Student Applicants</h3>
                                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-4 leading-none">{viewingAppsFor.company} • {viewingAppsFor.role}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingAppsFor(null)} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                <IconX size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 custom-scrollbar pr-4 relative z-10 uppercase font-sans">
                            {appsForJob.length > 0 ? (
                                <div className="space-y-6">
                                    {appsForJob.map((app, i) => (
                                        <div key={i} className="bg-[#070b14]/60 p-10 rounded-[3.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 hover:border-indigo-500/20 hover:bg-[#070b14] transition-all group/app overflow-hidden relative">
                                            <div className="flex items-center gap-8 text-left w-full md:w-auto">
                                                <div className="w-14 h-14 bg-[#0f172a] rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 font-black text-xl group-hover/app:bg-indigo-600 group-hover/app:text-white transition-all shadow-xl">
                                                    {app.studentName?.[0] || "S"}
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none truncate max-w-[15rem]">{app.studentName}</h4>
                                                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em] leading-none">ROLL NO: {app.rollNo} • APPLIED ON {new Date(app.appliedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {app.resumeUrl ? (
                                                <a
                                                    href={`${API_URL}/public${app.resumeUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-4 px-10 py-5 bg-white/2 border border-white/5 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl group/dl"
                                                >
                                                    <IconFileDescription size={20} stroke={2} className="group-hover/dl:animate-bounce" />
                                                    View Resume PDF
                                                </a>
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-8 py-4 bg-white/2 rounded-[2rem] border border-white/5">No Resume Node</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 text-center opacity-40 flex flex-col items-center gap-8">
                                     <IconFileAnalytics size={80} stroke={0.5} className="text-slate-800" />
                                     <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700">No Applications Logged Yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Creation Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500 font-sans">
                    <div className="bg-[#0f172a] w-full max-w-2xl rounded-[4.5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] scrollbar-hide relative overflow-hidden uppercase">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full translate-x-12 -translate-y-12"></div>

                        <div className="flex justify-between items-center mb-14 relative z-10 text-left">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl">
                                    <IconBuilding size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Initialize Drive</h3>
                                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-3 leading-none">Configuring recruitment node</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                <IconX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-10 relative z-10 font-sans uppercase text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Partner Identity</label>
                                    <input required type="text" placeholder="COMPANY NAME..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-900"
                                        value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Recruitment Role</label>
                                    <input required type="text" placeholder="ROLE TITLE..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-900"
                                        value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Package (LPA)</label>
                                    <input required type="text" placeholder="e.g. 12.5..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-900"
                                        value={newJob.package} onChange={e => setNewJob({...newJob, package: e.target.value})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Lock Gate</label>
                                    <input required type="date" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl font-sans"
                                        value={newJob.deadline} onChange={e => setNewJob({...newJob, deadline: e.target.value})} />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[4.5rem] shadow-2xl transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.5em] active:scale-95 mt-6">
                                <IconTrophy size={26} /> Deploy Drive
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
