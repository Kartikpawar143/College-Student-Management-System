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
  const [search, setSearch] = useState("");
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

  const filteredStudents = students.filter(student =>
    [student.name, student.email, student.rollNo, student.department].some(value =>
      String(value || "").toLowerCase().includes(search.toLowerCase())
    )
  );

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
    <main className="admin-students-page min-h-screen bg-[#07111d] p-5 font-sans text-slate-200 sm:p-7 xl:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Section */}
      <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#102338] via-[#0d1b2b] to-[#10172a] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div className="relative min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
               <IconUsers size={13} />
               <span>Student records</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Students</h1>
          <p className="mt-2 text-sm text-slate-400">Manage enrollment details and face verification.</p>
        </div>
        <button
          onClick={openAddModal}
          className="relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#07111d] shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <IconUserPlus size={18} /> Add student
        </button>
      </header>

      <section aria-label="Student statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Total students", value: students.length, detail: "Enrolled records", icon: IconUsers, tint: "text-cyan-200", bg: "bg-cyan-300/10" },
          { label: "Departments", value: new Set(students.map(student => student.department || "General")).size, detail: "Branches represented", icon: IconId, tint: "text-violet-200", bg: "bg-violet-300/10" },
          { label: "Face profiles", value: students.filter(student => student.profileImage).length, detail: "Identity images on file", icon: IconUserCircle, tint: "text-emerald-200", bg: "bg-emerald-300/10" },
        ].map(({ label, value, detail, icon: Icon, tint, bg }) => <div key={label} className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1a29] p-5">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${tint}`}><Icon size={21} stroke={1.8} /></div>
          <div className="min-w-0"><p className="text-sm font-medium text-slate-400">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
        </div>)}
      </section>

      {/* Registry Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1a29]">
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div><h2 className="text-lg font-semibold text-white">Enrolled students</h2><p className="mt-1 text-xs text-slate-500">{filteredStudents.length} of {students.length} student records</p></div>
          <div className="relative w-full sm:max-w-xs">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search students..."
              className="w-full rounded-xl border border-white/10 bg-[#07111d]/80 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/40 focus:ring-4 focus:ring-cyan-200/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-hide">
          <table className="w-full text-left tracking-tight">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th className="px-5 py-3.5 text-xs font-medium text-slate-400 sm:px-6">Student</th>
                <th className="px-5 py-3.5 text-xs font-medium text-slate-400 sm:px-6">Roll number</th>
                <th className="px-5 py-3.5 text-xs font-medium text-slate-400 sm:px-6">Department</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium text-slate-400 sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0d1a29]">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="group/row hover:bg-white/[0.04] transition-all duration-500">
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-[#07111d] text-slate-500 transition group-hover/row:border-cyan-200/20">
                        {student.profileImage ? (
                          <img
                            src={`${API_URL}${student.profileImage}`}
                            alt={student.name}
                            className="h-full w-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + student.name)}
                          />
                        ) : (
                          <IconUserCircle size={23} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white transition-colors group-hover/row:text-cyan-100">{student.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                      <span className="rounded-lg border border-white/[0.07] bg-[#07111d]/70 px-2.5 py-1.5 text-xs font-medium text-slate-300">{student.rollNo}</span>
                  </td>
                  <td className="px-5 py-4 sm:px-6">
                    <span className="rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300">{student.department || "General"}</span>
                  </td>
                  <td className="px-5 py-4 text-right sm:px-6">
                    <div className="flex justify-end gap-2 opacity-100 transition sm:opacity-0 sm:group-hover/row:opacity-100 sm:group-focus-within/row:opacity-100">
                      <button aria-label={`Edit ${student.name}`} onClick={() => handleEdit(student)} className="rounded-lg border border-white/[0.07] bg-[#07111d] p-2.5 text-slate-400 transition hover:text-cyan-200">
                        <IconPencil size={16} stroke={1.7} />
                      </button>
                      <button aria-label={`Delete ${student.name}`} onClick={() => handleDelete(student.id)} className="rounded-lg border border-white/[0.07] bg-[#07111d] p-2.5 text-slate-400 transition hover:text-rose-300">
                        <IconTrash size={16} stroke={1.7} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-sm text-slate-500">{search ? "No students match your search." : "No students have been added yet."}</td>
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
      </div>
    </main>
  );
}
