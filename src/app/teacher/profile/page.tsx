"use client";
import React from "react";
import { 
    IconUser, IconMail, IconPhone, IconBuildingCommunity,
    IconMilitaryRank, IconCertificate, IconShieldLock, IconDeviceFloppy,
    IconCamera, IconEdit, IconLogout
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";

export default function TeacherProfilePage() {
    const { user } = useAuth();

    return (
        <main className="teacher-profile min-h-screen bg-[#07111d] p-5 space-y-6 font-sans text-slate-200 sm:p-7 xl:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-semibold text-white tracking-tight leading-tight">My profile</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage your account and faculty information.</p>
                </div>
                <button className="bg-cyan-200 hover:bg-cyan-100 text-[#07111d] font-semibold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm relative z-10">
                    <IconDeviceFloppy size={18} /> Save profile
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-[#0f172a] rounded-[3.5rem] p-10 border border-white/5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-[#070b14] border-b border-white/5"></div>
                        
                        <div className="relative mt-12 mb-8">
                            <div className="w-24 h-24 rounded-2xl bg-[#0f172a] border-4 border-[#0f172a] flex items-center justify-center text-slate-400 overflow-hidden">
                                <IconUser size={48} />
                            </div>
                            <button aria-label="Edit profile image" className="absolute bottom-1 right-1 p-2.5 bg-cyan-200 text-[#07111d] rounded-xl transition-all border-2 border-[#0f172a]">
                                <IconCamera size={18} />
                            </button>
                        </div>

                        <h2 className="text-xl font-semibold text-white tracking-tight">{user?.name || "Academic Holder"}</h2>
                        <p className="text-xs font-medium text-cyan-100 mt-2 px-3 py-1.5 bg-cyan-100/[0.05] rounded-full border border-cyan-100/10">Faculty · {user?.department || "CS"} branch</p>
                        
                        <div className="w-full grid grid-cols-2 gap-4 mt-12 pt-12 border-t border-white/5 uppercase tracking-widest">
                            <div className="p-5 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Node ID</p>
                                <p className="text-xs font-black text-white tracking-widest">TCH-9021</p>
                            </div>
                            <div className="p-5 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Sync Date</p>
                                <p className="text-xs font-black text-white tracking-widest">JUL 2021</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-full transition-all group-hover:bg-indigo-600/10"></div>
                        <h3 className="text-xl font-black tracking-tight uppercase mb-8 flex items-center gap-4 text-white">
                            <IconShieldLock className="text-indigo-500" /> Protocol Shield
                        </h3>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-6 bg-[#070b14] border border-white/5 rounded-2xl hover:bg-white/5 transition-all group/item shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">2-Factor Auth</span>
                                <div className="w-10 h-5 bg-indigo-600 rounded-full relative"><div className="absolute right-1.5 top-1.5 w-2 h-2 bg-white rounded-full"></div></div>
                            </button>
                            <button className="w-full flex items-center justify-between p-6 bg-[#070b14] border border-white/5 rounded-2xl hover:bg-white/5 transition-all shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rotate Password</span>
                                <IconEdit size={16} className="text-slate-700" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Information Tabs */}
                <div className="lg:col-span-8 bg-[#0c1a29] rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-8 relative overflow-hidden">
                     <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                     
                     <section className="space-y-10 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#070b14] text-indigo-400 flex items-center justify-center border border-white/5 shadow-2xl">
                                <IconUser size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none">Core Identity</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 leading-none">Basic account registration data</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 uppercase tracking-widest">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Full Identity</label>
                                <input type="text" defaultValue={user?.name} className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Sync Email</label>
                                <input type="email" defaultValue={user?.email} className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all lowercase" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Encrypted Comms</label>
                                <input type="text" placeholder="+91 98765-XXXXX" className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Registry Branch</label>
                                <input type="text" defaultValue={user?.department} className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase" />
                            </div>
                        </div>
                     </section>

                     <section className="space-y-10 pt-14 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#070b14] text-indigo-400 flex items-center justify-center border border-white/5 shadow-2xl">
                                <IconCertificate size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none">Pedagogical details</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 leading-none">Your background and skills</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Skill Matrix</label>
                                <div className="flex flex-wrap gap-3 mt-3 uppercase tracking-widest">
                                    {["Neural Networks", "Data Structures", "Cloud Computing", "AI Systems"].map((tag, i) => (
                                        <span key={i} className="px-6 py-3 bg-[#070b14] text-white border border-white/5 rounded-full text-[10px] font-black shadow-xl tracking-widest">{tag}</span>
                                    ))}
                                    <button className="px-6 py-3 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 rounded-full text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all hover:shadow-2xl hover:shadow-indigo-600/20 tracking-widest">Add Capability</button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Academic Level</label>
                                <input type="text" defaultValue="Ph.D in Systems Engineering" className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Legacy Record</label>
                                <input type="text" defaultValue="12+ Years Teaching" className="w-full bg-[#070b14] border border-white/5 rounded-[2rem] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase" />
                            </div>
                        </div>
                     </section>

                     <button className="w-full flex items-center gap-6 p-8 rounded-[3rem] bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all group relative z-10 shadow-xl">
                         <div className="w-14 h-14 rounded-2xl bg-[#070b14] flex items-center justify-center shadow-2xl text-rose-500 group-hover:bg-rose-400 group-hover:text-white group-hover:scale-110 transition-all border border-white/5">
                            <IconLogout size={28} />
                        </div>
                        <div className="text-left uppercase tracking-widest">
                            <span className="text-xs font-black uppercase tracking-[0.3em] block">Terminate Session</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1 block">Seal and sign out of node</span>
                        </div>
                    </button>
                </div>
            </div>
          </div>
        </main>
    );
}
