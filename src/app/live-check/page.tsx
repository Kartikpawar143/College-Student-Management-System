"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { api, endpoints } from "@/lib/api";
import { IconUser, IconScan, IconCheck, IconX, IconShieldCheck, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function LiveCheckPage() {
    const webcamRef = useRef<Webcam>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [lastCheckTime, setLastCheckTime] = useState(0);
    const [matchResult, setMatchResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const captureAndCheck = useCallback(async () => {
        if (!webcamRef.current || !isScanning) return;

        const now = Date.now();
        if (now - lastCheckTime < 1500) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        setLastCheckTime(now);

        try {
            const res = await api.post(endpoints.attendance.recognize, { image: imageSrc });

            if (res.data.status === "success") {
                setMatchResult(res.data.student);
                setErrorMsg("");
            } else {
                setMatchResult(null);
                if (res.data.message === "Unknown Student") {
                    setErrorMsg("Unknown Student");
                } else {
                    setErrorMsg("");
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [isScanning, lastCheckTime]);

    useEffect(() => {
        const interval = setInterval(captureAndCheck, 1000);
        return () => clearInterval(interval);
    }, [captureAndCheck]);

    return (
        <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-8 selection:bg-indigo-500/30 overflow-hidden relative font-sans">
            
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl w-full z-10 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="flex items-center gap-6">
                        <div className="bg-[#0f172a] p-4 rounded-3xl text-indigo-400 border border-white/5 shadow-3xl shadow-indigo-600/10 group-hover:rotate-6 transition-all">
                            <IconShieldCheck size={32} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Biometric Gateway</h1>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-500/80">Institutional Verification Phase</p>
                        </div>
                     </div>
                     <Link href="/" className="px-8 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-2xl">
                        <IconArrowLeft size={18} /> RETURN TO NEXUS
                     </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* Viewport */}
                    <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5 aspect-video bg-black group">
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0"
                            videoConstraints={{ facingMode: "user" }}
                            mirrored={true}
                        />
                        
                        {/* Status Overlays */}
                        <div className="absolute inset-0 pointer-events-none border-[20px] border-[#070b14]/40"></div>
                        <div className="absolute top-10 left-10 flex items-center gap-4 bg-[#070b14]/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_15px_#f43f5e]"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">LIVE SENSOR ACTIVE</span>
                        </div>
                        
                        <div className="absolute bottom-10 right-10 text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 backdrop-blur-xl bg-[#070b14]/60 px-6 py-3 rounded-2xl border border-white/5 shadow-3xl">
                            NODE: SC-V01
                        </div>

                        {/* Focusing Frame */}
                        <div className="absolute inset-x-[20%] inset-y-[10%] border border-indigo-500/10 rounded-[3rem] transition-all duration-700 group-hover:border-indigo-500/30">
                            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-indigo-500 rounded-tl-3xl"></div>
                            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-indigo-500 rounded-tr-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-indigo-500 rounded-bl-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-indigo-500 rounded-br-3xl"></div>
                        </div>
                    </div>

                    {/* Recognition Data Panel */}
                    <div className="bg-[#0f172a] rounded-[4rem] p-16 border border-white/5 flex flex-col justify-center items-center text-center shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative min-h-[500px] overflow-hidden group/panel">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                        
                        {matchResult ? (
                            <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 w-full relative z-10">
                                <div className="w-48 h-48 mx-auto rounded-[3.5rem] p-1 bg-indigo-500/20 mb-10 shadow-3xl relative">
                                    <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full animate-pulse"></div>
                                    <div className="w-full h-full rounded-[3.2rem] bg-[#070b14] overflow-hidden border-4 border-[#070b14] relative z-10">
                                        <img
                                            src={matchResult.profileImage ? `http://localhost:8001${matchResult.profileImage}` : "https://ui-avatars.com/api/?background=4f46e5&color=fff&name=" + matchResult.name}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                            alt={matchResult.name}
                                        />
                                    </div>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4 uppercase leading-none">{matchResult.name}</h2>
                                <div className="inline-block px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-12">
                                    <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] leading-none">
                                        {matchResult.department || "IDENTIFIED NODE"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 text-left">
                                    {[
                                        { label: "Identity Sync", val: matchResult.email },
                                        { label: "Operational Contact", val: matchResult.phone || "UNREGISTERED" }
                                    ].map((field, i) => (
                                        <div key={i} className="p-8 bg-[#070b14]/50 rounded-[2.5rem] border border-white/5 group/row hover:border-indigo-500/20 transition-all shadow-xl">
                                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] mb-2">{field.label}</p>
                                            <p className="text-white font-black tracking-tight text-sm uppercase opacity-90">{field.val}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-12 flex items-center justify-center gap-4 text-emerald-400">
                                     <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                                        <IconCheck size={20} />
                                     </div>
                                     <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">IDENTITY VERIFIED</span>
                                </div>
                            </div>
                        ) : errorMsg === "Unknown Student" ? (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-700 relative z-10">
                                <div className="w-24 h-24 mx-auto bg-rose-500/10 rounded-[2rem] flex items-center justify-center mb-10 border border-rose-500/20 shadow-3xl">
                                    <IconX size={44} className="text-rose-500" />
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-6 uppercase">Node Unrecognized</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs mx-auto opacity-70">
                                    Credentials not identified within the institutional registry. Initiate support protocol or retry synchronization.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-12 py-20 relative z-10">
                                <div className="relative group/scan">
                                    <div className="w-32 h-32 mx-auto bg-[#070b14] rounded-[2.5rem] flex items-center justify-center border border-white/5 animate-pulse shadow-3xl">
                                        <IconScan size={56} className="text-indigo-400 opacity-60 group-hover/scan:scale-110 transition-transform" />
                                    </div>
                                    <div className="absolute -inset-6 border border-indigo-500/10 rounded-[3rem] animate-ping opacity-20"></div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
                                            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                                            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Awaiting Signal</h3>
                                    <p className="text-[9px] uppercase font-black tracking-[0.5em] text-slate-700">Scan for Registry Sync</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
