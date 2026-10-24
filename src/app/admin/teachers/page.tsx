"use client";
import React, { useState, useEffect } from "react";
import {
    IconUserPlus, IconUsers, IconUserCheck, IconTrash,
    IconMail, IconId, IconPhone, IconChevronRight, IconLock,
    IconPencil, IconX, IconBuilding, IconSparkles, IconShieldCheck,
    IconArrowUpRight, IconSearch, IconActivity
} from "@tabler/icons-react";
import { api } from "@/lib/api";

export default function AdminTeachersPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "Computer Tech",
        empId: "",
        phone: "",
        password: ""
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await api.get("/teachers/");
            setTeachers(res.data);
        } catch (err) {
            console.error("Failed to fetch teachers", err);
        }
    };

    const handleOpenAdd = () => {
        setIsEditMode(false);
        setEditingId(null);
        setFormData({ name: "", email: "", department: "Computer Tech", empId: "", phone: "", password: "" });
        setShowModal(true);
    };

    const handleOpenEdit = (teacher: any) => {
        setIsEditMode(true);
        setEditingId(teacher._id || teacher.id);

        // Map legacy branch names to new standards
        let dept = teacher.department || "IT";
        if (dept === "Computer Tech" || dept === "Computer Engineering") dept = "CS";
        if (dept === "Information Technology") dept = "IT";
        if (dept === "Electronics") dept = "ENTC";

        setFormData({
            name: teacher.name,
            email: teacher.email,
            department: dept,
            empId: teacher.empId,
            phone: teacher.phone,
            password: ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode && editingId) {
                const updateData = { ...formData };
                if (!updateData.password) delete (updateData as any).password;
                await api.put(`/teachers/${editingId}`, updateData);
            } else {
                await api.post("/teachers/add", formData);
            }
            setShowModal(false);
            fetchTeachers();
        } catch (err: any) {
            alert(err.response?.data?.detail || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this teacher account?")) return;
        try {
            await api.delete(`/teachers/${id}`);
            fetchTeachers();
        } catch (err) {
            alert("Failed to delete teacher");
        }
    };

    const departmentCount = new Set(teachers.map(teacher => teacher.department?.trim() || "General")).size;
    const completeProfileCount = teachers.filter(teacher => teacher.name && teacher.email && teacher.empId && teacher.phone).length;
    const filteredTeachers = teachers.filter(teacher =>
        [teacher.name, teacher.email, teacher.department, teacher.empId, teacher.phone].some(value =>
            String(value || "").toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <main className="admin-teachers-page min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Header Section */}
            <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
                <div className="relative min-w-0">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                         <IconSparkles size={13} />
                         <span>Faculty records</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Teachers</h1>
                    <p className="mt-2 text-sm text-slate-400">Manage faculty profiles and department assignments.</p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                >
                    <IconUserPlus size={18} /> Add teacher
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                    { label: "Total teachers", val: teachers.length, icon: IconUsers, color: "text-cyan-200", bg: "bg-cyan-300/10", desc: "Faculty profiles" },
                    { label: "Departments", val: departmentCount, icon: IconBuilding, color: "text-sky-200", bg: "bg-sky-300/10", desc: "Departments represented" },
                    { label: "Complete profiles", val: completeProfileCount, icon: IconShieldCheck, color: "text-emerald-200", bg: "bg-emerald-300/10", desc: "Name, email, ID and phone" }
                ].map((stat, i) => (
                    <div key={i} className="teacher-stat-card flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5">
                        <div className={`teacher-stat-icon mb-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div className="min-w-0"><h4 className="text-sm font-medium text-slate-400">{stat.label}</h4>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{stat.val}</p>
                        <p className="mt-1 text-xs text-slate-500">{stat.desc}</p></div>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] font-sans">
                <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Faculty directory</h2>
                        <p className="mt-1 text-xs text-slate-500">{filteredTeachers.length} of {teachers.length} teacher records</p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                        <input
                            type="text"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Search teachers..."
                            className="w-full rounded-xl border border-white/10 bg-[#07111d]/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/40 focus:ring-4 focus:ring-cyan-200/10"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-hide">
                    <table className="w-full text-left tracking-tight font-sans">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-5 py-3.5 text-xs font-medium text-slate-400 sm:px-6">Teacher</th>
                                <th className="px-5 py-3.5 text-xs font-medium text-slate-400 sm:px-6">Department</th>
                                <th className="px-5 py-3.5 text-xs font-medium text-slate-400 sm:px-6">Employee ID</th>
                                <th className="px-5 py-3.5 text-xs font-medium text-slate-400 sm:px-6">Status</th>
                                <th className="px-5 py-3.5 text-right text-xs font-medium text-slate-400 sm:px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTeachers.map((teacher) => (
                                <tr key={teacher._id || teacher.id} className="group/row hover:bg-white/5 transition-all duration-300">
                                    <td className="px-5 py-4 sm:px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#07111d] text-sm font-semibold text-cyan-100 transition group-hover/row:border-cyan-200/20">
                                                {(teacher.name || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white transition-colors group-hover/row:text-cyan-100">{teacher.name}</p>
                                                <p className="mt-1 text-xs text-slate-500">{teacher.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 sm:px-6">
                                        <span className="rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300">{teacher.department || "General"}</span>
                                    </td>
                                    <td className="px-5 py-4 sm:px-6">
                                        <span className="rounded-lg border border-white/[0.07] bg-[#07111d]/70 px-2.5 py-1.5 text-xs font-medium text-slate-300">{teacher.empId}</span>
                                    </td>
                                    <td className="px-5 py-4 sm:px-6">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-300"></div>
                                            <span className="text-xs text-emerald-200">Synced</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-right sm:px-6">
                                        <div className="teacher-row-actions flex justify-end gap-2 opacity-100 transition sm:opacity-0 sm:group-hover/row:opacity-100 sm:group-focus-within/row:opacity-100">
                                            <button
                                                onClick={() => handleOpenEdit(teacher)}
                                                aria-label={`Edit ${teacher.name}`}
                                                className="rounded-lg border border-white/[0.07] bg-[#07111d] p-2.5 text-slate-400 transition hover:text-cyan-200"
                                            >
                                                <IconPencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher._id || teacher.id)}
                                                aria-label={`Delete ${teacher.name}`}
                                                className="rounded-lg border border-white/[0.07] bg-[#07111d] p-2.5 text-slate-400 transition hover:text-rose-300"
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTeachers.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-sm text-slate-500">{search ? "No teachers match your search." : "No teachers have been added yet."}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#07111d]/90 backdrop-blur-xl animate-in fade-in duration-500 font-sans">
                    <div className="bg-[#0d1a29] w-full max-w-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full translate-x-12 -translate-y-12"></div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${isEditMode ? 'bg-cyan-600 text-white' : 'bg-[#07111d] text-cyan-400 border border-white/5'} rounded-xl flex items-center justify-center shadow-xl`}>
                                    <IconUserPlus size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight ">{isEditMode ? "Change Profile" : "Add Teacher"}</h3>
                                    <p className="text-slate-500 font-bold text-[9px] tracking-widest mt-1">Teacher registration node</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-rose-400 transition-all p-3 bg-[#07111d] rounded-xl border border-white/5">
                                <IconX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 tracking-tight">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 tracking-widest ml-3">Full Member Name</label>
                                    <input required type="text" placeholder="Dr. Sarah Doe" className="w-full bg-[#07111d] border border-white/5 rounded-xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans "
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 tracking-widest ml-3">Employee ID</label>
                                    <input required type="text" placeholder="T-FAC-01" className="w-full bg-[#07111d] border border-white/5 rounded-xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans "
                                        value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 tracking-widest ml-3">Working Email ID</label>
                                <input required type="email" placeholder="faculty@college.edu" className="w-full bg-[#07111d] border border-white/5 rounded-xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans lowercase"
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 tracking-widest ml-3">Department Hub</label>
                                    <select className="w-full bg-[#07111d] border border-white/5 rounded-xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans pointer-events-auto cursor-pointer"
                                        value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                                        {["IT", "CS", "ENTC", "Automobile"].map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 tracking-widest ml-3">Access Secret</label>
                                    <input type="password" placeholder={isEditMode ? "Keep empty" : "••••••••"} className="w-full bg-[#07111d] border border-white/5 rounded-xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 tracking-widest ml-3">Phone Node</label>
                                <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-[#07111d] border border-white/5 rounded-xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-sans"
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>

                            <div className="pt-6">
                                <button type="submit" disabled={loading} className={`w-full ${isEditMode ? 'bg-cyan-600' : 'bg-white text-[#0d1a29]'} hover:opacity-90 font-black py-5 rounded-[2.5rem] shadow-xl transition-all flex items-center justify-center gap-4 text-[10px] tracking-widest active:scale-95 disabled:opacity-50`}>
                                    {loading ? "Syncing..." : isEditMode ? "Update Hub" : "Add Teacher Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
          </div>
        </main>
    );
}
