"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { api, endpoints } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
    IconCamera, IconCheck, IconX, IconShieldCheck, 
    IconUserScan, IconHistory, IconAlertCircle, IconLoader2,
    IconMapPin, IconMapPinOff
} from "@tabler/icons-react";

export default function StudentAttendancePage() {
    const { user } = useAuth();
    const webcamRef = useRef<Webcam>(null);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [result, setResult] = useState<{ status: string; message: string; student?: any } | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);

    const fetchAttendanceHistory = async () => {
        if (!user?.id) return;

        try {
            const res = await api.get(`/attendance/student/${user.id}`);
            setAttendanceHistory(res.data.reverse().slice(0, 5));
        } catch (err) {
            console.error("Failed to fetch attendance history", err);
        }
    };

    // Watch location for real-time accuracy
    useEffect(() => {
        fetchAttendanceHistory();
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log("Location Update:", newLocation);
                    setLocation(newLocation);
                    setLocationError(null);
                },
                (err) => {
                    console.error("Location error:", err);
                    setLocationError("Please enable location access to mark attendance.");
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setLocationError("Geolocation is not supported by your browser.");
        }
    }, []);

    const capture = useCallback(async () => {
        if (!location) {
            alert("Location access is required to prevent proxy attendance. Please enable GPS.");
            return;
        }

        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await api.post(endpoints.attendance.mark, { 
                image: imageSrc,
                lat: location.lat,
                lng: location.lng,
                studentId: user?.id
            });
            setResult(response.data);
            if (response.data.status === 'success') {
                fetchAttendanceHistory();
            }
        } catch (error: any) {
            setResult({ 
                status: "failed", 
                message: error.response?.data?.detail || "Verification failed. Try again in good light." 
            });
        } finally {
            setLoading(false);
            setTimeout(() => setResult(null), 5000);
        }
    }, [webcamRef, location, user]);

    return (
        <main className="min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
            <div className="mx-auto max-w-7xl space-y-6 relative text-left">
                
                <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="relative z-10">
                         <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                              <IconShieldCheck size={13} />
                              <span>Attendance</span>
                         </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Mark attendance</h1>
                        <p className="mt-2 text-sm text-slate-400">Verify your location and scan your face to record attendance.</p>
                    </div>

                    <div className={`relative z-10 flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                        location ? 'bg-emerald-300/[0.06] border-emerald-200/15 text-emerald-200' : 'bg-rose-300/[0.06] border-rose-200/15 text-rose-200'
                    }`}>
                        {location ? <IconMapPin size={24} className="animate-bounce" /> : <IconMapPinOff size={24} className="animate-pulse" />}
                        <div className="text-left font-sans">
                            <p className="text-xs font-semibold leading-none mb-1">{location ? 'Location connected' : 'Location required'}</p>
                            <p className="text-[11px] text-slate-400 leading-none">
                                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Enable location access'}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,1fr)]">
                    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29] relative group font-sans">
                        <div className="relative h-[360px] bg-[#07111d] overflow-hidden sm:h-[440px]">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover grayscale brightness-110 contrast-125 opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[2000ms]"
                                videoConstraints={{ facingMode: "user" }}
                            />

                            {/* Scanner Architecture */}
                            <div className="absolute inset-0 border-[24px] border-[#07111d]/70 pointer-events-none sm:border-[36px]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 border-2 border-cyan-200/30 rounded-3xl animate-pulse sm:h-72 sm:w-72">
                                 <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cyan-200 rounded-tl-2xl"></div>
                                 <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cyan-200 rounded-tr-2xl"></div>
                                 <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cyan-200 rounded-bl-2xl"></div>
                                 <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cyan-200 rounded-br-2xl"></div>
                            </div>
                            
                            {loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b14]/95 z-30 backdrop-blur-3xl animate-in fade-in duration-700">
                                    <div className="relative mb-6 h-20 w-20">
                                         <IconLoader2 size={80} className="animate-spin text-cyan-200 opacity-25" />
                                         <IconUserScan size={36} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-100 animate-pulse" />
                                    </div>
                                    <p className="text-sm font-medium text-white animate-pulse">Verifying attendance...</p>
                                </div>
                            )}

                            {result && (
                                <div className={`absolute inset-0 flex flex-col items-center justify-center z-40 backdrop-blur-[80px] animate-in zoom-in-95 duration-1000 ${
                                    result.status === 'success' ? 'bg-emerald-600/5' : 'bg-rose-600/5'
                                }`}>
                                    <div className={`p-16 rounded-[5rem] ${
                                        result.status === 'success' ? 'bg-[#0f172a] border-emerald-500/30 shadow-[0_60px_120px_rgba(0,0,0,0.9)]' : 'bg-[#0f172a] border-rose-500/30 shadow-[0_60px_120px_rgba(0,0,0,0.9)]'
                                    } border-4 flex flex-col items-center gap-10 max-w-md text-center relative overflow-hidden`}>
                                        <div className={`w-32 h-32 ${
                                            result.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        } rounded-[2.5rem] flex items-center justify-center border-2 shadow-2xl`}>
                                            {result.status === 'success' ? <IconCheck size={64} stroke={4} /> : <IconX size={64} stroke={4} />}
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{result.status === 'success' ? 'Access Granted' : 'Access Denied'}</h3>
                                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed px-8">{result.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-start justify-between gap-5 border-t border-white/[0.07] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:p-6 font-sans">
                            <div className="flex items-center gap-3 text-left">
                                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-cyan-100">
                                    <IconMapPin size={19} />
                                 </div>
                                 <div className="space-y-2">
                                     <p className="text-sm font-medium text-slate-200">Campus location check</p>
                                     <p className="mt-1 text-xs text-slate-400">Your location is checked before attendance is recorded.</p>
                                 </div>
                            </div>
                            <button 
                                onClick={capture}
                                disabled={loading || !!result || !location}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                            >
                                <IconCamera size={28} stroke={3} /> Mark Attendance
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
                         <div className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 text-white sm:p-6 relative overflow-hidden group font-sans text-left">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white relative z-10">
                                <IconShieldCheck size={19} className="text-cyan-100" /> Attendance requirements
                            </h3>
                            <div className="space-y-3 relative z-10">
                                {[
                                    { title: "Physical Presence", desc: "You must be within 500m of the college campus node." },
                                    { title: "Location Access", desc: "Keep GPS/Location enabled while marking attendance." },
                                    { title: "Face Recognition", desc: "Live camera scan must match your registered profile." },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 group/item">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-100 text-xs font-semibold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-200">{item.title}</h4>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {attendanceHistory.length > 0 && (
                            <div className="rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5 text-white relative overflow-hidden group font-sans text-left sm:p-6">
                                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold relative z-10">
                                    <IconHistory size={19} className="text-emerald-200" /> Recent attendance
                                </h3>
                                <div className="space-y-3 relative z-10">
                                    {attendanceHistory.map((log, i) => (
                                        <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 flex items-center justify-between hover:border-emerald-200/20 transition-all group/log">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-200">{log.date}</p>
                                                <p className="mt-1 text-xs text-slate-400">{log.time}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                 <span className="text-xs font-medium text-emerald-200">Marked</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {locationError && (
                            <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200/15 bg-rose-300/[0.06] p-5">
                                <IconMapPinOff size={24} className="text-rose-200" />
                                <p className="text-sm text-rose-100 text-center">{locationError}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
