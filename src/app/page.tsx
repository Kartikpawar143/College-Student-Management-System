"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    IconArrowDown,
    IconArrowUpRight,
    IconBell,
    IconBook2,
    IconBriefcase,
    IconCalendarWeek,
    IconChevronRight,
    IconCircleCheck,
    IconDoorEnter,
    IconFingerprint,
    IconMenu2,
    IconSchool,
    IconShieldCheck,
    IconX,
} from "@tabler/icons-react";

const features = [
    {
        number: "01",
        title: "Attendance",
        description: "Review attendance records and use face verification to mark your presence.",
        icon: IconFingerprint,
        color: "text-cyan-300",
        wash: "bg-cyan-300/10",
    },
    {
        number: "02",
        title: "Class resources",
        description: "Find class notes, previous question papers, and useful student documents.",
        icon: IconBook2,
        color: "text-violet-300",
        wash: "bg-violet-300/10",
    },
    {
        number: "03",
        title: "Campus updates",
        description: "Keep up with notices, schedules, exam forms, and scholarship information.",
        icon: IconBell,
        color: "text-amber-300",
        wash: "bg-amber-300/10",
    },
    {
        number: "04",
        title: "Student services",
        description: "Submit gate pass requests and explore placement opportunities in one place.",
        icon: IconBriefcase,
        color: "text-emerald-300",
        wash: "bg-emerald-300/10",
    },
];

