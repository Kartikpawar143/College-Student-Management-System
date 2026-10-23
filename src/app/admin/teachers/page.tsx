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

    return (
        <main className="admin-teachers-page mx-auto w-full max-w-7xl space-y-8 px-5 py-8 font-sans text-slate-200 sm:px-8 lg:space-y-10 lg:px-10">
            
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5 relative">
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-600/10 blur-[100px] rounded-full"></div>
                <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                         <IconSparkles size={10} className="text-cyan-400" />
                         <span className="text-[8px] font-black text-cyan-400 tracking-widest leading-none">Teacher Hub</span>
                    </div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight sm:text-4xl">Teacher management</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Manage faculty profiles and department assignments.
                    </p>
                </div>
                
                <button 
                    onClick={handleOpenAdd}
                    className="relative z-10 flex items-center justify-center gap-2 rounded-full bg-cyan-200 px-6 py-3.5 text-sm font-bold text-[#07111d] shadow-lg shadow-cyan-950/25 transition hover:-translate-y-0.5 hover:bg-white active:scale-95"
                >
                    <IconUserPlus size={18} /> Add teacher
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total teachers", val: teachers.length, icon: IconUsers, color: "text-cyan-200", bg: "bg-cyan-300/10", desc: "Faculty profiles" },
                    { label: "Departments", val: departmentCount, icon: IconBuilding, color: "text-sky-200", bg: "bg-sky-300/10", desc: "Departments represented" },
                    { label: "Complete profiles", val: completeProfileCount, icon: IconShieldCheck, color: "text-emerald-200", bg: "bg-emerald-300/10", desc: "Name, email, ID and phone" }
                ].map((stat, i) => (
                    <div key={i} className="teacher-stat-card group relative cursor-default overflow-hidden rounded-3xl border border-white/10 bg-[#0d1a29]/75 p-6 shadow-xl transition hover:border-cyan-200/20 sm:p-7">
                        <div className={`absolute top-0 right-0 w-16 h-16 ${stat.color.replace('text', 'bg')} opacity-5 blur-2xl -translate-y-8 translate-x-8 rounded-full`}></div>
                        <div className={`teacher-stat-icon mb-6 flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color} border border-white/5 shadow-sm`}>
                            <stat.icon size={20} />
                        </div>
                        <h4 className="mb-2 text-xs font-semibold text-slate-400">{stat.label}</h4>
                        <p className="mb-2 text-2xl font-semibold tracking-tight text-white">{stat.val}</p>
                        <p className="text-xs text-slate-500">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1a29]/75 shadow-2xl shadow-black/20 backdrop-blur-xl font-sans">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#07111d]/50">
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            Teacher Hub
                        </h3>
                        <p className="text-[9px] font-black text-slate-500 tracking-widest leading-none font-sans">Staff Registry</p>
                    </div>
                    
                    <div className="relative w-72 group/search hidden sm:block">
                        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find a teacher..." 
                            className="w-full bg-[#07111d] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-[10px] font-bold text-white outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-600" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-hide">
                    <table className="w-full text-left tracking-tight font-sans">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-6 text-[9px] font-black tracking-widest text-slate-500">Teacher Profile</th>
                                <th className="px-8 py-6 text-[9px] font-black tracking-widest text-slate-500">Department</th>
                                <th className="px-8 py-6 text-[9px] font-black tracking-widest text-slate-500 text-center">Emp ID</th>
                                <th className="px-8 py-6 text-[9px] font-black tracking-widest text-slate-500 text-center">Status</th>
                                <th className="px-8 py-6 text-[9px] font-black tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {teachers.map((teacher) => (
                                <tr key={teacher._id || teacher.id} className="group/row hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[1.3rem] bg-[#07111d] flex items-center justify-center font-black text-slate-700 text-lg border border-white/5 shadow-xl transition-all group-hover/row:bg-white group-hover/row:text-cyan-600">
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-sm tracking-tight group-hover/row:text-cyan-400 transition-colors leading-none">{teacher.name}</p>
                                                <p className="text-[9px] font-bold text-slate-600 lowercase mt-2 tracking-normal font-sans">{teacher.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[9px] font-black text-slate-400 tracking-widest bg-white/5 px-4 py-1.5 rounded-xl border border-white/5">{teacher.department || "General"}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="font-black text-white text-[10px] tracking-widest bg-[#07111d]/50 px-3 py-1 rounded-lg border border-white/5">{teacher.empId}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[8px] font-black tracking-widest text-emerald-500">Synced</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="teacher-row-actions flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all">
                                            <button 
                                                onClick={() => handleOpenEdit(teacher)}
                                                className="p-3 bg-[#07111d] border border-white/5 rounded-xl text-slate-400 hover:text-cyan-400 transition-all active:scale-90 shadow-sm"
                                            >
                                                <IconPencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(teacher._id || teacher.id)}
                                                className="p-3 bg-[#07111d] border border-white/5 rounded-xl text-slate-400 hover:text-rose-400 transition-all active:scale-90 shadow-sm"
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
        </main>
    );
}
