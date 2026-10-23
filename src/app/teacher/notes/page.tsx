"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconFileUpload, IconFileText, IconTrash, IconSearch,
    IconFileDescription, IconDotsVertical, IconCloudUpload,
    IconFilePlus, IconFileDownload, IconChevronRight, IconBook, IconX, IconCheck, IconSparkles, IconActivity
} from "@tabler/icons-react";

export default function TeacherNotesPage() {
    const { user } = useAuth();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        semester: "",
        branch: user?.department || ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchNotes = async () => {
        try {
            const res = await api.get(endpoints.documents.getAll("note"));
            setFiles(res.data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
        if (user?.department) {
            setFormData(prev => ({ ...prev, branch: user.department || "" }));
        }
    }, [user]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return alert("Please select a file");

        setUploading(true);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("subject", formData.subject);
        data.append("semester", formData.semester.toString());
        data.append("branch", formData.branch);
        data.append("fileType", "note");
        data.append("uploaderId", user?.id || "");
        data.append("uploaderName", user?.name || "");
        data.append("file", selectedFile);

        try {
            await api.post(endpoints.documents.upload, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setIsModalOpen(false);
            setIsSuccessOpen(true);
            setFormData({ title: "", subject: "", semester: "", branch: user?.department || "" });
            setSelectedFile(null);
            fetchNotes();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            await api.delete(endpoints.documents.delete(id));
            fetchNotes();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconSparkles size={12} className="text-indigo-400" />
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Files Hub</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Manage Notes</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">
                            Upload and <span className="text-indigo-400">share materials</span> for your classes easily.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 group relative z-10"
                    >
                        <IconFileUpload size={18} /> Deploy New Material
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Files List */}
                    <div className="lg:col-span-8 bg-[#0f172a] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden relative group font-sans min-h-[600px] flex flex-col">
                        <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#070b14]/50">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-4">
                                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                                    Registry Archive
                                </h3>
                                <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] leading-none ml-6">Secured Document Hub</p>
                            </div>
                            <div className="relative w-full md:w-[350px] group/search">
                                <IconSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-indigo-400 transition-colors" size={18} />
                                <input type="text" placeholder="FIND DOCUMENT..." className="w-full bg-[#070b14] border border-white/5 rounded-2xl pl-14 pr-8 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder:text-slate-800" />
                            </div>
                        </div>

                        <div className="divide-y divide-white/5 flex-1 relative z-10">
                            {loading ? (
                                <p className="py-24 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 animate-pulse">Syncing Hub Data...</p>
                            ) : files.length > 0 ? (
                                files.map((file) => (
                                    <div key={file._id} className="p-10 group/item hover:bg-white/5 transition-all relative">
                                        <div className="flex items-center justify-between gap-8 relative z-10">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 rounded-[2rem] bg-[#070b14] border border-white/5 text-slate-700 flex items-center justify-center shadow-2xl group-hover/item:scale-110 transition-all group-hover/item:text-indigo-400">
                                                    <IconFileDescription size={32} />
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="font-black text-white text-lg tracking-tight group-hover/item:text-indigo-400 transition-colors uppercase leading-none">{file.title}</h4>
                                                    <div className="flex items-center gap-6 text-slate-500">
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/10 text-indigo-400">{file.subject}</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">• Unit {file.semester} Node</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">• {new Date(file.uploadedAt).toLocaleDateString()} Log</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => handleDelete(file._id)}
                                                    className="p-4 bg-[#070b14] border border-white/5 text-slate-700 rounded-[1.3rem] hover:text-rose-400 hover:border-rose-500/20 transition-all active:scale-90 shadow-xl"
                                                >
                                                    <IconTrash size={22} />
                                                </button>
                                                <a 
                                                    href={`${API_URL}/public${file.filePath}`}
                                                    target="_blank"
                                                    className="p-4 bg-indigo-600 text-white rounded-[1.3rem] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
                                                >
                                                    <IconFileDownload size={22} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-32 text-center space-y-8 flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 bg-[#070b14] rounded-[2.5rem] border border-white/5 flex items-center justify-center text-slate-800 shadow-2xl">
                                        <IconBook size={56} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Registry Archive Empty</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Info & Status */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-[#0f172a] rounded-[3.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 blur-[100px] rounded-bl-full"></div>
                            <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-6 leading-none">Sync Status</h3>
                            <p className="text-[10px] text-slate-600 leading-relaxed font-black uppercase tracking-widest mb-10">Materials are published to operational units instantly.</p>
                            
                            <div className="space-y-6">
                                <div className="p-8 bg-[#070b14]/50 border border-white/5 rounded-[2.5rem] space-y-6">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-600 tracking-widest">Storage Matrix</span>
                                        <span className="text-emerald-500">Active</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 w-[78%] shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                                    </div>
                                </div>
                                <div className="p-8 bg-indigo-600 group-hover:bg-indigo-500 transition-all rounded-[2.5rem] shadow-2xl shadow-indigo-600/20">
                                     <div className="flex items-center gap-4 text-white">
                                         <IconActivity size={24} />
                                         <div>
                                             <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">Live Feed</p>
                                             <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200">System Core Synchronized</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] rounded-[3rem] border border-white/5 p-10 shadow-2xl space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">Protocol Instructions</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-black uppercase tracking-widest">
                                Deploy vectorized PDF or encoded digital assets for maximum compatibility with student units.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500 font-sans">
                        <div className="bg-[#0f172a] w-full max-w-2xl rounded-[4rem] p-12 lg:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full translate-x-12 -translate-y-12"></div>
                            
                            <div className="flex justify-between items-center mb-12 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl">
                                        <IconCloudUpload size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Add My Notes</h3>
                                        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-3 leading-none">Initializing Node Sync</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                    <IconX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-8 relative z-10 uppercase tracking-widest">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Notes Heading</label>
                                    <input required type="text" placeholder="UNIT 01: ADVANCED CORE MATRIX..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Subject Hub</label>
                                        <input required type="text" placeholder="CORE UNIT..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800"
                                            value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Branch Node</label>
                                        <select required className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl appearance-none cursor-pointer uppercase"
                                            value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}>
                                            <option value="">SELECT BRANCH</option>
                                            {["IT", "CS", "ENTC", "Automobile"].map(dept => (
                                                <option key={dept} value={dept}>{dept} HUB</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Semester Cycle</label>
                                        <select required className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl appearance-none cursor-pointer uppercase"
                                            value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                                            <option value="">SELECT SEM</option>
                                            {["1", "2", "3", "4", "5", "6", "7", "8"].map(sem => (
                                                <option key={sem} value={sem}>SEMESTER {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Initialize File Source</label>
                                        <div className="relative bg-[#070b14] border border-white/5 rounded-[2.2rem] overflow-hidden group/file cursor-pointer shadow-xl">
                                            <input required type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            <div className="px-8 py-5 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-800 truncate tracking-widest">
                                                    {selectedFile ? selectedFile.name.toUpperCase() : "SELECT NODE DOCUMENT"}
                                                </span>
                                                <IconFilePlus size={24} className="text-indigo-400 group-hover/file:scale-110 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white font-black py-7 rounded-[4rem] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.4em] active:scale-95 disabled:opacity-50 mt-6 hover:bg-indigo-500">
                                    {uploading ? "SYNCING CORE..." : "DEPLOY TO REPOSITORY"}
                                    {!uploading && <IconCloudUpload size={24} />}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success Screen */}
                {isSuccessOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-[100px] animate-in fade-in duration-500 font-sans">
                        <div className="bg-[#0f172a] w-full max-w-sm rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-2xl">
                                <IconCheck size={40} stroke={3} />
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-3 leading-none">Sync Successful</h3>
                            <p className="text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em] mb-12 leading-none">Files are now live in archive</p>
                            <button 
                                onClick={() => setIsSuccessOpen(false)}
                                className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all uppercase text-[11px] tracking-widest active:scale-95 hover:bg-emerald-600 shadow-xl shadow-indigo-600/10"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
