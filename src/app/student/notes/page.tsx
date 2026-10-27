"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    IconFileDescription, IconSearch, IconFileDownload,
    IconBook, IconChevronRight, IconFilter, IconLoader2
} from "@tabler/icons-react";

export default function StudentNotesPage() {
    const { user } = useAuth();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");

    const fetchNotes = async () => {
        try {
            const branch = user?.department || "";
            const res = await api.get(`${endpoints.documents.getAll("note")}${branch ? `&branch=${branch}` : ""}`);

            const filtered = user?.department
                ? res.data.filter((f: any) => {
                    const studentDept = user.department?.trim().toUpperCase() || "";
                    const noteDept = f.branch?.trim().toUpperCase() || "";
                    return noteDept === studentDept || noteDept.includes(studentDept);
                })
                : res.data;
            setFiles(filtered);
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [user]);

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               file.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSem = selectedSemester === "all" || file.semester.toString() === selectedSemester;
        return matchesSearch && matchesSem;
    });

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative z-10">
                         <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                              <IconBook size={13} /> Study materials
                         </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Study notes</h1>
                        <p className="mt-2 text-sm text-slate-400">Notes shared by your teachers for your subjects.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {/* Filters Column */}
                    <div className="lg:col-span-3">
                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 relative overflow-hidden">
                             <h2 className="mb-4 flex items-center justify-between text-sm font-semibold text-white">
                                 Select Semester
                                 <IconFilter size={17} className="text-cyan-100" />
                             </h2>
                             <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                                {["all", "1", "2", "3", "4", "5", "6", "7", "8"].map(sem => (
                                    <button
                                        key={sem}
                                        onClick={() => setSelectedSemester(sem)}
                                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition ${
                                            selectedSemester === sem
                                            ? 'border-cyan-100/20 bg-cyan-100/[0.08] text-cyan-100'
                                            : 'border-white/[0.06] bg-white/[0.025] text-slate-400 hover:border-cyan-100/20 hover:text-white'
                                        }`}
                                    >
                                        {sem === "all" ? "All Semesters" : `Semester ${sem}`}
                                    </button>
                                ))}
                             </div>
                        </section>
                    </div>

                    {/* Main Content Column */}
                    <div className="space-y-5 lg:col-span-9">
                         <div className="relative group w-full">
                            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-100 transition-colors" size={17} />
                            <input
                                type="text"
                                placeholder="Search notes"
                                aria-label="Search notes"
                                className="w-full rounded-xl border border-white/10 bg-[#0c1a29] py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] min-h-[360px] flex flex-col relative">
                            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] p-4 sm:px-5">
                                 <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <IconFileDescription size={17} className="text-cyan-100" /> Study notes
                                </h2>
                                <span className="text-xs text-slate-400">{filteredFiles.length} files</span>
                            </div>

                            <div className="divide-y divide-white/[0.06] font-sans relative z-10">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                                        <IconLoader2 size={24} className="animate-spin text-cyan-100" stroke={1.5} />
                                        <p className="text-sm text-slate-400">Loading notes…</p>
                                    </div>
                                ) : filteredFiles.length > 0 ? (
                                    filteredFiles.map((file) => (
                                        <article key={file._id} className="group flex flex-col items-start justify-between gap-4 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:p-6">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-cyan-300/10 text-cyan-100">
                                                    <IconFileDescription size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="break-words text-sm font-semibold text-white transition-colors group-hover:text-cyan-100">{file.title}</h3>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                        <span className="rounded-md border border-cyan-100/10 bg-cyan-100/[0.06] px-2 py-1 text-cyan-100">{file.subject}</span>
                                                        <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1">Semester {file.semester}</span>
                                                        <span>{file.uploaderName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <a
                                                href={`${API_URL}/public${file.filePath}`}
                                                target="_blank"
                                                className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 sm:w-auto"
                                            >
                                                Download <IconFileDownload size={17} />
                                            </a>
                                        </article>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center px-5 py-14 text-center">
                                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400"><IconBook size={22} /></span>
                                        <p className="text-sm font-semibold text-slate-200">No notes found</p>
                                        <p className="mt-1 text-xs text-slate-500">Try another search or semester.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
