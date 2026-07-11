"use client";
import React, { useState } from "react";
import { 
    IconSettings, IconUser, IconBell, IconShieldLock, 
    IconDatabase, IconPalette, IconCloudUpload, IconChevronRight,
    IconDeviceFloppy, IconLogout
} from "@tabler/icons-react";

export default function AdminSettingsPage() {
    return (
        <main className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">System Settings</h2>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Configure SmartCampus parameters and profiles</p>
                </div>
                <button className="bg-blue-600 hover:bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest active:scale-95">
                    <IconDeviceFloppy size={18} /> Save Configurations
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Menu */}
                <div className="lg:col-span-4 space-y-2">
                    {[
                        { icon: IconUser, label: "Admin Profile", active: true },
                        { icon: IconShieldLock, label: "Security & Privacy", active: false },
                        { icon: IconBell, label: "Notification Triggers", active: false },
                        { icon: IconPalette, label: "Interface & Themes", active: false },
                        { icon: IconDatabase, label: "Data Management", active: false },
                        { icon: IconCloudUpload, label: "Cloud Syncing", active: false },
                    ].map((item, idx) => (
                        <button key={idx} className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all ${
                            item.active ? 'bg-white shadow-xl shadow-slate-100 border border-slate-100' : 'hover:bg-white/50 text-slate-400'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            </div>
                            <IconChevronRight size={16} className={item.active ? 'text-blue-600' : 'text-slate-200'} />
                        </button>
                    ))}
                    
                    <button className="w-full flex items-center gap-4 p-6 rounded-3xl text-rose-500 hover:bg-rose-50 transition-all mt-8">
                         <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                            <IconLogout size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Logout Session</span>
                    </button>
                </div>

                {/* Form Content */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-10">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase mb-2">Profile Credentials</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manage your administrative access details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Identity Name</label>
                           <input type="text" defaultValue="Administrator" className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] px-6 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Emp Index ID</label>
                           <input type="text" defaultValue="ADM-9021-X" className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] px-6 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Verified Email</label>
                           <input type="email" defaultValue="admin@smartcampus.ai" className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] px-6 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secure Password</label>
                           <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] px-6 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase mb-6">Security Protocols</h3>
                        <div className="space-y-6">
                            {[
                                { label: "Two-Factor Biometrics", desc: "Requires face scan for login every 24 hours.", status: true },
                                { label: "Automatic Session Termination", desc: "Logs out after 15 minutes of inactivity.", status: false },
                                { label: "Cloud Backup Engine", desc: "Sync all records to the secure node at midnight.", status: true },
                            ].map((toggle, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">{toggle.label}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{toggle.desc}</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${toggle.status ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggle.status ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
