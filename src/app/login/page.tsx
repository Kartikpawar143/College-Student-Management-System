"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    IconArrowLeft, IconArrowRight, IconBook2, IconCheck, IconFingerprint,
    IconLock, IconMail, IconSchool, IconShieldCheck, IconSparkles,
    IconUserCircle, IconUserStar,
} from "@tabler/icons-react";

const roles = [
    { id: "student", label: "Student", icon: IconUserCircle },
    { id: "teacher", label: "Teacher", icon: IconUserStar },
    { id: "admin", label: "Admin", icon: IconShieldCheck },
];

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login({ email, password, role });
            router.push(`/${role}/dashboard`);
        } catch {
            setError("We couldn't sign you in. Check your details and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative isolate flex min-h-screen overflow-hidden bg-[#07111d] text-white selection:bg-cyan-300/30">
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-[140px]" />
                <div className="absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-violet-500/10 blur-[150px]" />
            </div>

            <Link href="/" className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:border-white/20 hover:text-white sm:left-8 sm:top-7">
                <IconArrowLeft size={17} /> <span>Home</span>
            </Link>

            <section className="hidden w-1/2 flex-col justify-between border-r border-white/[0.08] px-12 py-10 lg:flex xl:px-20 xl:py-12">
                <Link href="/" className="flex w-fit items-center gap-3" aria-label="GHRUA home">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><IconSchool size={23} /></span>
                    <span><span className="block text-sm font-bold tracking-wide">GHRUA</span><span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Campus portal</span></span>
                </Link>

                <div className="mx-auto w-full max-w-xl py-12">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.06] px-3.5 py-2 text-[11px] font-semibold text-cyan-100">
                        <IconSparkles size={15} /> Your campus, connected
                    </div>
                    <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.055em] xl:text-6xl">Welcome back to <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-300 bg-clip-text text-transparent">your campus.</span></h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">Sign in to stay on top of class resources, campus notices, and the services that support your studies.</p>

                    <div className="mt-10 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-200/10 text-cyan-100"><IconFingerprint size={21} /></span>
                            <p className="mt-4 text-sm font-semibold">Everything in one place</p><p className="mt-1 text-xs leading-5 text-slate-400">Attendance, study materials, schedules, and more.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200"><IconBook2 size={21} /></span>
                            <p className="mt-4 text-sm font-semibold">Made for your role</p><p className="mt-1 text-xs leading-5 text-slate-400">A focused workspace for students and staff.</p>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-500">A simpler way to keep campus life moving.</p>
            </section>

            <section className="flex min-h-screen w-full items-center justify-center px-5 pb-10 pt-24 sm:px-8 lg:w-1/2 lg:px-12 lg:py-16">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <Link href="/" className="inline-flex items-center gap-3" aria-label="GHRUA home">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><IconSchool size={23} /></span>
                            <span><span className="block text-sm font-bold">GHRUA</span><span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Campus portal</span></span>
                        </Link>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/10 bg-[#0d1a29]/80 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Welcome back</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[2.1rem]">Sign in to your portal</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-400">Choose your account type and enter your sign-in details.</p>
                        </div>

                        <div className="mt-7 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#07111d]/70 p-1.5" aria-label="Account type">
                            {roles.map((item) => (
                                <button key={item.id} type="button" onClick={() => setRole(item.id)} aria-pressed={role === item.id}
                                    className={`flex min-h-14 items-center justify-center gap-2 rounded-xl px-2 text-xs font-semibold transition sm:min-h-12 sm:text-sm ${role === item.id ? "bg-cyan-200 text-[#07111d] shadow-lg shadow-cyan-950/25" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"}`}>
                                    <item.icon size={17} /> <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
                                <div className="relative">
                                    <IconMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input id="email" required type="email" autoComplete="username" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#07111d]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/50 focus:ring-4 focus:ring-cyan-200/10" />
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="password" className="text-sm font-medium text-slate-200">Password</label></div>
                                <div className="relative">
                                    <IconLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input id="password" required type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#07111d]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/50 focus:ring-4 focus:ring-cyan-200/10" />
                                </div>
                            </div>

                            {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.08] px-4 py-3 text-sm text-rose-200">{error}</p>}

                            <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3.5 text-sm font-bold text-[#07111d] shadow-lg shadow-cyan-950/25 transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-60">
                                {loading ? "Signing in…" : <>Sign in <IconArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
                            </button>
                        </form>

                        <div className="mt-6 flex items-start gap-3 border-t border-white/[0.08] pt-5 text-xs leading-5 text-slate-400">
                            <IconCheck size={17} className="mt-0.5 shrink-0 text-cyan-200" /> Your account type helps us open the right campus workspace.
                        </div>
                        <p className="mt-5 text-center text-sm text-slate-400">Need an account? <Link href="/signup" className="font-semibold text-cyan-200 transition hover:text-white">Get started</Link></p>
                    </div>
                    <p className="mt-5 text-center text-xs text-slate-500">Secure access for students and campus staff</p>
                </div>
            </section>
        </main>
    );
}
