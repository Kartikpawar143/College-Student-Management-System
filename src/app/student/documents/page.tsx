"use client";
import React, { useState } from "react";
import { 
    IconId, IconCertificate, IconFileText, IconDownload, 
    IconSearch, IconFilter, IconCloudDownload,
    IconLoader2, IconFolder
} from "@tabler/icons-react";

export default function StudentDocumentsPage() {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const docs = [
        { name: "College ID Card", type: "Identity Card", date: "2024-03-01", icon: IconId, color: "text-cyan-100" },
        { name: "Yearly Marksheet", type: "Academic", date: "2024-01-15", icon: IconFileText, color: "text-violet-200" },
        { name: "Bonafide Certificate", type: "Certificates", date: "2023-12-10", icon: IconCertificate, color: "text-rose-200" },
        { name: "College Fee Receipt", type: "Fee", date: "2023-08-20", icon: IconFileText, color: "text-emerald-200" },
    ];

    const filteredDocs = docs.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownload = (name: string) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(`Downloading ${name}...`);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative z-10">
                         <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                             <IconFolder size={13} /> My documents
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Documents</h1>
                        <p className="mt-2 text-sm text-slate-400">Access your academic records and credentials.</p>
                    </div>
                    <div className="relative z-10 w-full group sm:max-w-sm">
                        <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-100 transition-colors" size={17} />
                        <input 
                            type="text" 
                            placeholder="Search documents"
                            aria-label="Search documents"
                            className="w-full rounded-xl border border-white/10 bg-[#081522] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-100/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredDocs.map((doc, i) => (
                        <article key={i} className="group relative flex flex-col items-start rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20 hover:bg-[#102033]">
                            
                            <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] ${doc.color}`}>
                                <doc.icon size={21} stroke={1.7} />
                            </div>

                            <div className="relative z-10 mb-5 mt-4 space-y-2 font-sans">
                                <h2 className="text-base font-semibold text-white">{doc.name}</h2>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="rounded-md border border-cyan-100/10 bg-cyan-100/[0.06] px-2 py-1 text-xs text-cyan-100">{doc.type}</p>
                                    <p className="text-xs text-slate-400">{doc.date}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleDownload(doc.name)}
                                className="relative z-10 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 active:scale-[0.99]"
                            >
                                <IconCloudDownload size={17} /> Download
                            </button>
                        </article>
                    ))}

                    {filteredDocs.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0c1a29] px-5 py-14 text-center">
                            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400"><IconFolder size={22} /></span>
                            <div>
                                <p className="text-sm font-semibold text-slate-200">No documents found</p>
                                <p className="mt-1 text-xs text-slate-500">Try a different search term.</p>
                            </div>
                        </div>
                    )}
                </div>

                <section className="relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:flex-row sm:items-center sm:p-6">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-cyan-300/[0.05] blur-3xl"></div>
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-base font-semibold text-white">Need another document?</h2>
                        <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                            Contact the college office to request validation letters or official transcripts.
                        </p>
                    </div>
                    <button className="relative z-10 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-100/20 hover:bg-cyan-100/[0.05] active:scale-[0.99]">
                        Request a document
                    </button>
                </section>
            </div>
        </main>
    );
}
