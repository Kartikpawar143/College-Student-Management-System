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
    <main className="p-8 lg:p-12 space-y-12 min-h-screen bg-[#070b14] text-slate-200 uppercase tracking-tight">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
               <IconUsers size={12} className="text-indigo-400" />
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Global Registrar</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">GHRCOE Studion</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 leading-none tracking-widest leading-tight">Institutional identity management and enrollment matrix</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-[2.5rem] shadow-3xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-4 uppercase text-[10px] tracking-widest active:scale-95 relative z-10"
        >
          <IconUserPlus size={22} /> Initialize Enrollment
        </button>
      </div>

      {/* Registry Table */}
      <div className="bg-[#0f172a] rounded-[4.5rem] border border-white/5 shadow-3xl overflow-hidden relative group font-sans transition-all hover:border-indigo-500/10">
        <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/[0.02]">
          <h3 className="font-black text-white flex items-center gap-4 text-xs uppercase tracking-[0.4em] leading-none">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span> Active Matrix Members
          </h3>
          <div className="relative group/search">
            <IconSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/search:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Query identity..." 
              className="w-full md:w-80 bg-[#070b14] border border-white/5 rounded-[2rem] pl-16 pr-8 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl placeholder:text-slate-800" 
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[700px] scrollbar-hide">
          <table className="w-full text-left uppercase tracking-tight">
            <thead>
              <tr className="border-b border-white/5 bg-[#070b14]/30">
                <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-slate-600">Spatial Identity Profile</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-slate-600">Temporal Register</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-slate-600">Branch Node</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase tracking-widest text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0f172a]">
              {students.map((student) => (
                <tr key={student.id} className="group/row hover:bg-white/[0.04] transition-all duration-500">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-6 font-sans">
                      <div className="w-16 h-16 rounded-[2rem] overflow-hidden bg-[#070b14] border border-white/5 flex items-center justify-center text-slate-800 shadow-2xl group-hover/row:border-indigo-500/50 group-hover/row:text-indigo-400 transition-all">
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
                        <p className="font-black text-white text-lg tracking-tighter group-hover/row:text-indigo-400 transition-colors uppercase leading-none">{student.name}</p>
                        <p className="text-[10px] font-bold text-slate-600 lowercase mt-3 tracking-normal leading-none">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                      <span className="font-black text-white text-xs tracking-widest bg-[#070b14] px-5 py-2 rounded-xl border border-white/5 shadow-inner">{student.rollNo}</span>
                  </td>
                  <td className="px-12 py-8">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white/[0.04] px-6 py-2 rounded-[1.5rem] border border-white/5">{student.department === "CS" ? "Core Branch CS" : student.department + " Node"}</span>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all scale-95 group-hover:scale-100">
                      <button onClick={() => handleEdit(student)} className="p-4 bg-[#070b14] border border-white/5 rounded-2xl text-slate-700 hover:text-indigo-400 transition-all active:scale-90 shadow-2xl">
                        <IconPencil size={24} stroke={1.5} />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-4 bg-[#070b14] border border-white/5 rounded-2xl text-slate-700 hover:text-rose-500 transition-all active:scale-90 shadow-2xl">
                        <IconTrash size={24} stroke={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-12 py-32 text-center text-slate-900 font-black uppercase text-[11px] tracking-[0.5em] grayscale animate-pulse">Archives Empty. Registering Nodes Required.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#070b14]/90 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto font-sans">
          <div className="bg-[#0f172a] w-full max-w-3xl rounded-[5rem] p-16 lg:p-20 shadow-[0_50px_200px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-500 my-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/5 blur-[150px] rounded-full translate-x-12 -translate-y-12"></div>
            
            <div className="flex justify-between items-center mb-16 relative z-10">
              <div className="flex items-center gap-10">
                 <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-3xl">
                    <IconUserPlus size={40} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{isEditMode ? "Modify Node Identity" : "Initialize Identity Node"}</h3>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.6em] mt-5 leading-none">Establishing Registry Vector</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-700 hover:text-rose-500 transition-all p-6 bg-[#070b14] rounded-[2.5rem] border border-white/5 shadow-2xl">
                <IconX size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 relative z-10 uppercase tracking-widest">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-6">Candidate Identity</label>
                  <input required type="text" placeholder="FULL NAME..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-6">Registry Roll Vector</label>
                  <input required type="text" placeholder="ROLL ID..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                    value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-6">Email Coordinate</label>
                  <input required type="email" placeholder="EMAIL ADDRESS..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-3xl placeholder:text-slate-900 lowercase tracking-normal"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-6">Terminal Node Contact</label>
                  <input required type="text" placeholder="PHONE ID..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-6">Security Access Key (Defaults to Roll No)</label>
                    <input type="password" placeholder="BLANK FOR IDENTITY SYNC..." className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-3xl placeholder:text-slate-900"
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-6">Allocated Departmental Branch</label>
                    <div className="relative">
                        <select className="w-full bg-[#070b14] border border-white/5 rounded-[2.5rem] px-10 py-7 text-[11px] font-black text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-3xl appearance-none cursor-pointer uppercase"
                            value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                            {["IT", "CS", "ENTC", "Automobile"].map(dept => (
                            <option key={dept} value={dept} className="bg-[#0f172a]">{dept} BRANCH</option>
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
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] ml-6 border-b border-indigo-500/30 pb-2">Biometric Identity Capture Matrix</label>
                  <div className="bg-[#070b14] border border-white/5 rounded-[4rem] p-12 text-center group relative overflow-hidden shadow-3xl border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all duration-700">
                    {isCameraOpen ? (
                      <div className="space-y-10 relative z-10 transition-all animate-in zoom-in-95 duration-700">
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          screenshotQuality={1.0}
                          className="w-full rounded-[3.5rem] shadow-[0_0_80px_rgba(99,102,241,0.2)] mx-auto border-4 border-[#0f172a]"
                          videoConstraints={{ facingMode: "user" }}
                        />
                        <div className="flex justify-center gap-8">
                          <button type="button" onClick={capture} className="bg-indigo-600 text-white font-black px-12 py-5 rounded-[2rem] text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-4 shadow-3xl shadow-indigo-600/30 active:scale-95">
                            <IconCamera size={24} /> Capture Samples ({captures.length}/5)
                          </button>
                          <button type="button" onClick={() => setIsCameraOpen(false)} className="text-slate-700 px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:text-rose-500 transition-all border border-white/5 rounded-[2rem] hover:bg-white/5">
                            Abort Scan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setIsCameraOpen(true)} className="w-full flex flex-col items-center justify-center gap-10 py-20 hover:bg-white/[0.02] transition-all rounded-[3.5rem] group/scan animate-in fade-in duration-700">
                        <div className="w-24 h-24 bg-[#0f172a] rounded-[2.5rem] flex items-center justify-center text-slate-900 border border-white/5 shadow-3xl group-hover/scan:text-indigo-500 group-hover/scan:scale-110 group-hover/scan:rotate-12 transition-all duration-700">
                           <IconCamera size={48} stroke={1.5} />
                        </div>
                        <div className="space-y-3">
                            <span className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-800 group-hover/scan:text-slate-500 transition-colors">Start Face Coordinate Mapping</span>
                            <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Active Neural Engine Verification Enabled</p>
                        </div>
                      </button>
                    )}
                  </div>

                  {captures.length > 0 && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide p-2">
                        {captures.map((img, idx) => (
                          <div key={idx} className="relative w-28 h-28 flex-shrink-0 group/img shadow-2xl">
                            <img src={img} className="w-full h-full object-cover rounded-[1.8rem] border-2 border-white/10 group-hover/img:scale-105 transition-all duration-500 group-hover/img:border-indigo-500/50" />
                            <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-[1.8rem]"></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center bg-[#070b14] px-12 py-5 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-4">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                           {captures.length}/5 IDENTITY SAMPLES LOCKED
                        </span>
                        <button type="button" onClick={clearCaptures} className="text-[10px] font-black text-rose-500/70 uppercase tracking-widest hover:text-rose-500 transition-colors active:scale-95">Purge Matrix</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-12">
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[5rem] shadow-4xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-8 uppercase text-[12px] tracking-[0.6em] active:scale-95 disabled:opacity-50 border border-indigo-500/20">
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
