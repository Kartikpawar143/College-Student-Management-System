"use client";
import React, { useEffect, useState, useRef } from "react";
import { api, endpoints, API_URL } from "@/lib/api";
import { 
    IconPlus, IconTrash, IconSearch, IconPencil, 
    IconUserPlus, IconUsers, IconCamera, IconDeviceCameraPhone,
    IconChevronRight, IconMail, IconId, IconPhone, IconUserCircle, IconCheck, IconX, IconLoader2
} from "@tabler/icons-react";
import Webcam from "react-webcam";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Webcam & Capture State
  const webcamRef = useRef<Webcam>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

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
    setIsCameraOpen(false);
    setCameraReady(false);
    setCameraError("");
    setEditingId(student.id || student._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ name: "", rollNo: "", department: "CS", email: "", phone: "", password: "" });
    setCaptures([]);
    setIsCameraOpen(false);
    setCameraReady(false);
    setCameraError("");
    setIsEditMode(false);
    setEditingId(null);
    setIsModalOpen(true);
  }

  const capture = () => {
    const webcam = webcamRef.current;
    const video = webcam?.video;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth || !video.videoHeight) {
      setCameraError("The camera is still starting. Wait for the live preview, then capture again.");
      return;
    }

    const imageSrc = webcam.getScreenshot({ width: video.videoWidth, height: video.videoHeight });
    if (!imageSrc) {
      setCameraError("The camera could not capture an image. Check the live preview and try again.");
      return;
    }

    setCameraError("");
    setCaptures(prev => [...prev, imageSrc]);
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
            password: formData.password || formData.rollNo.toUpperCase(),
            images: captures 
        };
        await api.post(endpoints.students.add, payload);
      }

      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

    return (
    <main className="admin-students-page relative mx-auto w-full max-w-7xl space-y-8 px-5 py-8 text-slate-200 sm:px-8 lg:space-y-10 lg:px-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
               <IconUsers size={12} className="text-cyan-400" />
               <span className="text-[10px] font-black text-cyan-400 tracking-widest leading-none">Global Registrar</span>
          </div>
          <h2 className="text-3xl font-semibold text-white tracking-tight sm:text-4xl">Student management</h2>
          <p className="mt-2 text-sm text-slate-400">Manage student records, enrollment details, and face verification.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="relative z-10 flex items-center justify-center gap-2 rounded-full bg-cyan-200 px-6 py-3.5 text-sm font-bold text-[#07111d] shadow-lg shadow-cyan-950/25 transition hover:-translate-y-0.5 hover:bg-white active:scale-95"
        >
          <IconUserPlus size={19} /> Add student
        </button>
      </div>

      {/* Registry Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1a29]/75 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.08] bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:p-7">
          <h3 className="font-black text-white flex items-center gap-4 text-xs tracking-[0.4em] leading-none">
            <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(165,243,252,0.5)]"></span> Enrolled students
          </h3>
          <div className="relative group/search">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/search:text-cyan-200" size={18} />
            <input 
              type="text" 
              placeholder="Query identity..." 
              className="w-full rounded-xl border border-white/10 bg-[#07111d]/80 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/40 focus:ring-4 focus:ring-cyan-200/10 md:w-80" 
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-hide">
          <table className="w-full text-left tracking-tight">
            <thead>
              <tr className="border-b border-white/5 bg-[#07111d]/30">
                <th className="px-12 py-8 text-[10px] font-black tracking-widest text-slate-600">Spatial Identity Profile</th>
                <th className="px-12 py-8 text-[10px] font-black tracking-widest text-slate-600">Temporal Register</th>
                <th className="px-12 py-8 text-[10px] font-black tracking-widest text-slate-600">Branch Node</th>
                <th className="px-12 py-8 text-[10px] font-black tracking-widest text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0d1a29]">
              {students.map((student) => (
                <tr key={student.id} className="group/row hover:bg-white/[0.04] transition-all duration-500">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-6 font-sans">
                      <div className="w-16 h-16 rounded-[2rem] overflow-hidden bg-[#07111d] border border-white/5 flex items-center justify-center text-slate-800 shadow-2xl group-hover/row:border-cyan-500/50 group-hover/row:text-cyan-400 transition-all">
                        {student.profileImage ? (
                          <img
                            src={`${API_URL}${student.profileImage}`}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + student.name)}
                          />
                        ) : (
                          <IconUserCircle size={36} />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-white text-lg tracking-tighter group-hover/row:text-cyan-400 transition-colors leading-none">{student.name}</p>
                        <p className="text-[10px] font-bold text-slate-600 lowercase mt-3 tracking-normal leading-none">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                      <span className="font-black text-white text-xs tracking-widest bg-[#07111d] px-5 py-2 rounded-xl border border-white/5 shadow-inner">{student.rollNo}</span>
                  </td>
                  <td className="px-12 py-8">
                    <span className="text-[11px] font-black text-slate-400 tracking-widest bg-white/[0.04] px-6 py-2 rounded-[1.5rem] border border-white/5">{student.department === "CS" ? "Core Branch CS" : student.department + " Node"}</span>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all scale-95 group-hover:scale-100">
                      <button onClick={() => handleEdit(student)} className="p-4 bg-[#07111d] border border-white/5 rounded-2xl text-slate-700 hover:text-cyan-400 transition-all active:scale-90 shadow-2xl">
                        <IconPencil size={24} stroke={1.5} />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-4 bg-[#07111d] border border-white/5 rounded-2xl text-slate-700 hover:text-rose-500 transition-all active:scale-90 shadow-2xl">
                        <IconTrash size={24} stroke={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-12 py-32 text-center text-slate-900 font-black text-[11px] tracking-[0.5em] grayscale animate-pulse">Archives Empty. Registering Nodes Required.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="student-modal-overlay fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#07111d]/90 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto font-sans">
          <div className="student-modal bg-[#0d1a29] w-full max-w-3xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_50px_200px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 my-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-600/5 blur-[150px] rounded-full translate-x-12 -translate-y-12"></div>
            
            <div className="student-modal-header flex justify-between items-center mb-16 relative z-10">
              <div className="flex items-center gap-10">
                 <div className="w-20 h-20 bg-cyan-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-3xl">
                    <IconUserPlus size={40} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter leading-none">{isEditMode ? "Modify Node Identity" : "Initialize Identity Node"}</h3>
                    <p className="text-slate-500 font-bold text-[10px] tracking-[0.6em] mt-5 leading-none">Establishing Registry Vector</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-700 hover:text-rose-500 transition-all p-6 bg-[#07111d] rounded-[2.5rem] border border-white/5 shadow-2xl">
                <IconX size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="student-modal-form space-y-12 relative z-10 tracking-widest">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 tracking-[0.4em] ml-6">Candidate Identity</label>
                  <input required type="text" placeholder="FULL NAME..." className="w-full bg-[#07111d] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 tracking-[0.4em] ml-6">Registry Roll Vector</label>
                  <input required type="text" placeholder="ROLL ID..." className="w-full bg-[#07111d] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                    value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 tracking-[0.4em] ml-6">Email Coordinate</label>
                  <input required type="email" placeholder="EMAIL ADDRESS..." className="w-full bg-[#07111d] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-3xl placeholder:text-slate-900 lowercase tracking-normal"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 tracking-[0.4em] ml-6">Terminal Node Contact</label>
                  <input required type="text" placeholder="PHONE ID..." className="w-full bg-[#07111d] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-700 tracking-[0.4em] ml-6">Security Access Key (Defaults to Roll No)</label>
                    <input type="password" placeholder="BLANK FOR IDENTITY SYNC..." className="w-full bg-[#07111d] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-700 tracking-[0.4em] ml-6">Allocated Departmental Branch</label>
                    <div className="relative">
                        <select className="w-full bg-[#07111d] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-3xl appearance-none cursor-pointer "
                            value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                            {["IT", "CS", "ENTC", "Automobile"].map(dept => (
                            <option key={dept} value={dept} className="bg-[#0d1a29]">{dept} BRANCH</option>
                            ))}
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-800">
                            <IconChevronRight className="rotate-90" size={18} />
                        </div>
                    </div>
                  </div>
              </div>

              {!isEditMode && (
                <div className="space-y-8 pt-6">
                  <label className="text-[11px] font-black text-slate-700 tracking-[0.4em] ml-6 border-b border-cyan-500/30 pb-2">Biometric Identity Capture Matrix</label>
                <div className="student-camera-panel bg-[#07111d] border border-white/5 rounded-[4rem] p-12 text-center group relative overflow-hidden shadow-3xl border-2 border-dashed border-white/10 hover:border-cyan-500/30 transition-all duration-700">
                    {isCameraOpen ? (
                      <div className="space-y-10 relative z-10 transition-all animate-in zoom-in-95 duration-700">
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          width={1280}
                          height={720}
                          screenshotFormat="image/jpeg"
                          screenshotQuality={1.0}
                          forceScreenshotSourceSize
                          playsInline
                          muted
                          onUserMedia={() => setCameraError("")}
                          onUserMediaError={(error) => {
                            setCameraReady(false);
                            const message = typeof error === "string" ? error : error.message;
                            setCameraError(message || "Camera access failed. Allow camera access in your browser and try again.");
                          }}
                          onPlaying={() => {
                            setCameraReady(true);
                            setCameraError("");
                          }}
                          className="w-full rounded-[3.5rem] shadow-[0_0_80px_rgba(99,102,241,0.2)] mx-auto border-4 border-[#0d1a29]"
                          videoConstraints={{ width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }}
                        />
                        {cameraError && <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{cameraError}</p>}
                        <div className="flex justify-center gap-8">
                          <button type="button" onClick={capture} disabled={!cameraReady} className="bg-cyan-600 text-white font-black px-12 py-5 rounded-[2rem] text-[11px] tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-4 shadow-3xl shadow-cyan-600/30 active:scale-95 disabled:cursor-wait disabled:opacity-50">
                            <IconCamera size={24} /> {cameraReady ? `Capture Samples (${captures.length}/5)` : "Starting camera..."}
                          </button>
                          <button type="button" onClick={() => { setIsCameraOpen(false); setCameraReady(false); setCameraError(""); }} className="text-slate-700 px-10 py-5 text-[11px] font-black tracking-widest hover:text-rose-500 transition-all border border-white/5 rounded-[2rem] hover:bg-white/5">
                            Abort Scan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => { setCameraError(""); setCameraReady(false); setIsCameraOpen(true); }} className="student-camera-start w-full flex flex-col items-center justify-center gap-10 py-20 hover:bg-white/[0.02] transition-all rounded-[3.5rem] group/scan animate-in fade-in duration-700">
                        <div className="w-24 h-24 bg-[#0d1a29] rounded-[2.5rem] flex items-center justify-center text-slate-900 border border-white/5 shadow-3xl group-hover/scan:text-cyan-500 group-hover/scan:scale-110 group-hover/scan:rotate-12 transition-all duration-700">
                           <IconCamera size={48} stroke={1.5} />
                        </div>
                        <div className="space-y-3">
                            <span className="text-[12px] font-black tracking-[0.5em] text-slate-800 group-hover/scan:text-slate-500 transition-colors">Start Face Coordinate Mapping</span>
                            <p className="text-[9px] font-black text-slate-900 tracking-widest">Active Neural Engine Verification Enabled</p>
                        </div>
                      </button>
                    )}
                  </div>

                  {captures.length > 0 && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide p-2">
                        {captures.map((img, idx) => (
                          <div key={idx} className="relative w-28 h-28 flex-shrink-0 group/img shadow-2xl">
                            <img src={img} className="w-full h-full object-cover rounded-[1.8rem] border-2 border-white/10 group-hover/img:scale-105 transition-all duration-500 group-hover/img:border-cyan-500/50" />
                            <div className="absolute inset-0 bg-cyan-600/20 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-[1.8rem]"></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center bg-[#07111d] px-12 py-5 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <span className="text-[11px] font-black text-cyan-400 tracking-widest flex items-center gap-4">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                           {captures.length}/5 IDENTITY SAMPLES LOCKED
                        </span>
                        <button type="button" onClick={clearCaptures} className="text-[10px] font-black text-rose-500/70 tracking-widest hover:text-rose-500 transition-colors active:scale-95">Purge Matrix</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="student-submit-wrap pt-12">
                <button type="submit" disabled={loading} className="student-submit w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-8 rounded-[5rem] shadow-4xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-8 text-[12px] tracking-[0.6em] active:scale-95 disabled:opacity-50 border border-cyan-500/20">
                  {loading ? (
                    <div className="flex items-center gap-6">
                        <IconLoader2 className="animate-spin" size={24} />
                        <span>TRANSFIXING NODE...</span>
                    </div>
                  ) : isEditMode ? "COMMIT IDENTITY UPDATE" : "FINALIZE REGISTRY ENROLLMENT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
