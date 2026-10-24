"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import {
    IconBriefcase, IconChartBar, IconBuilding, IconCurrencyDollar,
    IconCalendarTime, IconSearch, IconPlus, IconExternalLink,
    IconMail, IconPhone, IconChevronRight, IconX, IconTrash,
    IconFileAnalytics, IconTarget, IconUsers, IconSparkles, IconActivity, IconTrophy,
    IconFileDescription, IconArrowRight, IconUser, IconDownload, IconCheck, IconEdit
} from "@tabler/icons-react";

export default function AdminPlacementsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any | null>(null);
    const [viewingAppsFor, setViewingAppsFor] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [eligibilityText, setEligibilityText] = useState("");
    const [noticeFile, setNoticeFile] = useState<File | null>(null);
    const [newJob, setNewJob] = useState({
        company: "",
        role: "",
        package: "",
        description: "",
        deadline: "",
        link: "",
        location: "",
        contactInfo: "",
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
            let noticeUrl = editingJob?.noticeUrl || "";
            if (noticeFile) {
                const uploadData = new FormData();
                uploadData.append("file", noticeFile);
                const uploadRes = await api.post(endpoints.placements.uploadNotice, uploadData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                noticeUrl = uploadRes.data.url;
            }

            const placementData = {
                ...newJob,
                eligibilityCriteria: eligibilityText.split(/\r?\n/).map(item => item.trim()).filter(Boolean),
                noticeUrl
            };
            if (editingJob) {
                await api.put(endpoints.placements.update(editingJob._id || editingJob.id), placementData);
            } else {
                await api.post(endpoints.placements.add, placementData);
            }
            setIsCreateModalOpen(false);
            setEditingJob(null);
            setNewJob({ company: "", role: "", package: "", description: "", deadline: "", link: "", location: "", contactInfo: "", status: "Active" });
            setEligibilityText("");
            setNoticeFile(null);
            fetchData();
        } catch (err) {
            alert(`Failed to ${editingJob ? "update" : "add"} placement drive. Please try again.`);
        }
    };

    const openEditModal = (job: any) => {
        setEditingJob(job);
        setNewJob({
            company: job.company || "",
            role: job.role || "",
            package: job.package || job.salary || "",
            description: job.description || "",
            deadline: job.deadline || "",
            link: job.link || "",
            location: job.location || "",
            contactInfo: job.contactInfo || "",
            status: job.status || "Active"
        });
        setEligibilityText(Array.isArray(job.eligibilityCriteria) ? job.eligibilityCriteria.join("\n") : "");
        setNoticeFile(null);
        setIsCreateModalOpen(true);
    };

    const closeDriveModal = () => {
        setIsCreateModalOpen(false);
        setEditingJob(null);
        setNewJob({ company: "", role: "", package: "", description: "", deadline: "", link: "", location: "", contactInfo: "", status: "Active" });
        setEligibilityText("");
        setNoticeFile(null);
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
    const companyCount = new Set(jobs.map(job => job.company?.trim()).filter(Boolean)).size;
    const averageApplicationsPerDrive = jobs.length ? (applications.length / jobs.length).toFixed(1) : "0";

    return (
        <main className="admin-feature-page admin-placements-page min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6 relative text-left placement-workspace">
                <div className="absolute -right-8 -top-10 h-72 w-72 rounded-full bg-cyan-400/[0.06] blur-3xl pointer-events-none"></div>

                <header className="relative z-10 flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-100/10 bg-cyan-100/[0.06] text-cyan-100"><IconBriefcase size={21} /></span>
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100">Career opportunities</span>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Placements</h1>
                            <p className="mt-1 text-sm text-slate-400">Recruitment drives and company information.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setEditingJob(null); setIsCreateModalOpen(true); }}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    >
                        <IconPlus size={18} /> Post a drive
                    </button>
                </header>

                <div className="placement-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {[
                        { label: "Placement drives", val: jobs.length, icon: IconBriefcase, color: "text-cyan-200", bg: "bg-cyan-300/10" },
                        { label: "Total applications", val: applications.length, icon: IconUsers, color: "text-blue-200", bg: "bg-blue-300/10" },
                        { label: "Hiring companies", val: companyCount, icon: IconBuilding, color: "text-emerald-200", bg: "bg-emerald-300/10" },
                        { label: "Avg. applications / drive", val: averageApplicationsPerDrive, icon: IconChartBar, color: "text-amber-200", bg: "bg-amber-300/10" },
                    ].map((stat, i) => (
                        <div key={i} className="placement-stat-card bg-[#0c1a29] p-5 rounded-2xl border border-white/[0.08] group transition hover:border-cyan-100/20 flex items-center gap-4">
                            <div className={`placement-stat-icon w-11 h-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center border border-white/5`}>
                                <stat.icon size={21} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 mb-1">{stat.label}</p>
                                <p className="text-2xl font-semibold text-white leading-none">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="placement-list-panel rounded-2xl border border-white/[0.08] bg-[#0c1a29] overflow-hidden min-h-0 flex flex-col relative">
                    <div className="placement-list-toolbar flex flex-col gap-3 border-b border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 relative z-20">
                        <div className="flex items-center gap-2">
                            <IconActivity size={17} className="text-cyan-100" />
                            <h3 className="text-sm font-semibold text-white">Recruitment drives</h3>
                        </div>
                        <div className="relative w-full sm:max-w-xs text-left">
                            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Filter companies"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Filter companies"
                                className="w-full rounded-xl border border-white/10 bg-[#081522] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                            />
                        </div>
                    </div>

                    <div className="placement-grid grid grid-cols-1 gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3 flex-1 relative z-10">
                        {loading ? (
                             <div className="col-span-full flex flex-col items-center gap-3 px-5 py-14 text-center">
                                 <IconActivity size={25} className="animate-pulse text-cyan-100" stroke={1.5} />
                                 <p className="text-sm text-slate-400">Loading recruitment drives…</p>
                             </div>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => {
                                const jobApps = applications.filter(a => a.jobId === (job._id || job.id));
                                const driveStatus = job.status || "Active";
                                const active = driveStatus.toLowerCase() === "active";
                                return (
                                    <article key={job._id || job.id} className="placement-card flex min-w-0 flex-col rounded-2xl border border-white/[0.07] bg-[#081522] p-5 transition hover:border-cyan-100/20 hover:bg-[#0d1d2d]">
                                        <div className="relative z-10 flex h-full flex-col">
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="placement-company-icon flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-cyan-100"><IconBuilding size={19} /></span>
                                                <div className="flex flex-wrap items-center justify-end gap-2">
                                                    <span className={`inline-flex max-w-32 items-center justify-center gap-1.5 break-words rounded-full border px-2.5 py-1 text-center text-[11px] leading-tight ${active ? "border-emerald-200/10 bg-emerald-200/[0.05] text-emerald-100" : "border-white/10 bg-white/[0.04] text-slate-300"}`}><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-emerald-300" : "bg-slate-400"}`} />{driveStatus}</span>
                                                    <button onClick={() => openEditModal(job)} aria-label={`Edit ${job.company} drive`} className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05] hover:text-cyan-100"><IconEdit size={16} /></button>
                                                    <button onClick={() => handleDelete(job._id || job.id)} aria-label={`Delete ${job.company} drive`} className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-rose-200/20 hover:bg-rose-200/[0.05] hover:text-rose-200"><IconTrash size={16} /></button>
                                                </div>
                                            </div>
                                            <div className="mt-4 min-w-0">
                                                <h4 className="break-words text-lg font-semibold text-white">{job.company}</h4>
                                                <p className="mt-1 break-words text-sm text-slate-400">{job.role}</p>
                                            </div>
                                            <div className="mt-4 grid grid-cols-2 gap-2">
                                                <div className="placement-metric rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left"><p className="text-[11px] text-slate-500">Package</p><p className="mt-1 text-sm font-medium text-slate-200">{job.package || job.salary}</p></div>
                                                <div className="placement-metric rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left"><p className="text-[11px] text-slate-500">Apply by</p><p className="mt-1 text-sm font-medium text-slate-200">{job.deadline}</p></div>
                                            </div>
                                            <button onClick={() => setViewingAppsFor(job)} className="placement-applicants-button mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-200 hover:text-[#07111d]">
                                                View applicants <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs">{jobApps.length}</span> <IconArrowRight size={16} />
                                            </button>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                             <div className="col-span-full flex flex-col items-center justify-center px-5 py-14 text-center">
                                 <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400"><IconBriefcase size={22} /></span>
                                 <p className="text-sm font-semibold text-slate-200">No recruitment drives</p>
                             </div>
                        )}
                    </div>
                </section>
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
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{editingJob ? "Edit Drive" : "Initialize Drive"}</h3>
                                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-3 leading-none">{editingJob ? "Update recruitment details" : "Configuring recruitment node"}</p>
                                </div>
                            </div>
                            <button onClick={closeDriveModal} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Work Location</label>
                                    <input required type="text" placeholder="e.g. Pune / Hybrid / Remote" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-700"
                                        value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Contact for Questions</label>
                                    <input required type="text" placeholder="Name, email, or placement contact" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-700"
                                        value={newJob.contactInfo} onChange={e => setNewJob({...newJob, contactInfo: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Company Portal URL</label>
                                <input required type="url" placeholder="https://company.example/careers" className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-700 lowercase"
                                    value={newJob.link} onChange={e => setNewJob({...newJob, link: e.target.value})} />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Job Description</label>
                                <textarea required rows={4} placeholder="Describe the position and responsibilities..." className="w-full resize-y bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-700 normal-case"
                                    value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Eligibility Criteria</label>
                                <textarea required rows={4} placeholder="Enter one requirement per line" className="w-full resize-y bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-700 normal-case"
                                    value={eligibilityText} onChange={e => setEligibilityText(e.target.value)} />
                                <p className="ml-6 text-xs text-slate-500">Each line appears as a separate requirement.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Drive Status</label>
                                    <select className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl"
                                        value={newJob.status} onChange={e => setNewJob({...newJob, status: e.target.value})}>
                                        <option value="Active">Active</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] ml-6">Notice PDF (Optional)</label>
                                    <input type="file" accept="application/pdf,.pdf" onChange={e => setNoticeFile(e.target.files?.[0] || null)} className="w-full rounded-[2.2rem] border border-white/5 bg-[#070b14] px-6 py-5 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-200 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#07111d]" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[4.5rem] shadow-2xl transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.5em] active:scale-95 mt-6">
                                {editingJob ? <IconEdit size={22} /> : <IconTrophy size={26} />} {editingJob ? "Save Changes" : "Deploy Drive"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
