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
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                              <IconBook size={12} className="text-indigo-400" />
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Study Materials</span>
                         </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Study Notes</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">Download and read study notes shared by your teachers for your subjects.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Filters Column */}
                    <div className="lg:col-span-1 space-y-10">
                        <div className="bg-[#0f172a] rounded-[3.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-[5rem] translate-x-12 -translate-y-12"></div>
                             <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] mb-12 flex items-center justify-between uppercase tracking-widest leading-none">
                                 Select Semester
                                 <IconFilter size={18} />
                             </h4>
                             <div className="space-y-3 font-black tracking-widest uppercase">
                                {["all", "1", "2", "3", "4", "5", "6", "7", "8"].map(sem => (
                                    <button 
                                        key={sem}
                                        onClick={() => setSelectedSemester(sem)}
                                        className={`w-full text-left px-8 py-5 rounded-[2rem] text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border-2 ${
                                            selectedSemester === sem 
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_20px_40px_rgba(79,70,229,0.3)]' 
                                            : 'bg-[#070b14]/40 text-slate-700 border-white/5 hover:border-indigo-500/30 hover:bg-[#070b14]/80'
                                        }`}
                                    >
                                        {sem === "all" ? "All Semesters" : `Semester ${sem}`}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* Main Content Column */}
                    <div className="lg:col-span-3 space-y-10">
                         <div className="relative group w-full">
                            <IconSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-indigo-500 transition-colors" size={24} />
                            <input 
                                type="text" 
                                placeholder="SEARCH NOTES..." 
                                className="w-full bg-[#0f172a] border border-white/5 rounded-[3rem] pl-20 pr-10 py-7 text-[11px] font-black uppercase tracking-[0.3em] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans placeholder:text-slate-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="bg-[#0f172a] rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative">
                             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10 uppercase tracking-widest uppercase font-black">
                                 <h3 className="text-[11px] font-black text-slate-700 flex items-center gap-4 uppercase tracking-[0.4em]">
                                    <IconFileDescription size={20} className="text-indigo-500" /> ALL NOTES ({filteredFiles.length})
                                </h3>
                            </div>

                            <div className="divide-y divide-white/5 font-sans relative z-10">
                                {loading ? (
                                    <div className="py-48 text-center flex flex-col items-center gap-8">
                                        <div className="p-8 bg-[#070b14] rounded-full border border-white/5 shadow-2xl">
                                            <IconLoader2 size={44} className="animate-spin text-indigo-500" stroke={1.5} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800">Loading notes...</p>
                                    </div>
                                ) : filteredFiles.length > 0 ? (
                                    filteredFiles.map((file) => (
                                        <div key={file._id} className="p-12 group hover:bg-white/5 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-12 cursor-default">
                                            <div className="flex items-center gap-10 w-full md:w-auto">
                                                <div className="w-20 h-20 rounded-[2.5rem] bg-[#070b14] text-indigo-500 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-600">
                                                    <IconFileDescription size={40} stroke={1.5} />
                                                </div>
                                                <div className="space-y-4 uppercase tracking-tighter">
                                                    <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase leading-none">{file.title}</h4>
                                                    <div className="flex flex-wrap items-center gap-8">
                                                        <span className="text-[10px] font-black text-slate-700 tracking-[0.2em] group-hover:text-slate-400 transition-colors">{file.subject}</span>
                                                        <span className="text-[10px] font-black text-slate-800 tracking-[0.2em]">SEM {file.semester}</span>
                                                        <span className="text-[10px] font-black text-slate-800 tracking-[0.2em]">TEACHER: {file.uploaderName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <a 
                                                href={`${API_URL}/public${file.filePath}`}
                                                target="_blank"
                                                className="w-full md:w-auto bg-indigo-600 text-white rounded-[2.5rem] px-14 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 flex items-center justify-center gap-4 group-hover:shadow-indigo-500/40"
                                            >
                                                DOWNLOAD <IconFileDownload size={22} stroke={2.5} />
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-60 text-center space-y-10 flex flex-col items-center justify-center group">
                                         <div className="p-12 bg-[#070b14] rounded-[3.5rem] border border-white/5 shadow-2xl group-hover:scale-110 transition-all duration-700">
                                            <IconBook size={80} stroke={1} className="text-slate-800" />
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-xl font-black text-slate-800 uppercase tracking-[0.5em]">No Notes Found</p>
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">We couldn't find any notes for your search.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
