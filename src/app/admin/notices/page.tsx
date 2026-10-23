"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import {
    IconBell, IconCalendar, IconTrash, IconX, IconUser, IconAlertCircle,
    IconPinned, IconMessageCircle, IconHistory, IconBroadcast, IconVolume,
    IconPlus, IconSearch, IconSparkles, IconActivity, IconSend, IconFileDescription, IconPaperclip, IconExternalLink
} from "@tabler/icons-react";

export default function AdminNoticesPage() {
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [newNotice, setNewNotice] = useState({
        title: "",
        content: "",
        type: "General",
        audience: "All Students",
        date: new Date().toISOString().split('T')[0]
    });

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await api.get(endpoints.notices.getAll);
            setNotices(res.data);
        } catch (err) {
            console.error("Failed to fetch notices", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            let pdfUrl = null;
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await api.post(endpoints.notices.upload, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                pdfUrl = uploadRes.data.url;
            }

            await api.post(endpoints.notices.add, { ...newNotice, pdfUrl });
            setIsModalOpen(false);
            setNewNotice({
                title: "",
                content: "",
                type: "General",
                audience: "All Students",
                date: new Date().toISOString().split('T')[0]
            });
            setSelectedFile(null);
            fetchNotices();
        } catch (err) {
            alert("Failed to add notice. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this notice from the system?")) return;
        try {
            await api.delete(endpoints.notices.delete(id));
            fetchNotices();
        } catch (err) {
            alert("Failed to delete notice.");
        }
    };

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-12 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12 relative">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 blur-[200px] rounded-full pointer-events-none"></div>

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative z-10 text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Admin Bulletin</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Global Announcements</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] leading-none">Send notices and instructions to students</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-5 rounded-[2rem] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4 uppercase text-[10px] tracking-widest active:scale-95 group"
                    >
                        <IconPlus size={20} className="group-hover:rotate-90 transition-transform" /> Post New Notice
                    </button>
                </header>

                <div className="bg-[#0f172a] rounded-[4.5rem] border border-white/5 shadow-3xl overflow-hidden min-h-[600px] flex flex-col relative group">
                    <div className="p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white/[0.02] relative z-20">
                        <div className="flex items-center gap-6">
                            <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                            <h3 className="font-black text-white text-sm uppercase tracking-widest leading-none">Notice History</h3>
                        </div>
                        <div className="relative group/search w-full md:w-96">
                            <IconSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="SEARCH NOTICES..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] pl-16 pr-8 py-5 text-[10px] font-black uppercase tracking-widest outline-none shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder:text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-white/5 flex-1 relative z-10 font-sans">
                        {loading ? (
                            <div className="py-48 text-center flex flex-col items-center gap-10">
                                <div className="p-12 bg-[#070b14] rounded-[3rem] border border-white/5 shadow-2x">
                                    <IconActivity size={64} className="animate-pulse text-indigo-500" stroke={1} />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-800 animate-pulse">Loading notices...</p>
                            </div>
                        ) : filteredNotices.length > 0 ? (
                            filteredNotices.map((notice) => (
                                <div key={notice._id} className="p-14 group/item hover:bg-white/[0.02] transition-all relative overflow-hidden text-left">
                                     <div className="absolute top-0 right-0 w-80 h-full bg-indigo-600/0 group-hover/item:bg-indigo-600/[0.02] transition-colors skew-x-12 translate-x-20"></div>
                                    <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
                                        <div className="flex-1 space-y-8">
                                            <div className="flex items-center gap-6">
                                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest border transition-all ${
                                                    notice.type === 'Urgent' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                }`}>{notice.type}</span>
                                                <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight group-hover/item:text-indigo-400 transition-colors">{notice.title}</h4>
                                            </div>
                                            <p className="text-base text-slate-400 font-medium leading-[1.8] max-w-5xl tracking-normal opacity-80 group-hover/item:opacity-100 transition-opacity whitespace-pre-line">
                                                {notice.content}
                                            </p>

                                            {notice.pdfUrl && (
                                                <div className="pt-4 flex items-center gap-4">
                                                    <a
                                                        href={`${API_URL}/public${notice.pdfUrl}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-all shadow-xl shadow-emerald-500/5 group/btn"
                                                    >
                                                        <IconFileDescription size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                        View Instructions PDF
                                                    </a>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-12 pt-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-[#070b14] flex items-center justify-center text-slate-700 group-hover/item:text-indigo-400 transition-all border border-white/5 shadow-xl">
                                                        <IconCalendar size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{notice.date}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-[#070b14] flex items-center justify-center text-slate-700 group-hover/item:text-emerald-400 transition-all border border-white/5 shadow-xl">
                                                        <IconUser size={18} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AUDIENCE: {notice.audience}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => handleDelete(notice._id)}
                                                className="p-5 bg-[#070b14] border border-white/5 rounded-3xl text-slate-700 hover:text-rose-400 hover:border-rose-500/20 hover:shadow-2xl transition-all active:scale-90"
                                            >
                                                <IconTrash size={28} />
                                            </button>
                                            <div className="w-20 h-20 bg-[#070b14] text-slate-800 rounded-[2.8rem] flex items-center justify-center group-hover/item:bg-indigo-600 group-hover/item:text-white group-hover/item:shadow-2xl transition-all duration-700 border border-white/5">
                                                <IconMessageCircle size={36} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-48 text-center space-y-10 flex flex-col items-center justify-center grayscale group">
                                <IconBell size={72} stroke={1} className="text-slate-900" />
                                <p className="text-2xl font-black text-slate-800 uppercase tracking-[0.6em]">No Notices Found</p>
                            </div>
                        )}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500">
                        <div className="bg-[#0f172a] w-full max-w-2xl rounded-[4.5rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full translate-x-12 -translate-y-12"></div>

                            <div className="flex justify-between items-center mb-14 relative z-10 text-left">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl">
                                        <IconBroadcast size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">New Notice</h3>
                                        <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-3 leading-none">Send instructions to students</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                    <IconX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-10 relative z-10 font-sans uppercase tracking-widest text-left">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-6">Notice Subject</label>
                                    <input required type="text" placeholder="ENTER SUBJECT..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-900"
                                        value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-6">Category</label>
                                        <select className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-xl cursor-pointer"
                                            value={newNotice.type} onChange={e => setNewNotice({...newNotice, type: e.target.value})}>
                                            <option value="General" className="bg-[#0f172a]">GENERAL</option>
                                            <option value="Urgent" className="bg-[#0f172a]">URGENT</option>
                                            <option value="Academic" className="bg-[#0f172a]">ACADEMIC</option>
                                            <option value="Event" className="bg-[#0f172a]">EVENT</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-6">Send To</label>
                                        <select className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-10 py-6 text-sm font-black text-white appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-xl cursor-pointer"
                                            value={newNotice.audience} onChange={e => setNewNotice({...newNotice, audience: e.target.value})}>
                                            <option value="All Students" className="bg-[#0f172a]">ALL STUDENTS</option>
                                            <option value="Final Year" className="bg-[#0f172a]">FINAL YEAR</option>
                                            <option value="Faculty Only" className="bg-[#0f172a]">FACULTY ONLY</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-6">Notice Details</label>
                                    <textarea required rows={5} placeholder="WRITE DETAILS HERE..." className="w-full bg-[#070b14] border border-white/5 rounded-[3rem] px-10 py-8 text-sm font-medium text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-xl tracking-normal uppercase"
                                        value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-6">Attach PDF (Instructions)</label>
                                    <div className="relative group/file">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="pdf-upload"
                                        />
                                        <label
                                            htmlFor="pdf-upload"
                                            className="w-full bg-[#070b14] border-2 border-dashed border-white/5 rounded-3xl py-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all group-hover/file:scale-[1.02]"
                                        >
                                            {selectedFile ? (
                                                <div className="flex items-center gap-4 text-indigo-400">
                                                    <IconFileDescription size={32} />
                                                    <div className="text-left">
                                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">{selectedFile.name}</p>
                                                        <p className="text-[8px] font-bold text-slate-500 uppercase mt-2">Ready to upload</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center text-slate-700 group-hover:text-indigo-400 transition-colors">
                                                        <IconPaperclip size={24} />
                                                    </div>
                                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Click to attach instructions PDF</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={uploading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[4rem] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.5em] active:scale-95 mt-6 disabled:opacity-50">
                                    <IconSend size={24} /> {uploading ? "Broadcasting..." : "Release Notice"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
