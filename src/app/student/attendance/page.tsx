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
        <main className="min-h-screen bg-[#070b14] p-8 lg:p-10 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-12 relative text-left">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
                
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pb-12 border-b border-white/5 relative">
                    <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                              <IconShieldCheck size={12} className="text-indigo-400" />
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">SECURE ATTENDANCE V2</span>
                         </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Mark Presence</h2>
                        <p className="text-sm font-bold text-slate-500 leading-none">Scan your face within campus boundaries to mark attendance.</p>
                    </div>

                    <div className={`flex items-center gap-6 px-10 py-5 rounded-[2.5rem] border shadow-2xl relative z-10 transition-all ${
                        location ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                        {location ? <IconMapPin size={24} className="animate-bounce" /> : <IconMapPinOff size={24} className="animate-pulse" />}
                        <div className="text-left font-sans">
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{location ? 'Location Synced' : 'Location Required'}</p>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 leading-none">
                                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Access Denied'}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 bg-[#0f172a] rounded-[4.5rem] border border-white/5 shadow-3xl overflow-hidden relative group overflow-hidden font-sans">
                        <div className="relative h-[600px] bg-[#070b14] overflow-hidden">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover grayscale brightness-110 contrast-125 opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[2000ms]"
                                videoConstraints={{ facingMode: "user" }}
                            />

                            {/* Scanner Architecture */}
                            <div className="absolute inset-0 border-[40px] border-[#070b14] pointer-events-none"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-indigo-500/20 rounded-[4rem] animate-pulse">
                                 <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-indigo-600 rounded-tl-3xl"></div>
                                 <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-indigo-600 rounded-tr-3xl"></div>
                                 <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-indigo-600 rounded-bl-3xl"></div>
                                 <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-indigo-600 rounded-br-3xl"></div>
                            </div>
                            
                            {loading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b14]/95 z-30 backdrop-blur-3xl animate-in fade-in duration-700">
                                    <div className="relative w-32 h-32 mb-10 translate-y-[-2rem]">
                                         <IconLoader2 size={128} className="animate-spin text-indigo-600 opacity-20" />
                                         <IconUserScan size={56} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" />
                                    </div>
                                    <p className="text-[12px] font-black text-white uppercase tracking-[0.6em] animate-pulse">Syncing Presence Node...</p>
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

                        <div className="p-12 bg-[#070b14]/80 flex flex-col md:flex-row items-center justify-between gap-12 font-sans">
                            <div className="flex items-center gap-8 text-left">
                                 <div className="w-16 h-16 bg-[#0f172a] rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/5 text-indigo-500">
                                    <IconMapPin size={32} />
                                 </div>
                                 <div className="space-y-2">
                                     <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Security Protocol</p>
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Your location is verified for campus boundaries.</p>
                                 </div>
                            </div>
                            <button 
                                onClick={capture}
                                disabled={loading || !!result || !location}
                                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-black px-20 py-8 rounded-[3rem] shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-6 uppercase text-[12px] tracking-[0.4em] active:scale-95 disabled:grayscale disabled:opacity-30"
                            >
                                <IconCamera size={28} stroke={3} /> Mark Attendance
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                         <div className="bg-[#0f172a] rounded-[4rem] p-12 text-white shadow-3xl border border-white/5 relative overflow-hidden group font-sans text-left">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[120px] rounded-full"></div>
                            <h3 className="font-extrabold text-2xl tracking-tighter uppercase mb-14 flex items-center gap-6 relative z-10">
                                <IconShieldCheck size={32} className="text-indigo-500" /> Anti-Proxy Rules
                            </h3>
                            <div className="space-y-10 relative z-10">
                                {[
                                    { title: "Physical Presence", desc: "You must be within 500m of the college campus node." },
                                    { title: "Location Access", desc: "Keep GPS/Location enabled while marking attendance." },
                                    { title: "Face Recognition", desc: "Live camera scan must match your registered profile." },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 group/item">
                                        <div className="w-12 h-12 rounded-[2rem] bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-black text-[12px] border border-indigo-600/20 shadow-2xl group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                            {i + 1}
                                        </div>
                                        <div className="pt-2">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-none mb-3">{item.title}</h4>
                                            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {attendanceHistory.length > 0 && (
                            <div className="bg-[#0f172a] rounded-[4rem] p-12 text-white shadow-3xl border border-white/5 relative overflow-hidden group font-sans text-left">
                                <h3 className="font-extrabold text-2xl tracking-tighter uppercase mb-10 flex items-center gap-6 relative z-10">
                                    <IconHistory size={32} className="text-emerald-500" /> Recent Logs
                                </h3>
                                <div className="space-y-6 relative z-10">
                                    {attendanceHistory.map((log, i) => (
                                        <div key={i} className="p-6 bg-[#070b14]/60 border border-white/5 rounded-3xl flex items-center justify-between hover:border-emerald-500/20 transition-all group/log">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-white uppercase tracking-tight leading-none">{log.date}</p>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{log.time}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">MARKED</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {locationError && (
                            <div className="bg-rose-500/10 border-2 border-rose-500/20 rounded-[3rem] p-10 flex flex-col items-center gap-6 animate-pulse">
                                <IconMapPinOff size={48} className="text-rose-500" />
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{locationError}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
