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
        <main className="admin-feature-page admin-notices-page min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-6xl space-y-6 relative notices-workspace">
                <div className="absolute -right-8 -top-10 h-64 w-64 rounded-full bg-cyan-400/[0.06] blur-3xl pointer-events-none"></div>

                <header className="relative z-10 flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 text-left sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-100/15 bg-cyan-100/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100">
                            <IconSparkles size={13} /> Admin bulletin
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Notices</h1>
                        <p className="mt-1.5 text-sm text-slate-400">Send notices and instructions to students.</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    >
                        <IconPlus size={18} /> Post new notice
                    </button>
                </header>

                <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
                    <div className="notice-toolbar flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <IconBell size={17} className="text-cyan-100" /> Notice history
                        </div>
                        <div className="relative w-full sm:max-w-sm">
                            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                            <input
                                type="text"
                                placeholder="Search notices"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#081522] py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-100/30 focus:ring-2 focus:ring-cyan-100/10"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-white/[0.06] relative z-10 font-sans">
                        {loading ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                                <IconActivity size={25} className="animate-pulse text-cyan-100" stroke={1.5} />
                                <p className="text-sm text-slate-400">Loading notices...</p>
                            </div>
                        ) : filteredNotices.length > 0 ? (
                            filteredNotices.map((notice) => (
                                <article key={notice._id} className="notice-card p-5 text-left transition hover:bg-white/[0.02] sm:p-6">
                                        <div className="notice-card-layout flex flex-col justify-between gap-4 sm:flex-row">
                                        <div className="notice-card-content min-w-0 flex-1">
                                            <div className="notice-card-heading flex flex-wrap items-center gap-2.5">
                                                <span className={`notice-category rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                                                    notice.type === 'Urgent' ? 'border-rose-200/15 bg-rose-200/[0.07] text-rose-100' : 'border-cyan-100/15 bg-cyan-100/[0.06] text-cyan-100'
                                                }`}>{notice.type}</span>
                                                <h4 className="min-w-0 break-words text-base font-semibold text-white sm:text-lg">{notice.title}</h4>
                                            </div>
                                            <p className="notice-body mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-slate-300">
                                                {notice.content}
                                            </p>

                                            {notice.pdfUrl && (
                                                <div className="mt-4 flex items-center gap-3">
                                                    <a
                                                        href={`${API_URL}/public${notice.pdfUrl}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-100/[0.06]"
                                                    >
                                                        <IconFileDescription size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                        View Instructions PDF
                                                    </a>
                                                </div>
                                            )}

                                                <div className="notice-meta mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                <div className="notice-meta-item inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
                                                    <IconCalendar size={14} className="text-cyan-100" />
                                                    <span>{notice.date}</span>
                                                </div>
                                                <div className="notice-meta-item inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
                                                    <IconUser size={14} className="text-cyan-100" />
                                                    <span>{notice.audience}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="notice-actions flex items-start gap-2">
                                            <button
                                                onClick={() => handleDelete(notice._id)}
                                                className="rounded-lg border border-white/10 p-2.5 text-slate-400 transition hover:border-rose-200/20 hover:bg-rose-200/[0.06] hover:text-rose-200"
                                            >
                                                <IconTrash size={17} />
                                            </button>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-100/70">
                                                <IconMessageCircle size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                                <IconBell size={25} stroke={1.5} className="mb-3 text-slate-500" />
                                <p className="text-sm font-medium text-slate-300">No notices found</p>
                            </div>
                        )}
                    </div>
                </section>

                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500">
                        <div className="relative w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0c1a29] p-5 shadow-2xl sm:p-7 max-h-[90vh] custom-scrollbar">
                             <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-cyan-400/[0.06] blur-3xl"></div>

                            <div className="relative z-10 mb-6 flex items-center justify-between gap-4 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-100/10 bg-cyan-100/[0.07] text-cyan-100">
                                        <IconBroadcast size={21} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">New notice</h3>
                                        <p className="mt-1 text-xs text-slate-400">Send instructions to students</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} aria-label="Close notice form" className="rounded-lg border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
                                    <IconX size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="relative z-10 space-y-4 text-left">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Notice subject</label>
                                    <input required type="text" placeholder="Enter subject" className="w-full rounded-xl border border-white/10 bg-[#081522] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                                        value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-300">Category</label>
                                        <select className="w-full rounded-xl border border-white/10 bg-[#081522] px-3 py-2.5 text-sm text-white focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                                            value={newNotice.type} onChange={e => setNewNotice({...newNotice, type: e.target.value})}>
                                            <option value="General" className="bg-[#0f172a]">GENERAL</option>
                                            <option value="Urgent" className="bg-[#0f172a]">URGENT</option>
                                            <option value="Academic" className="bg-[#0f172a]">ACADEMIC</option>
                                            <option value="Event" className="bg-[#0f172a]">EVENT</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-300">Send to</label>
                                        <select className="w-full rounded-xl border border-white/10 bg-[#081522] px-3 py-2.5 text-sm text-white focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                                            value={newNotice.audience} onChange={e => setNewNotice({...newNotice, audience: e.target.value})}>
                                            <option value="All Students" className="bg-[#0f172a]">ALL STUDENTS</option>
                                            <option value="Final Year" className="bg-[#0f172a]">FINAL YEAR</option>
                                            <option value="Faculty Only" className="bg-[#0f172a]">FACULTY ONLY</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Notice details</label>
                                    <textarea required rows={5} placeholder="Write notice details" className="w-full resize-y rounded-xl border border-white/10 bg-[#081522] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                                        value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Attach PDF (instructions)</label>
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
                                            className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-[#081522] px-4 py-6 transition hover:border-cyan-100/30 hover:bg-white/[0.02]"
                                        >
                                            {selectedFile ? (
                                                <div className="flex items-center gap-3 text-cyan-100">
                                                    <IconFileDescription size={24} />
                                                    <div className="text-left">
                                                        <p className="break-all text-sm font-medium">{selectedFile.name}</p>
                                                        <p className="mt-1 text-xs text-slate-400">Ready to upload</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-slate-400">
                                                        <IconPaperclip size={20} />
                                                    </div>
                                                    <p className="text-xs text-slate-400">Click to attach instructions PDF</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" disabled={uploading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 disabled:opacity-50">
                                    <IconSend size={17} /> {uploading ? "Broadcasting..." : "Release notice"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
