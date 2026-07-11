"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
    IconLogin, IconUserCircle, IconUserStar, IconShieldLock, 
    IconArrowRight, IconSchool, IconCheck, IconMail, IconLock,
    IconSparkles, IconUserPlus, IconId, IconArrowLeft
} from "@tabler/icons-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Unified login data using Email and Password for all roles
            const loginData = { email, password, role };
            await login(loginData);
            router.push(`/${role}/dashboard`);
        } catch (err) {
            alert("Login Failed. Please check your Email and Password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#070b14] flex font-sans selection:bg-indigo-500/30 overflow-hidden">
            
            {/* Left: Branding & Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 overflow-hidden border-r border-white/5 bg-[#0a101d]">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent"></div>
                <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full"></div>
                
                <div className="relative z-10 space-y-10 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                            <IconSchool size={28} />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase font-sans leading-none">DPCOE Studion</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] leading-none mt-2">Student Management System</p>
                    </div>
                    
                    <div className="space-y-4 font-sans uppercase">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <IconSparkles size={12} className="text-indigo-400" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Safe Sign In</span>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                            Smart <br />
                            <span className="text-indigo-500">Campus App.</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-bold leading-relaxed max-w-md normal-case">
                            One unified gateway to access your attendance, recruitment pipelines, and academic documents daily.
                        </p>
                    </div>

                    <div className="p-8 bg-[#0f172a] rounded-[2.5rem] border border-white/5 inline-flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full"></div>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <IconCheck size={24} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-white font-black uppercase text-xs tracking-tight">Access Node Verified</h4>
                                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-1">Synchronization: Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative bg-[#070b14]">
                <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                
                {/* Back to Home Button */}
                <div className="absolute top-8 left-8 z-20">
                    <Link 
                        href="/" 
                        className="flex items-center gap-3 px-5 py-2.5 bg-[#0f172a] border border-white/5 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:border-indigo-500/30 transition-all active:scale-95 shadow-2xl shadow-[#070b14]"
                    >
                        <IconArrowLeft size={14} stroke={3} />
                        Home
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-12 relative z-10 uppercase font-sans mt-20 lg:mt-0">
                    <div className="text-center lg:text-left space-y-4">
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Authentication</h3>
                        <p className="text-slate-500 font-black uppercase text-[9px] tracking-[0.4em]">Initialize identity synchronization</p>
                    </div>

                    {/* Role Selector */}
                    <div className="grid grid-cols-3 gap-3 p-2 bg-[#0f172a] rounded-[2.2rem] border border-white/5">
                        {[
                            { id: "student", label: "Student", icon: IconUserCircle },
                            { id: "teacher", label: "Teacher", icon: IconUserStar },
                            { id: "admin", label: "Admin", icon: IconShieldLock }
                        ].map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                className={`flex flex-col items-center gap-3 py-5 rounded-[1.8rem] transition-all duration-500 ${
                                    role === r.id 
                                    ? "bg-indigo-600 text-white shadow-[0_20px_40px_rgba(79,70,229,0.3)]" 
                                    : "text-slate-600 hover:text-white"
                                }`}
                            >
                                <r.icon size={22} stroke={2.5} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{r.label}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 group/form">
                        <div className="space-y-8">
                            <div className="space-y-3 group/input text-left">
                                <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-6 transition-colors group-focus-within/input:text-indigo-500">Official Email ID</label>
                                <div className="relative">
                                    <IconMail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                                    <input 
                                        required
                                        type="email" 
                                        placeholder="institutional@mail.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-white/5 rounded-[2.5rem] pl-20 pr-8 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 transition-all placeholder:text-slate-900 lowercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 group/input text-left">
                                <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-6 transition-colors group-focus-within/input:text-indigo-500">Security Password</label>
                                <div className="relative">
                                    <IconLock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within/input:text-indigo-500 transition-colors" size={20} />
                                    <input 
                                        required
                                        type="password" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-white/5 rounded-[2.5rem] pl-20 pr-8 py-6 text-sm font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/20 transition-all placeholder:text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-white text-[#0f172a] py-8 rounded-[4rem] font-black uppercase text-[11px] tracking-[0.5em] flex items-center justify-center gap-6 hover:bg-indigo-600 hover:text-white transition-all shadow-3xl active:scale-95 disabled:opacity-50 group shadow-indigo-500/5 mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center gap-4">CONNECTING...</span>
                            ) : (
                                <span className="flex items-center gap-4">Log into Hub <IconArrowRight size={22} className="group-hover:translate-x-2 transition-transform" /></span>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-10">
                        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em] inline-block mr-3">Access Denied?</p>
                        <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all border-b-2 border-indigo-500/10 pb-1">Request Credentials</button>
                    </div>
                </div>
            </div>
        </main>
    );
}
