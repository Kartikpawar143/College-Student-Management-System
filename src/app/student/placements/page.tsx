"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconBriefcase, IconBuilding, IconCurrencyDollar, IconCalendarTime, 
    IconSearch, IconChevronRight, IconExternalLink, IconActivity, IconLoader2,
    IconCheck, IconUpload, IconFileDescription, IconX, IconSend
} from "@tabler/icons-react";

export default function StudentPlacementsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyingJob, setApplyingJob] = useState<any | null>(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [selectedResume, setSelectedResume] = useState<File | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

    const fetchJobs = async () => {
        try {
            const res = await api.get(endpoints.placements.getAll);
            setJobs(res.data);
            
            // Fetch applications to see what's already applied
            const appRes = await api.get(endpoints.placements.getApplications);
            const userApps = appRes.data.filter((a: any) => a.studentId === user?.id).map((a: any) => a.jobId);
            setAppliedJobs(userApps);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedResume(e.target.files[0]);
        }
    };

    const submitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !applyingJob || !selectedResume) return;
        
        setUploadingResume(true);
        try {
            // 1. Upload Resume
            const formData = new FormData();
            formData.append("file", selectedResume);
            const uploadRes = await api.post(endpoints.placements.uploadResume, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const resumeUrl = uploadRes.data.url;

            // 2. Submit Application
            await api.post("/placements/apply", {
                studentId: user.id,
                studentName: user.name,
                rollNo: user.rollNo,
                jobId: applyingJob._id || applyingJob.id,
                company: applyingJob.company,
                role: applyingJob.role,
                resumeUrl: resumeUrl
            });

            setAppliedJobs(prev => [...prev, applyingJob._id || applyingJob.id]);
            setApplyingJob(null);
            setSelectedResume(null);
            alert("Application sent successfully with your resume!");
        } catch (err) {
            console.error("Application failed", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setUploadingResume(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12 relative text-left">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
                
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative">
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                              <IconBriefcase size={12} className="text-indigo-400" />
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Recruitment Registry</span>
                         </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Job Openings</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">Find your dream job and apply with your resume.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-10">
                    {loading ? (
                        <div className="py-48 text-center flex flex-col items-center gap-10">
                            <div className="p-10 bg-[#0f172a] rounded-full border border-white/5 shadow-2xl">
                                <IconLoader2 size={48} className="animate-spin text-indigo-500" stroke={1.5} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800">Searching for jobs...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => {
                            const isApplied = appliedJobs.includes(job._id || job.id);
                            return (
                                <div key={job._id || job.id} className="bg-[#0f172a] p-12 rounded-[4rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-700 group flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-bl-[10rem] translate-x-12 -translate-y-12 opacity-50"></div>
                                    <div className="flex items-center gap-10 w-full lg:w-auto relative z-10">
                                        <div className="w-24 h-24 bg-[#070b14] rounded-[2.8rem] flex items-center justify-center text-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-inner border border-white/5 group-hover:scale-110">
                                            <IconBuilding size={44} stroke={1.5} />
                                        </div>
                                        <div className="space-y-4 font-sans tracking-tight uppercase">
                                            <h4 className="text-3xl font-black text-white tracking-tighter leading-none group-hover:text-indigo-400 transition-colors uppercase">{job.company}</h4>
                                            <p className="text-[11px] text-slate-700 font-black uppercase tracking-[0.4em] leading-none mb-4">{job.role}</p>
                                            <div className="flex flex-wrap items-center gap-8 pt-2">
                                                <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[#070b14] px-5 py-2.5 rounded-[1.2rem] border border-white/5">
                                                    <IconCurrencyDollar size={18} stroke={3} className="text-emerald-500" /> {job.salary || job.package}
                                                </span>
                                                <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[#070b14] px-5 py-2.5 rounded-[1.2rem] border border-white/5">
                                                    <IconCalendarTime size={18} stroke={3} className="text-indigo-500" /> Deadline: {job.deadline}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                     <button 
                                         disabled={isApplied}
                                         onClick={() => setApplyingJob(job)}
                                         className={`w-full lg:w-auto px-14 py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl relative z-10 ${
                                             isApplied 
                                             ? "bg-emerald-600 text-white cursor-default" 
                                             : "bg-indigo-600 text-white hover:bg-indigo-500"
                                         }`}
                                     >
                                         {isApplied ? (
                                             <span className="flex items-center gap-4"><IconCheck size={24} stroke={4} /> ALREADY APPLIED</span>
                                         ) : (
                                             <span className="flex items-center gap-4">APPLY WITH RESUME <IconUpload size={20} /></span>
                                         )}
                                     </button>
                                </div>
                            );
                        } )
                    ) : (
                        <div className="py-40 text-center bg-[#0f172a] rounded-[5rem] border-2 border-dashed border-white/5 grayscale">
                            <IconBriefcase size={80} stroke={0.5} className="text-slate-800 mb-8 mx-auto" />
                            <p className="text-xl font-black text-slate-800 uppercase tracking-[0.5em]">No Jobs Available</p>
                        </div>
                    )}
                </div>

                {/* Apply Modal */}
                {applyingJob && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500 font-sans">
                        <div className="bg-[#0f172a] w-full max-w-xl rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 relative overflow-hidden uppercase">
                             <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full translate-x-12 -translate-y-12"></div>
                             
                            <div className="flex justify-between items-center mb-14 relative z-10 text-left">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl">
                                        <IconFileDescription size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Job Application</h3>
                                        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-3 leading-none">{applyingJob.company} • {applyingJob.role}</p>
                                    </div>
                                </div>
                                <button onClick={() => setApplyingJob(null)} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                    <IconX size={24} />
                                </button>
                            </div>

                            <form onSubmit={submitApplication} className="space-y-12 relative z-10 text-left">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-6">Upload Your Resume (PDF)</label>
                                    <div className="relative group/file">
                                        <input 
                                            type="file" 
                                            accept=".pdf" 
                                            required
                                            onChange={handleFileUpload}
                                            className="hidden" 
                                            id="resume-upload" 
                                        />
                                        <label 
                                            htmlFor="resume-upload"
                                            className="w-full bg-[#070b14] border-2 border-dashed border-white/5 rounded-[2.5rem] py-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all group-hover/file:scale-[1.02]"
                                        >
                                            {selectedResume ? (
                                                <div className="flex items-center gap-6 text-indigo-400">
                                                    <IconFileDescription size={40} />
                                                    <div className="text-left py-2">
                                                        <p className="text-[11px] font-black uppercase tracking-widest leading-none truncate max-w-[15rem]">{selectedResume.name}</p>
                                                        <p className="text-[8px] font-bold text-slate-500 uppercase mt-2 tracking-widest">Document ready</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 rounded-[2rem] bg-[#0f172a] flex items-center justify-center text-slate-700 group-hover:text-indigo-400 transition-colors shadow-2xl">
                                                        <IconUpload size={32} />
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Click to select resume PDF</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={uploadingResume} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[4rem] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.5em] active:scale-95 disabled:opacity-50 mt-4">
                                    {uploadingResume ? (
                                        <><IconLoader2 size={24} className="animate-spin" /> SYNCHRONIZING...</>
                                    ) : (
                                        <><IconSend size={24} /> Submit Application</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
