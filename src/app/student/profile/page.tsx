"use client";
import { useAuth } from "@/context/AuthContext";
import { 
    IconUserCircle, IconMail, IconId, IconPhone, IconSchool,
    IconCalendar, IconMapPin, IconEdit,
    IconCamera, IconCertificate, IconShieldCheck, IconBooks
} from "@tabler/icons-react";

export default function StudentProfilePage() {
    const { user } = useAuth();

    const stats = [
        { label: "Attendance", val: "84%", color: "text-emerald-200" },
        { label: "My CGPA", val: "8.92", color: "text-cyan-100" },
        { label: "Credits", val: "124", color: "text-violet-200" },
        { label: "Class Rank", val: "#04", color: "text-amber-100" },
    ];

    if (!user) return <main className="flex min-h-screen items-center justify-center bg-[#07111d] p-5 font-sans text-sm text-slate-400">Loading your profile…</main>;

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Profile Section */}
                <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    
                    <div className="relative z-10 flex w-full flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="relative group">
                            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#081522] p-1.5">
                                 {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="h-full w-full rounded-xl object-cover" />
                                 ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/[0.035] text-cyan-100">
                                        <IconUserCircle size={42} stroke={1.5} />
                                    </div>
                                 )}
                            </div>
                            <button aria-label="Change profile photo" className="absolute -bottom-2 -right-2 rounded-lg border border-[#102338] bg-cyan-200 p-2 text-[#07111d] transition hover:bg-cyan-100">
                                <IconCamera size={16} />
                            </button>
                        </div>

                        <div className="min-w-0 flex-1 space-y-3 font-sans text-white">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{user.name}</h1>
                                <div className="rounded-lg border border-cyan-100/15 bg-cyan-100/[0.06] p-1.5">
                                    <IconShieldCheck className="text-cyan-100" size={17} />
                                </div>
                            </div>
                            <div className="inline-flex flex-wrap items-center gap-2 text-xs text-slate-300">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 py-2">
                                    <IconSchool size={15} className="text-cyan-100" /> {user.department || "Department not assigned"}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 py-2">
                                    <IconId size={15} className="text-cyan-100" /> Roll no. {user.rollNo || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Section */}
                <div className="grid grid-cols-1 items-start gap-5 font-sans xl:grid-cols-[minmax(19rem,0.8fr)_minmax(0,1.6fr)]">
                    {/* Left Card */}
                    <div className="space-y-5">
                        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                             <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                                <IconUserCircle size={18} className="text-cyan-100" /> Personal details
                             </h2>
                             
                             <div className="divide-y divide-white/[0.06]">
                                {[
                                    { icon: IconMail, label: "Email address", val: user.email, color: "text-cyan-100" },
                                    { icon: IconPhone, label: "Mobile number", val: "+91 98XXX XXXXX", color: "text-emerald-200" },
                                    { icon: IconCalendar, label: "Admission year", val: "2021-22 session", color: "text-violet-200" },
                                    { icon: IconMapPin, label: "Current semester", val: `Semester ${user.semester || 1}`, color: "text-amber-100" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 py-3">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ${item.color}`}>
                                            <item.icon size={17} />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-1 text-left">
                                            <p className="text-xs text-slate-400">{item.label}</p>
                                            <p className="truncate text-sm text-slate-200">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>

                             <button className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-100/20 hover:text-white active:scale-[0.99]">
                                <IconEdit size={16} /> Edit profile
                             </button>
                        </section>

                        <section className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 sm:p-6">
                             <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
                                <IconCertificate size={18} className="text-cyan-100" /> My skills
                             </h2>
                            <div className="flex flex-wrap gap-2">
                                 {["Python", "Fullstack", "UI/UX", "Data Science"].map((skill, i) => (
                                     <span key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-xs text-slate-300">{skill}</span>
                                 ))}
                             </div>
                        </section>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-5">
                         <section aria-label="Academic summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                            {stats.map((stat, i) => (
                                <article key={i} className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20 hover:bg-[#102033]">
                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ${stat.color}`}>
                                         <span className="text-sm font-semibold">{stat.val}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-300">{stat.label}</p>
                                </article>
                            ))}
                         </section>

                         <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
                             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] p-4 sm:px-5">
                                 <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <IconBooks size={17} className="text-cyan-100" /> Exam results
                             </h2>
                                 <button className="inline-flex min-h-9 items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-100/20 hover:text-white">Get marksheet</button>
                             </div>
                             <div className="relative z-10 flex flex-col items-center justify-center px-5 py-12 text-center">
                                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400">
                                      <IconBooks size={22} />
                                  </span>
                                  <div>
                                      <p className="text-sm font-semibold text-slate-200">Results are not available yet</p>
                                      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">Your marksheet will appear here after it is uploaded by the college office.</p>
                                  </div>
                             </div>
                         </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
