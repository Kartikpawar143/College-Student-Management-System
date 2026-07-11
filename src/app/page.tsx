"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    IconLogin, IconUserScan, IconChevronRight, IconPhone, IconMail, IconMapPin, 
    IconSchool, IconUsers, IconActivity,
    IconShieldCheck, IconRocket, IconSettings,
    IconUserPlus, IconChartPie, IconBell, IconSearch, IconAdjustmentsHorizontal, IconCircleCheck,
    IconTarget, IconHeart, IconFingerprint, IconGps, IconCloudCode, IconTimeline, IconStar,
    IconFileUpload, IconDoor, IconMessageCircle
} from "@tabler/icons-react";

export default function Home() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="min-h-screen bg-[#070b14] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            
            {/* Header / Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <IconSchool size={20} stroke={2.5} />
                        </div>
                        <div className="leading-tight text-left">
                            <h1 className="text-lg font-black tracking-tight uppercase">DPCOE Studion</h1>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Student Management system</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {['Features', 'About Us', 'Stats', 'Contact'].map(link => (
                            <button 
                                key={link} 
                                onClick={() => scrollToSection(link.toLowerCase().replace(' ', '-'))}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                                {link}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all hidden sm:flex items-center gap-2">
                             <IconLogin size={16} stroke={2} /> Login
                        </Link>
                        <Link href="/login" className="px-5 py-2.5 bg-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                             <IconUserPlus size={16} stroke={2} /> Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 lg:pt-56 pb-24 px-6 relative overflow-hidden text-center lg:text-left">
                <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-600/5 blur-[180px] rounded-full -z-10"></div>
                <div className="absolute top-[30%] right-[0%] w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full -z-10"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10 animate-fade-in z-10">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mx-auto lg:mx-0">
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">All-In-One College App</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1] tracking-tighter uppercase">
                            Your College <br />
                            <span className="text-indigo-500">Made Easy.</span> <br />
                            <span className="text-white/40 text-4xl lg:text-5xl">Simple & Fast.</span>
                        </h1>

                        <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                            Check regular attendance, get your notes, see late notices, and talk with teachers. One simple app for everything you need daily.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                            <Link href="/login" className="px-8 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/40 group active:scale-95">
                                Get Started <IconChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/login" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center hover:bg-white/10 transition-all text-slate-300 active:scale-95">
                                View Features
                            </Link>
                        </div>
                    </div>

                    <div className="relative group z-10 perspective-1000">
                        <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-3xl opacity-50 transition duration-1000"></div>
                        <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                             <img 
                                src="/hero.png" 
                                alt="DPCOE Studion" 
                                className="w-full h-auto object-cover transform transition-transform duration-[3s] hover:scale-105"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-transparent to-transparent"></div>
                        </div>
                        
                        <div className="absolute top-8 right-8 p-4 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-float">
                             <div className="flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                 <span className="text-[9px] font-black uppercase tracking-widest">System Online</span>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 relative px-6 bg-[#0a101d]">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.5em]">Simple Tools</h2>
                        <h3 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase leading-tight">Everything You Need <br/> In One Simple Place</h3>
                        <p className="text-slate-500 text-base">We use easy tools to make your daily college life much faster.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        {[
                            { title: "Fast Attendance", desc: "Mark your presence in just 2 seconds with a quick scan. No more waiting!", icon: IconUserScan, color: "text-indigo-400" },
                            { title: "Study Notes", desc: "Download all class notes and old exam papers easily to study better.", icon: IconFileUpload, color: "text-purple-400" },
                            { title: "Quick Alerts", desc: "Get important news and college notices directly on your mobile app.", icon: IconBell, color: "text-emerald-400" },
                            { title: "Easy Gate Pass", desc: "Apply for leave or a gate pass with just one simple tap on your phone.", icon: IconDoor, color: "text-amber-400" },
                            { title: "Staff Help", desc: "Talk directly to your teachers and clear your doubts in real-time.", icon: IconMessageCircle, color: "text-blue-400" },
                            { title: "Safe & Secure", desc: "All your personal data is kept safe and private under your control.", icon: IconShieldCheck, color: "text-rose-400" },
                        ].map((feature, i) => (
                            <div key={i} className="group p-10 rounded-[2.5rem] bg-[#0f172a] border border-white/5 hover:border-indigo-500/20 hover:shadow-2xl transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-all ${feature.color}`}>
                                    <feature.icon size={28} />
                                </div>
                                <h4 className="text-lg font-black mb-3 uppercase tracking-tighter">{feature.title}</h4>
                                <p className="text-slate-500 text-xs leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about-us" className="py-32 relative px-6 overflow-hidden text-left">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                         <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                             <img 
                                src="/about_us.png" 
                                alt="About Us" 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                             />
                         </div>
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.5em]">Who We Are</h2>
                        <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none uppercase">Helping Students <br/> Learn Better</h3>
                        <p className="text-slate-400 text-base leading-relaxed">
                            We believe that apps should make college life easy, not hard. Our mission is to replace old-style work with simple digital tools that are easy for everyone to use.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-indigo-400 uppercase text-[9px] font-black tracking-widest">
                                    <IconTarget size={16} /> Our Goal
                                </div>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed">To give every student a simple dashboard for all their daily tasks.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-purple-400 uppercase text-[9px] font-black tracking-widest">
                                    <IconHeart size={16} /> Why Us
                                </div>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed">Because we keep things simple, fast, and very easy for students to use.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-32 bg-[#070b14] border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Partner Colleges", val: "500+", icon: IconSchool },
                            { label: "Active Students", val: "50k+", icon: IconUsers },
                            { label: "Quick Tracking", val: "2 Sec", icon: IconActivity },
                            { label: "System Uptime", val: "99.9%", icon: IconShieldCheck }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-3">
                                <stat.icon size={28} className="mx-auto text-indigo-500" />
                                <h5 className="text-4xl font-black tracking-tighter uppercase">{stat.val}</h5>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="py-24 px-6 border-t border-white/5 bg-[#0a101d] text-left">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <IconSchool size={22} stroke={2.5} />
                            </div>
                            <h4 className="text-xl font-black tracking-tighter uppercase">DPCOE Studion</h4>
                        </div>
                        <p className="text-slate-500 text-xs max-w-xs leading-relaxed font-medium">Student Management system built to make your daily college life easy and fast.</p>
                        <div className="flex gap-4">
                             {[IconPhone, IconMail, IconMapPin].map((Icon, i) => (
                                 <div key={i} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors border border-white/5">
                                     <Icon size={16} />
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-[10px] font-black uppercase tracking-widest">
                         <div className="space-y-6">
                             <h5 className="text-white">Help Items</h5>
                             <ul className="space-y-3 text-slate-500">
                                 <li className="hover:text-indigo-400 cursor-pointer">Support Hub</li>
                                 <li className="hover:text-indigo-400 cursor-pointer">System Status</li>
                                 <li className="hover:text-indigo-400 cursor-pointer">App Guide</li>
                             </ul>
                         </div>
                         <div className="space-y-6">
                             <h5 className="text-white">Quick Info</h5>
                             <ul className="space-y-3 text-slate-500">
                                 <li className="hover:text-indigo-400 cursor-pointer">Contact Us</li>
                                 <li className="hover:text-indigo-400 cursor-pointer">Privacy</li>
                                 <li className="hover:text-indigo-400 cursor-pointer">Terms</li>
                             </ul>
                         </div>
                    </div>

                    <div className="space-y-6">
                         <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Get Updates</h5>
                         <div className="relative">
                             <input 
                                type="text" 
                                placeholder="Your Email Address" 
                                className="w-full bg-[#0f172a] border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-bold text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:uppercase"
                             />
                             <button className="absolute right-2 top-2 px-4 py-2 bg-indigo-600 rounded-xl text-[8px] font-black uppercase tracking-widest">Sign Up</button>
                         </div>
                         <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Stay updated with newest campus news.</p>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </main>
    );
}