const navigation = [
    { label: "Overview", href: "#overview" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
];

export default function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-[#07111d] text-white selection:bg-cyan-300/30">
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-24 h-[34rem] w-[34rem] rounded-full bg-cyan-400/15 blur-[140px]" />
                <div className="absolute -right-40 top-[34rem] h-[36rem] w-[36rem] rounded-full bg-violet-500/15 blur-[150px]" />
                <div className="absolute left-1/3 top-[75rem] h-[28rem] w-[28rem] rounded-full bg-sky-400/10 blur-[140px]" />
            </div>
            <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-white/15 bg-[#0b1724]/65 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl" : "border-transparent bg-transparent py-5"}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
                    <Link href="/" className="group flex items-center gap-3" aria-label="GHRUA home">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-200 transition group-hover:bg-cyan-200/20">
                            <IconSchool size={23} stroke={1.7} />
                        </span>
                        <span>
                            <span className="block text-sm font-bold tracking-wide">GHRUA</span>
                            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Campus portal</span>
                        </span>
                    </Link>

                    <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
                        {navigation.map((item) => (
                            <a key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-cyan-200">
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        <Link href="/login" className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white">
                            Sign in
                        </Link>
                        <Link href="/login" className="group inline-flex items-center gap-2 rounded-full bg-cyan-200 px-5 py-2.5 text-sm font-bold text-[#07111d] transition hover:bg-white">
                            Open portal <IconArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-200 md:hidden"
                        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <IconX size={21} /> : <IconMenu2 size={21} />}
                    </button>
                </div>
                {menuOpen && (
                    <nav aria-label="Mobile navigation" className="mx-4 mt-3 rounded-2xl border border-white/15 bg-[#0d1a29]/75 p-3 shadow-xl backdrop-blur-2xl md:hidden">
                        {navigation.map((item) => (
                            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                                {item.label}
                            </a>
                        ))}
                        <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-3 text-sm font-bold text-[#07111d]">
                            Sign in to the portal <IconArrowUpRight size={17} />
                        </Link>
                    </nav>
                )}
            </header>

            <section id="overview" className="relative isolate px-5 pb-20 pt-36 sm:px-8 sm:pt-44 lg:pb-28 lg:pt-48">
                <div className="pointer-events-none absolute -left-44 top-20 -z-10 h-[32rem] w-[32rem] rounded-full bg-cyan-400/[0.08] blur-[130px]" />
                <div className="pointer-events-none absolute -right-40 top-48 -z-10 h-[28rem] w-[28rem] rounded-full bg-indigo-500/[0.11] blur-[130px]" />
                <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
                    <div className="relative z-10 max-w-2xl">
                        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-cyan-200/15 bg-cyan-200/[0.06] px-3.5 py-2 text-[11px] font-semibold tracking-wide text-cyan-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(165,243,252,0.9)]" />
                            Your campus, connected
                        </div>
                        <h1 className="max-w-xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
                            College life,
                            <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-300 bg-clip-text text-transparent">all in one place.</span>
                        </h1>
                        <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                            A simpler way to stay on top of attendance, class resources, campus notices, and the services that support your studies.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link href="/login" className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-200 px-7 py-3.5 text-sm font-bold text-[#07111d] shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-white">
                                Go to your portal <IconChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5">
                                Explore services <IconArrowDown size={16} />
                            </a>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-2"><IconCircleCheck size={15} className="text-cyan-200" /> Student resources</span>
                            <span className="inline-flex items-center gap-2"><IconShieldCheck size={15} className="text-cyan-200" /> Role-based portals</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[600px] lg:ml-auto">
                        <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-cyan-300/15 via-indigo-400/10 to-transparent blur-2xl" />
                        <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-[#111e2d] p-2 shadow-2xl shadow-black/40 sm:rounded-[2.2rem] sm:p-3">
                            <div className="relative aspect-[1.08/1] overflow-hidden rounded-[1.4rem] sm:rounded-[1.7rem]">
                                <img src="/hero.png" alt="Students studying together on campus" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#07111d]/80 via-[#07111d]/5 to-transparent" />
                                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#07111d]/55 px-3 py-2 text-[10px] font-semibold text-white backdrop-blur-md sm:left-7 sm:top-7 sm:text-xs">
                                    <IconCalendarWeek size={15} className="text-cyan-200" /> Ready for your day
                                </div>
                                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-[#08131f]/85 p-4 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">Student workspace</p>
                                            <p className="mt-1 text-sm font-semibold text-white sm:text-base">The essentials, within reach.</p>
                                        </div>
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-200/10 text-cyan-100 sm:h-12 sm:w-12"><IconSchool size={23} /></span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-[9px] font-medium text-slate-300 sm:text-[10px]">
                                        <span>Attendance</span><span>Resources</span><span>Notices</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#101e2d] px-4 py-3 shadow-xl sm:flex lg:-left-8">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200"><IconDoorEnter size={19} /></span>
                            <span><span className="block text-xs font-semibold text-white">Campus services</span><span className="mt-0.5 block text-[10px] text-slate-400">One convenient portal</span></span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="services" className="relative border-y border-white/[0.09] bg-white/[0.025] px-5 py-20 backdrop-blur-sm sm:px-8 lg:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">A better campus routine</p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">The tools you need, without the runaround.</h2>
                        </div>
                        <p className="max-w-sm text-sm leading-6 text-slate-400">Your student, teacher, and administration portals bring everyday campus workflows together.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <article key={feature.number} className="group rounded-2xl border border-white/10 bg-white/[0.055] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-100/25 hover:bg-white/[0.09] sm:p-7">
                                <div className="flex items-start justify-between">
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.wash} ${feature.color}`}><feature.icon size={22} stroke={1.7} /></span>
                                    <span className="text-xs font-medium tracking-widest text-slate-600">{feature.number}</span>
                                </div>
                                <h3 className="mt-7 text-lg font-semibold text-white">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="about" className="px-5 py-20 sm:px-8 lg:py-24">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/[0.06] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-[2rem]">
                        <img src="/campus_inner.jpg" alt="A shared space on campus" className="h-72 w-full rounded-[1.4rem] object-cover sm:h-96 sm:rounded-[1.7rem]" />
                        <div className="absolute bottom-5 left-5 rounded-xl border border-white/15 bg-[#07111d]/75 px-4 py-3 backdrop-blur-md sm:bottom-7 sm:left-7">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">Connected campus</p>
                            <p className="mt-1 text-sm font-medium text-white">Learning and services, together</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Built around campus life</p>
                        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">More time for learning. Less time chasing information.</h2>
                        <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                            GHRUA gives students and staff a shared digital space for academic updates and common campus tasks. Sign in to see the tools available for your role.
                        </p>
                        <div className="mt-7 space-y-3 text-sm text-slate-300">
                            <p className="flex items-center gap-3"><IconCircleCheck size={17} className="shrink-0 text-cyan-200" /> Personal dashboards for students, teachers, and administrators</p>
                            <p className="flex items-center gap-3"><IconCircleCheck size={17} className="shrink-0 text-cyan-200" /> Academic information and campus requests in one place</p>
                        </div>
                        <Link href="/login" className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white">
                            Sign in to continue <IconChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-5 pb-20 sm:px-8 lg:pb-24">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-[1.8rem] border border-cyan-100/20 bg-gradient-to-br from-cyan-100/[0.10] via-white/[0.055] to-indigo-300/[0.08] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-10 md:flex-row md:items-center lg:p-12">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Your campus starts here</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Sign in and get where you need to go.</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-400">Open the portal for your student, teacher, or administrator account.</p>
                    </div>
                    <Link href="/login" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cyan-200 px-6 py-3.5 text-sm font-bold text-[#07111d] transition hover:bg-white">
                        Continue to sign in <IconArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </section>

            <footer className="border-t border-white/[0.08] bg-[#06101a] px-5 py-8 sm:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-200/10 text-cyan-200"><IconSchool size={20} /></span>
                        <span className="text-sm font-semibold text-white">GHRUA</span>
                    </Link>
                    <p className="text-xs text-slate-500">A connected space for campus life.</p>
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 transition hover:text-cyan-200">Portal sign in <IconArrowUpRight size={14} /></Link>
                </div>
            </footer>
        </main>
    );
}
