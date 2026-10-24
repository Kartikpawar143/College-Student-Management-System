"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import {
    IconDoor, IconCheck, IconX, IconClock,
    IconUser, IconMapPin, IconCalendarEvent,
    IconSearch, IconShieldCheck, IconLogout2,
    IconFingerprint, IconScan, IconActivity, IconSparkles, IconLock, IconWalk
} from "@tabler/icons-react";

export default function AdminShortLeavesPage() {
    const [approvedPasses, setApprovedPasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchApprovedPasses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/gatepass/pending');
            setApprovedPasses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedPasses();
    }, []);

    const handleAction = async (id: string, newStatus: string) => {
        try {
            await api.put(endpoints.gatepass.approve(id, newStatus));
            setApprovedPasses(approvedPasses.filter(req => req._id !== id));
        } catch (err) {
            alert("Security Protocol Error");
        }
    };

    const filteredPasses = approvedPasses.filter(p =>
        p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.rollNo && p.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const studentsInQueue = new Set(approvedPasses.map(pass => pass.studentId || pass.studentName).filter(Boolean)).size;
    const requestsWithReason = approvedPasses.filter(pass => Boolean(pass.reason?.trim())).length;

    return (
        <main className="admin-feature-page admin-short-leaves-page min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6 relative short-leave-workspace">

                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
                    <div className="relative min-w-0">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                            <IconSparkles size={13} />
                            <span>Campus services</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Short leaves</h1>
                        <p className="mt-2 text-sm text-slate-400">Review student requests and record campus departures.</p>
                    </div>

                </header>

                {/* Tactical Stats Row */}
                <div className="short-leave-stats grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10 font-sans">
                    {[
                        { label: "Pending requests", val: approvedPasses.length, icon: IconClock, color: "text-cyan-200", bg: "bg-cyan-300/10" },
                        { label: "Students in queue", val: studentsInQueue, icon: IconUser, color: "text-cyan-200", bg: "bg-cyan-500/10" },
                        { label: "Requests with reason", val: requestsWithReason, icon: IconCheck, color: "text-emerald-200", bg: "bg-emerald-300/10" },
                        { label: "Search results", val: filteredPasses.length, icon: IconSearch, color: "text-amber-300", bg: "bg-amber-500/10" },
                    ].map((stat, i) => (
                        <div key={i} className="short-leave-stat flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 transition hover:border-cyan-100/20">
                            <div className={`short-leave-stat-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={21} stroke={1.8} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="short-leave-layout grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans relative z-10">
                    {/* Security Ledger */}
                    <div className="leave-queue-panel lg:col-span-8 bg-[#0c1a29] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col relative group">
                        <div className="leave-queue-toolbar px-5 py-4 sm:px-6 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] relative z-20">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Pending requests</h2>
                                <p className="mt-1 text-xs text-slate-500">Search by student name or roll number</p>
                            </div>
                            <div className="relative w-full sm:max-w-xs">
                                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-[#07111d]/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/40 focus:ring-4 focus:ring-cyan-200/10"
                                />
                            </div>
                        </div>

                        <div className="leave-queue-list flex-1 divide-y divide-white/5 relative z-10 font-sans uppercase">
                            {loading ? (
                                <div className="py-20 text-center flex flex-col items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-100">
                                        <IconScan size={23} stroke={1.7} />
                                    </div>
                                    <p className="text-sm text-slate-400">Loading short leave requests...</p>
                                </div>
                            ) : filteredPasses.length > 0 ? (
                                filteredPasses.map((request) => (
                                    <div key={request._id} className="leave-request-card p-5 sm:px-6 sm:py-5 group/item hover:bg-white/[0.025] transition-all relative overflow-hidden font-sans">
                                        <div className="leave-request-layout flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                                            <div className="leave-student flex items-start gap-3 min-w-0 font-sans">
                                                <div className="leave-avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#07111d] border border-white/[0.07] text-cyan-100">
                                                    <IconUser size={20} />
                                                </div>
                                                <div className="leave-details min-w-0 space-y-3 font-sans">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm font-semibold text-white group-hover/item:text-cyan-100 transition-colors">{request.studentName}</h3>
                                                        <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.07] px-2 py-1 text-[10px] font-medium text-amber-100">Pending</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-400 font-sans">
                                                        <span className="flex items-center gap-2 text-xs">
                                                            <IconCalendarEvent size={15} className="text-cyan-200" /> {request.date}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-xs">
                                                            <IconClock size={15} className="text-cyan-200" /> Departure: {request.departureTime || request.time}
                                                        </span>
                                                        <span className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                                                            request.reason?.length > 3 ? 'bg-[#07111d] text-slate-300 border-white/[0.07]' : 'bg-[#07111d] text-slate-500 border-white/[0.07]'
                                                        }`}>
                                                            {request.reason || "No reason provided"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="leave-actions flex items-center gap-2 relative z-10">
                                                <button
                                                    onClick={() => handleAction(request._id, 'Rejected')}
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 hover:text-rose-200 hover:bg-rose-300/10 hover:border-rose-300/20 transition"
                                                    title="Reject request"
                                                    aria-label={`Reject request from ${request.studentName}`}
                                                >
                                                    <IconX size={28} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(request._id, 'Exited')}
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 font-sans"
                                                    aria-label={`Confirm leave for ${request.studentName}`}
                                                >
                                                    <IconLogout2 size={16} /> Confirm leave
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 text-center space-y-4 flex flex-col items-center justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-100">
                                        <IconWalk size={24} stroke={1.6} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-300">{searchQuery ? "No matching requests" : "No pending short leaves"}</p>
                                        <p className="text-xs text-slate-500">{searchQuery ? "Try another name or roll number." : "New requests will appear here for review."}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Security Control Panel */}
                    <div className="lg:col-span-4 space-y-4 font-sans">
                        <div className="leave-rules-card bg-[#0c1a29] rounded-2xl p-5 sm:p-6 text-white border border-white/[0.08] relative overflow-hidden group transition-all hover:border-cyan-100/20">
                            <div className="flex items-center gap-3 mb-5 relative z-10">
                                <div className="flex h-10 w-10 items-center justify-center bg-cyan-300/10 rounded-xl text-cyan-100">
                                    <IconLock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold leading-none font-sans">Short leave guidelines</h3>
                                    <p className="text-xs text-slate-500 mt-1.5">Review notes</p>
                                </div>
                            </div>

                            <div className="space-y-5 font-sans relative z-10">
                                {[
                                    { title: "Validation Gate", desc: "All student short leaves require official registry verification." },
                                    { title: "Temporal Decay", desc: "Approved nodes automatically terminate after 180 minutes of inactivity." },
                                    { title: "Audit Persistence", desc: "Every egress event is permanently logged in the institutional ledger." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1.5 border-l-2 border-cyan-200/20 pl-3 py-1 font-sans group/rule hover:border-cyan-200/70 transition-all">
                                        <h4 className="text-sm font-medium text-slate-200">{item.title}</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="leave-clearance-card bg-[#0c1a29] border border-white/[0.08] rounded-2xl p-6 text-center group hover:border-cyan-100/20 transition-all font-sans relative overflow-hidden">
                             <div className="flex h-12 w-12 bg-cyan-300/10 text-cyan-100 rounded-xl mx-auto items-center justify-center mb-4">
                                <IconFingerprint size={24} stroke={1.6} />
                             </div>
                             <h3 className="text-sm font-medium text-slate-200 mb-1 font-sans">Admin access</h3>
                             <p className="text-xs text-slate-500">You can approve or reject queued requests.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
