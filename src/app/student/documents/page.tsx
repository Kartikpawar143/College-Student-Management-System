"use client";
import React, { useState } from "react";
import { 
    IconId, IconCertificate, IconFileText, IconDownload, 
    IconSearch, IconFilter, IconCloudDownload,
    IconLoader2, IconCircleCheck, IconFolder
} from "@tabler/icons-react";

export default function StudentDocumentsPage() {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const docs = [
        { name: "College ID Card", type: "Identity Card", date: "2024-03-01", icon: IconId, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Yearly Marksheet", type: "Academic", date: "2024-01-15", icon: IconFileText, color: "text-indigo-600", bg: "bg-indigo-50" },
        { name: "Bonafide Certificate", type: "Certificates", date: "2023-12-10", icon: IconCertificate, color: "text-rose-600", bg: "bg-rose-50" },
        { name: "College Fee Receipt", type: "Fee", date: "2023-08-20", icon: IconFileText, color: "text-emerald-600", bg: "bg-emerald-50" },
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
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                             <IconFolder size={12} className="text-indigo-400" />
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Vault Repository</span>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Secretariat Records</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">Access and synchronize your encrypted academic credentials.</p>
                    </div>
                    <div className="relative group w-80 relative z-10">
                        <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="SEARCH VAULT..." 
                            className="w-full bg-[#0f172a] border border-white/5 rounded-[2rem] pl-14 pr-6 py-5 text-[10px] font-black tracking-[0.2em] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredDocs.map((doc, i) => (
                        <div key={i} className="bg-[#0f172a] p-12 rounded-[4rem] border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-[5rem] translate-x-12 -translate-y-12 group-hover:bg-indigo-600/10 transition-all duration-700"></div>
                            
                            <div className={`relative z-10 w-24 h-24 rounded-[2.5rem] bg-[#070b14] ${doc.color} flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-all duration-700 group-hover:rotate-6`}>
                                <doc.icon size={44} stroke={1.5} />
                            </div>

                            <div className="mt-10 mb-12 space-y-4 relative z-10 font-sans tracking-tight uppercase">
                                <h4 className="text-xl font-black text-white tracking-tighter leading-tight">{doc.name}</h4>
                                <div className="flex flex-col items-center gap-3">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-5 py-2 rounded-xl inline-block border border-indigo-500/10">{doc.type}</p>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] mt-2">{doc.date}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleDownload(doc.name)}
                                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.2)] transition-all active:scale-95 flex items-center justify-center gap-4 group-hover:shadow-indigo-500/40"
                            >
                                <IconCloudDownload size={22} stroke={2.5} /> Sync Node
                            </button>
                        </div>
                    ))}

                    {filteredDocs.length === 0 && (
                        <div className="col-span-full py-48 flex flex-col items-center justify-center space-y-10 bg-[#0f172a] rounded-[5rem] border-2 border-dashed border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                            <div className="p-8 bg-[#070b14] rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10 text-slate-800">
                                <IconFolder size={80} stroke={1} />
                            </div>
                            <div className="space-y-4 text-center relative z-10">
                                <p className="text-xl font-black text-slate-700 uppercase tracking-[0.5em]">Vault Records Empty</p>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Initialization failed for requested query.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-indigo-600 rounded-[4rem] p-14 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group shadow-[0_40px_80px_rgba(79,70,229,0.3)]">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white text-white opacity-10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="space-y-6 relative z-10">
                        <h3 className="text-4xl font-black tracking-tighter leading-none uppercase">Request Credential</h3>
                        <p className="max-w-md text-indigo-100/60 text-xs font-black leading-relaxed uppercase tracking-[0.05em]">
                            If your academic node requires specific validation letters or official transcripts, initiate a formal request through the Secretariat channel.
                        </p>
                    </div>
                    <button className="bg-white text-indigo-600 px-16 py-7 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-slate-100 hover:scale-105 transition-all shadow-2xl relative z-10 active:scale-95">
                        Initiate Request
                    </button>
                </div>
            </div>
        </main>
    );
}
