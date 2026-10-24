"use client";
import React, { useEffect, useState } from "react";
import { api, endpoints } from "@/lib/api";
import {
    IconCheck, IconClock, IconCalendarEvent,
    IconActivity, IconShieldCheck, IconSparkles, IconPlaneDeparture, IconWalk, IconScan
} from "@tabler/icons-react";

export default function TeacherApprovalsPage() {
    const [activeTab, setActiveTab] = useState('leave');
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [gateRequests, setGateRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [leaveRes, gateRes] = await Promise.all([
                api.get(endpoints.leave.pending),
                api.get(endpoints.gatepass.pending)
            ]);
            setLeaveRequests(leaveRes.data);
            setGateRequests(gateRes.data);

            // Fetch all for history (optional, or just fetch on tab click)
            const allGateRes = await api.get('/gatepass/pending'); // This only gets pending, we need a better route for history
            // Actually, we should call a general history route if it exists
        } catch (err) {
            console.error("Failed to fetch approvals", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            // Since we don't have a global history route yet, we'll fetch all recorded gatepasses
            // In a real app, you'd have /gatepass/all
            // For now, let's just show what we have
        } catch (err) {}
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLeaveAction = async (id: string, newStatus: string) => {
        try {
            await api.put(endpoints.leave.approve(id, newStatus));
            setLeaveRequests(leaveRequests.filter(req => req._id !== id));
        } catch (err) {
            alert("Action failed");
        }
    };

    const handleGateAction = async (id: string, newStatus: string) => {
        try {
            await api.put(endpoints.gatepass.approve(id, newStatus));
            setGateRequests(gateRequests.filter(req => req._id !== id));
        } catch (err) {
            alert("Action failed");
        }
    };

    const currentRequests = activeTab === 'leave' ? leaveRequests : gateRequests;

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <header className="flex flex-col gap-5 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-end sm:justify-between sm:p-7">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100/15 bg-cyan-100/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-100"><IconSparkles size={13} /> Requests &amp; approvals</span>
                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Review student requests</h1>
                        <p className="mt-1.5 text-sm text-slate-400">Check the details and record your decision.</p>
                    </div>
                    <div className="inline-flex w-fit rounded-xl border border-white/[0.08] bg-[#081522]/70 p-1">
                        <button type="button" onClick={() => {setActiveTab('leave'); setShowHistory(false)}} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${activeTab === 'leave' && !showHistory ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}>Absence <span className="ml-1.5 text-xs opacity-75">{leaveRequests.length}</span></button>
                        <button type="button" onClick={() => {setActiveTab('gate'); setShowHistory(false)}} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${activeTab === 'gate' && !showHistory ? 'bg-cyan-200 text-[#07111d]' : 'text-slate-400 hover:text-white'}`}>Short leaves <span className="ml-1.5 text-xs opacity-75">{gateRequests.length}</span></button>
                    </div>
                </header>

                <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                            <IconActivity size={17} className="text-cyan-100" />
                            <h2 className="text-sm font-semibold text-white">Pending {activeTab === 'leave' ? 'absence requests' : 'short leave requests'}</h2>
                        </div>
                        <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400">{currentRequests.length} pending</span>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-3 px-5 py-14 text-center">
                            <IconScan size={28} className="animate-pulse text-cyan-100" stroke={1.5} />
                            <p className="text-sm text-slate-400">Loading requests…</p>
                        </div>
                    ) : currentRequests.length > 0 ? (
                        <div className="divide-y divide-white/[0.06]">
                            {currentRequests.slice().reverse().map((request) => (
                                <article key={request._id} className="grid grid-cols-1 gap-5 p-5 transition hover:bg-white/[0.02] sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                                    <div className="flex min-w-0 gap-3.5">
                                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] ${activeTab === 'leave' ? 'bg-amber-300/10 text-amber-100' : 'bg-cyan-300/10 text-cyan-100'}`}>
                                            {activeTab === 'leave' ? <IconPlaneDeparture size={19} /> : <IconWalk size={19} />}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base font-semibold text-white">{request.studentName || request.userName}</h3>
                                                <span className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[11px] text-slate-400">{request.rollNo || 'N/A'}</span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
                                                <span className="inline-flex items-center gap-1.5"><IconCalendarEvent size={14} className="text-cyan-100" />{activeTab === 'leave' ? `${request.start_date} – ${request.end_date}` : (request.date || 'Today')}</span>
                                                {activeTab === 'gate' && <span className="inline-flex items-center gap-1.5"><IconClock size={14} className="text-amber-100" />{request.departureTime || request.time}</span>}
                                            </div>
                                            <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#081522]/70 px-4 py-3">
                                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reason</p>
                                                <p className="break-words text-sm leading-relaxed text-slate-300">{request.reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 lg:flex-col">
                                        <button type="button" onClick={() => activeTab === 'leave' ? handleLeaveAction(request._id, 'Rejected') : handleGateAction(request._id, 'Rejected')} className="min-h-10 flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-rose-300/25 hover:bg-rose-300/10 hover:text-rose-100 lg:min-w-32">Deny</button>
                                        <button type="button" onClick={() => activeTab === 'leave' ? handleLeaveAction(request._id, 'Approved') : handleGateAction(request._id, 'Approved')} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-4 py-2 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 lg:min-w-32"><IconCheck size={16} /> Approve</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200/10 bg-emerald-200/[0.06] text-emerald-100"><IconShieldCheck size={23} /></span>
                            <h3 className="text-sm font-semibold text-slate-200">You&apos;re all caught up</h3>
                            <p className="mt-1 text-xs text-slate-500">There are no pending {activeTab === 'leave' ? 'absence' : 'short leave'} requests.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
