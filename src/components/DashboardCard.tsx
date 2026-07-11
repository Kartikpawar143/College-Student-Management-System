"use client";
import React from "react";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";

import Link from "next/link";

interface CardProps {
    title: string;
    value: string | number;
    icon: any;
    color?: string; 
    description?: string;
    href?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
}

export default function DashboardCard({ title, value, icon: Icon, color = "text-blue-600", description, trend, href }: CardProps) {
    const bgColor = color.replace("text", "bg").replace("600", "50");
    const shadowColor = color.replace("text", "shadow").replace("600", "500/10");

    const CardContent = (
        <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-blue-900/5 transition-all duration-500 group flex flex-col h-full active:scale-[0.98] cursor-pointer overflow-hidden relative`}>
            <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} opacity-20 blur-3xl -translate-y-12 translate-x-12 rounded-full`}></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${bgColor} ${color} flex items-center justify-center shadow-2xl ${shadowColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={28} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                        trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                        {trend.positive ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
                    {description && (
                         <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">live sync</span>
                    )}
                </div>
                {description && (
                    <p className="text-slate-500 text-xs mt-3 font-medium leading-relaxed opacity-80">{description}</p>
                )}
            </div>

            <div className={`absolute bottom-0 left-0 w-full h-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${color.replace("text", "bg")}`}></div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block h-full">{CardContent}</Link>;
    }

    return CardContent;
}
