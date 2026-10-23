"use client";
import React, { useEffect, useState, useRef } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import { 
    IconPlus, IconTrash, IconSearch, IconPencil, 
    IconUserPlus, IconUsers, IconCamera, IconDeviceCameraPhone,
    IconChevronRight, IconMail, IconId, IconPhone, IconUserCircle, IconCheck, IconMapPin
} from "@tabler/icons-react";
import Webcam from "react-webcam";
import Image from "next/image";

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Webcam & Capture State
  const webcamRef = useRef<Webcam>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    department: "CS",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get(endpoints.students.getAll);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this student?")) return;
    try {
      await api.delete(endpoints.students.delete(id));
      fetchStudents();
    } catch (err) {
      alert("Failed to delete student records.");
    }
  };

  const handleEdit = (student: any) => {
    // Map legacy branch names to new standards
    let dept = student.department || "CS";
    if (dept === "Computer Science") dept = "CS";
    if (dept === "Electronics") dept = "ENTC";

    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      department: dept,
      email: student.email,
      phone: student.phone,
      password: "" 
    });
    setCaptures([]); 
    setEditingId(student.id || student._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ name: "", rollNo: "", department: "CS", email: "", phone: "", password: "" });
    setCaptures([]);
    setIsEditMode(false);
    setEditingId(null);
    setIsModalOpen(true);
  }

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCaptures(prev => [...prev, imageSrc]);
      }
    }
  };

  const clearCaptures = () => {
    setCaptures([]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditMode && captures.length < 1) return alert("Please capture face samples for identity verification.");

    setLoading(true);
    try {
      if (isEditMode && editingId) {
        await api.put(endpoints.students.update(editingId), formData);
      } else {
        const payload = { 
            ...formData, 
            password: formData.password || formData.rollNo,
            images: captures,
            lat: location?.lat,
            lng: location?.lng
        };
        await api.post(endpoints.students.add, payload);
      }

      setIsModalOpen(false);
      fetchStudents();
      setLocation(null);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const captureLocation = () => {
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setFetchingLocation(false);
            alert("Current location captured successfully! This will be saved as the Campus Center.");
        },
        (err) => {
            alert("Location access denied. Please enable GPS and allow location access in your browser.");
            setFetchingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <main className="p-8 lg:p-10 space-y-10 min-h-screen bg-[#070b14] text-slate-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
               <IconUsers size={10} className="text-indigo-400" />
               <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">Student Hub</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Student Registry</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-2 leading-none">Register and manage branch members</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest active:scale-95 relative z-10"
        >
          <IconUserPlus size={18} /> Enroll New Student
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: "Enrolled Cohort", val: students.length, icon: IconUsers, color: "text-indigo-400", bg: "bg-indigo-500/10" },
            { label: "Biometric Status", val: "AI Verified", icon: IconDeviceCameraPhone, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Branch Unit", val: "CS Core", icon: IconId, color: "text-purple-400", bg: "bg-purple-500/10" }
        ].map((stat, i) => (
            <div key={i} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex items-center gap-6 group hover:border-indigo-500/20 transition-all">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center border border-white/5 group-hover:rotate-3 transition-all`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white tracking-tight leading-none">{stat.val}</p>
              </div>
            </div>
        ))}
      </div>

      {/* Student List Table */}
      <div className="bg-[#0f172a] rounded-[3rem] border border-white/5 shadow-xl overflow-hidden relative group font-sans">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#070b14]/50">
          <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest leading-none">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span> Managed Students
          </h3>
          <div className="relative w-full md:w-72 group/search">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="w-full bg-[#070b14] border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm placeholder:text-slate-600" 
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-hide">
          <table className="w-full text-left uppercase tracking-tight">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-slate-500">Identity Profile</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-slate-500">Index Roll</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-slate-500">Branch</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr key={student.id} className="group/row hover:bg-white/5 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#070b14] border border-white/5 flex items-center justify-center text-slate-700 shadow-xl group-hover/row:border-indigo-500/50 group-hover/row:text-indigo-400 transition-all">
                        {student.profileImage ? (
                          <img
                            src={`${API_URL}${student.profileImage}`}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + student.name)}
                          />
                        ) : (
                          <IconUserCircle size={32} />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-white text-sm tracking-tight group-hover/row:text-indigo-400 transition-colors leading-none">{student.name}</p>
                        <p className="text-[9px] font-bold text-slate-600 lowercase mt-2 tracking-normal leading-none">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                      <span className="font-black text-white text-[11px] tracking-widest bg-[#070b14] px-3 py-1 rounded-lg border border-white/5">{student.rollNo}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-xl border border-white/5">{student.department === "Computer Science" ? "CS Branch" : student.department}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all">
                      <button onClick={() => handleEdit(student)} className="p-3 bg-[#070b14] border border-white/5 rounded-xl text-slate-500 hover:text-indigo-400 transition-all active:scale-90 shadow-xl">
                        <IconPencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-3 bg-[#070b14] border border-white/5 rounded-xl text-slate-500 hover:text-rose-400 transition-all active:scale-90 shadow-xl">
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-800 font-black uppercase text-[11px] tracking-[0.4em]">Registry archive empty. No node records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto font-sans">
          <div className="bg-[#0f172a] w-full max-w-2xl rounded-[4rem] p-12 lg:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 my-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full translate-x-12 -translate-y-12"></div>
            
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl">
                    <IconUserPlus size={32} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none">{isEditMode ? "Modify Identity" : "Enrollment Node"}</h3>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest mt-3 leading-none">Initializing Registry Update</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-rose-400 transition-all p-4 bg-[#070b14] rounded-2xl border border-white/5 shadow-xl">
                <IconTrash size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10 uppercase tracking-widest">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Candidate Identity</label>
                  <input required type="text" placeholder="FULL NAME..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Registry Roll Node</label>
                  <input required type="text" placeholder="ROLL ID..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800"
                    value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Email Channel</label>
                  <input required type="email" placeholder="EMAIL ADDRESS..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800 lowercase tracking-normal"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Terminal Contact</label>
                  <input required type="text" placeholder="PHONE ID..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Security Password (Defaults to Roll No)</label>
                <input type="password" placeholder="LEAVE BLANK FOR ROLL NO..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800"
                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Operational Branch</label>
                <div className="relative">
                  <select className="w-full bg-[#070b14] border border-white/5 rounded-[2.2rem] px-8 py-5 text-[10px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl appearance-none cursor-pointer uppercase"
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                    {["IT", "CS", "ENTC", "Automobile"].map(dept => (
                      <option key={dept} value={dept} className="bg-[#0f172a]">{dept} BRANCH</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">
                    <IconChevronRight className="rotate-90" size={16} />
                  </div>
                </div>
              </div>

              {!isEditMode && (
                <div className="space-y-6">
                  {/* Location Capture for Campus Geofencing */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Campus Geofencing</label>
                      {location && (
                        <span className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1">
                          <IconCheck size={10} /> Sync Ready
                        </span>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={captureLocation}
                      disabled={fetchingLocation}
                      className="w-full bg-[#070b14] border border-white/5 text-slate-400 hover:text-white py-5 rounded-[2.2rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
                    >
                      <IconMapPin size={20} className={fetchingLocation ? "animate-pulse" : ""} />
                      {fetchingLocation ? "Detecting Satellite..." : location ? "Update Campus Node" : "Set Current as Campus Center"}
                    </button>
                    <p className="text-[8px] font-bold text-slate-800 uppercase text-center tracking-widest leading-relaxed">
                      Capture your current coordinates to set the 500m attendance zone
                    </p>
                  </div>

                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-4">Biometric Identity Setup</label>
                  <div className="bg-[#070b14] border border-white/5 rounded-[3rem] p-10 text-center group relative overflow-hidden shadow-2xl">
                    {isCameraOpen ? (
                      <div className="space-y-8 relative z-10">
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          screenshotQuality={0.8}
                          className="w-full rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.2)] mx-auto border border-white/5"
                          videoConstraints={{ facingMode: "user" }}
                        />
                        <div className="flex justify-center gap-6">
                          <button type="button" onClick={capture} className="bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-4 shadow-2xl shadow-indigo-600/20 active:scale-95">
                            <IconCamera size={20} /> Capture Samples ({captures.length}/5)
                          </button>
                          <button type="button" onClick={() => setIsCameraOpen(false)} className="text-slate-600 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:text-rose-400 transition-all">
                            Terminate Scan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setIsCameraOpen(true)} className="w-full flex flex-col items-center justify-center gap-6 py-12 hover:bg-white/5 transition-all rounded-[2.5rem] border-2 border-dashed border-white/5 group/scan">
                        <div className="w-20 h-20 bg-[#0f172a] rounded-[2rem] flex items-center justify-center text-slate-800 border border-white/5 shadow-2xl group-hover/scan:text-indigo-400 group-hover/scan:scale-110 transition-all duration-500">
                           <IconCamera size={40} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-700 group-hover/scan:text-slate-500">Initialize Face Matrix Sync</span>
                      </button>
                    )}
                  </div>

                  {captures.length > 0 && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {captures.map((img, idx) => (
                          <div key={idx} className="relative w-24 h-24 flex-shrink-0">
                            <img src={img} className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-transform" />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center bg-[#070b14] px-10 py-4 rounded-[2rem] border border-white/5 shadow-xl">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                           <IconCheck size={16} /> {captures.length} SAMPLES SYNCED
                        </span>
                        <button type="button" onClick={clearCaptures} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline active:scale-90">RESET MATRIX</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-8">
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-7 rounded-[4rem] shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-6 uppercase text-[11px] tracking-[0.4em] active:scale-95 disabled:opacity-50">
                  {loading ? "SYNCHRONIZING..." : isEditMode ? "UPDATE IDENTITY CORE" : "FINALIZE ENROLLMENT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
