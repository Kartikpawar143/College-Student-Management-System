"use client";
import React from "react";
import { useState } from "react";
import { CAMPUS_NODES, CAMPUS_GRAPH, findShortestPath, NodeId } from "@/lib/graph";
import { IconMapPin, IconNavigation, IconWalk, IconFlag, IconCurrentLocation, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function NavigationPage() {
    const [start, setStart] = useState<NodeId>("MAIN_GATE");
    const [end, setEnd] = useState<NodeId>("COMP_IT_DEPT");
    const [result, setResult] = useState<{ path: NodeId[], distance: number } | null>(null);

    const handleNavigate = () => {
        if (start === end) {
            alert("Please select different start and end points!");
            return;
        }
        const res = findShortestPath(start, end);
        setResult(res);
    };

    const isEdgeInPath = (n1: NodeId, n2: NodeId) => {
        if (!result) return false;
        const path = result.path;
        for (let i = 0; i < path.length - 1; i++) {
            if ((path[i] === n1 && path[i + 1] === n2) || (path[i] === n2 && path[i + 1] === n1)) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className="min-h-screen bg-[#070b14] font-sans text-slate-200 flex flex-col selection:bg-indigo-500/30 overflow-hidden">
            {/* Header */}
            <header className="bg-[#0f172a] shadow-[0_20px_40px_rgba(0,0,0,0.5)] py-6 lg:py-8 px-10 flex justify-between items-center z-20 border-b border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-6 text-indigo-400 relative z-10">
                    <div className="bg-[#070b14] p-4 rounded-2xl text-indigo-400 border border-white/5 shadow-2xl group-hover:rotate-12 transition-all duration-700">
                        <IconNavigation size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase leading-none text-white">Spatial Mapping</h1>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 mt-2">Campus Navigation Core</p>
                    </div>
                </div>
                <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 hover:text-white transition-all bg-white/5 px-8 py-4 rounded-2xl border border-white/5 shadow-3xl relative z-10 active:scale-95">
                    <IconArrowLeft size={18} /> RETURN TO NEXUS
                </Link>
            </header>

            <div className="flex-1 relative overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-100px)]">

                {/* Controls */}
                <div className="lg:w-[450px] bg-[#0f172a] shadow-[50px_0_100px_rgba(0,0,0,0.4)] z-10 flex flex-col h-full border-r border-white/5 relative overflow-hidden font-sans">
                    <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full -translate-x-1/2"></div>
                    
                    <div className="p-12 space-y-10 z-20 bg-transparent flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex items-center gap-4 bg-[#070b14]/80 p-6 rounded-[2.5rem] text-indigo-400 border border-white/5 shadow-inner">
                            <IconCurrentLocation size={24} className="animate-pulse" />
                            <span className="font-black text-[10px] uppercase tracking-[0.5em] leading-none">Global Positioning Active</span>
                        </div>

                        <div className="space-y-8">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-800 ml-4 block leading-none">Origin Node</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500/50 group-hover:text-indigo-400 transition-colors z-10"><IconMapPin size={22} /></div>
                                    <select
                                        className="w-full pl-16 pr-8 py-6 bg-[#070b14] border border-white/10 rounded-[2.5rem] text-[10px] focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none font-black uppercase tracking-[0.3em] text-white transition-all cursor-pointer shadow-3xl hover:border-indigo-500/30"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value as NodeId)}
                                    >
                                        {Object.entries(CAMPUS_NODES).map(([key, node]) => (
                                            <option key={key} value={key} className="bg-[#0f172a] text-white">{node.label}</option>
                                        ))}
                                    </select>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-800 ml-4 block leading-none">Destination Node</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500/50 group-hover:text-rose-400 transition-colors z-10"><IconFlag size={22} /></div>
                                    <select
                                        className="w-full pl-16 pr-8 py-6 bg-[#070b14] border border-white/10 rounded-[2.5rem] text-[10px] focus:ring-4 focus:ring-rose-500/10 outline-none appearance-none font-black uppercase tracking-[0.3em] text-white transition-all cursor-pointer shadow-3xl hover:border-rose-500/30"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value as NodeId)}
                                    >
                                        {Object.entries(CAMPUS_NODES).map(([key, node]) => (
                                            <option key={key} value={key} className="bg-[#0f172a] text-white">{node.label}</option>
                                        ))}
                                    </select>
                                </div>
                             </div>
                        </div>

                        <button
                            onClick={handleNavigate}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-7 rounded-[2.5rem] shadow-[0_25px_50px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-4 uppercase text-[11px] tracking-[0.6em] active:scale-95 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <IconNavigation size={22} className="transition-transform group-hover:rotate-12" /> EXECUTE ROUTING
                        </button>

                        {result ? (
                            <div className="pt-10 transition-all duration-700 space-y-12 relative z-10">
                                <div className="p-10 bg-[#070b14] rounded-[3.5rem] border border-white/5 shadow-inner text-center">
                                    <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.6em] mb-4">Spatial Displacement</div>
                                    <div className="flex items-baseline gap-4 justify-center">
                                        <span className="text-5xl font-black text-white tracking-tighter">{result.distance}<span className="text-indigo-500">m</span></span>
                                    </div>
                                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.4em] mt-4">Total Transit Distance</p>
                                </div>

                                <div className="relative border-l-4 border-indigo-500/10 ml-6 space-y-12 pb-10">
                                    {result.path.map((node, i) => (
                                        <div key={i} className="pl-12 relative group/step">
                                            <div className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 border-[#0f172a] shadow-2xl transition-all duration-700 ${
                                                i === 0 ? 'bg-indigo-500 scale-125 ring-8 ring-indigo-500/10' :
                                                i === result.path.length - 1 ? 'bg-rose-500 scale-125 ring-8 ring-rose-500/10' : 'bg-[#1e293b]'
                                            }`}></div>

                                            <h4 className="font-black text-white text-[11px] uppercase tracking-[0.4em] mb-4 group-hover/step:text-indigo-400 transition-colors leading-none">{CAMPUS_NODES[node].label}</h4>

                                            {i < result.path.length - 1 && (
                                                <div className="p-6 bg-[#070b14] rounded-[2rem] border border-white/5 flex items-center gap-5 shadow-2xl hover:border-indigo-500/20 transition-all group/info">
                                                    <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-slate-600 transition-all group-hover/info:text-indigo-400 group-hover/info:rotate-12">
                                                        <IconWalk size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.4em] leading-none mb-2">Transit Segment</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Cover {CAMPUS_GRAPH[node]?.find(e => e.node === result.path[i + 1])?.weight} Unit Meters</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-800">
                                <div className="w-24 h-24 bg-[#070b14] rounded-[3rem] flex items-center justify-center shadow-3xl border border-white/5 mb-8 animate-pulse">
                                    <IconMapPin size={40} className="text-slate-900" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Select Coordinate Pair <br /> for Analysis</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map View Area */}
                <div className="flex-1 relative bg-[#070b14] overflow-hidden group/canvas">
                    <div className="absolute inset-0 flex items-center justify-center p-20 grayscale brightness-150 opacity-10 select-none pointer-events-none group-hover/canvas:opacity-20 transition-opacity duration-1000">
                         <IconNavigation size={600} />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="relative w-full max-w-4xl aspect-square">

                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100">
                                <defs>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                {Object.entries(CAMPUS_GRAPH).map(([fromId, edges]) => (
                                    edges.map((edge) => {
                                        const fromNode = CAMPUS_NODES[fromId as NodeId];
                                        const toNode = CAMPUS_NODES[edge.node];
                                        const inPath = isEdgeInPath(fromId as NodeId, edge.node);

                                        if (fromId > edge.node) return null;

                                        return (
                                            <line
                                                key={`${fromId}-${edge.node}`}
                                                x1={fromNode.x} y1={fromNode.y}
                                                x2={toNode.x} y2={toNode.y}
                                                stroke={inPath ? "#6366f1" : "rgba(255,255,255,0.05)"}
                                                strokeWidth={inPath ? "2" : "0.5"}
                                                strokeLinecap="round"
                                                strokeDasharray={inPath ? "0" : "4 2"}
                                                filter={inPath ? "url(#glow)" : "none"}
                                                className="transition-all duration-1000"
                                            />
                                        );
                                    })
                                ))}
                            </svg>

                            {Object.entries(CAMPUS_NODES).map(([id, node]) => {
                                const isStart = id === start;
                                const isEnd = id === end;
                                const isInPath = result?.path.includes(id as NodeId);

                                return (
                                    <div
                                        key={id}
                                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 z-10`}
                                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                    >
                                        <div className={`flex flex-col items-center gap-4 ${isStart || isEnd ? 'scale-125' : 'scale-100 hover:scale-110'} group/node`}>
                                            <div className={`w-10 h-10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-white border-2 transition-all duration-700 ${
                                                isStart ? 'bg-indigo-600 rotate-0 border-indigo-400 shadow-indigo-600/30 ring-8 ring-indigo-500/10' :
                                                isEnd ? 'bg-rose-600 rotate-[45deg] border-rose-400 shadow-rose-600/30 ring-8 ring-rose-500/10' :
                                                isInPath ? 'bg-indigo-500/40 rotate-0 border-indigo-500/50 backdrop-blur-md' : 'bg-[#0f172a] border-white/5 text-slate-800'
                                            }`}>
                                                <IconMapPin size={isStart || isEnd ? 22 : 14} fill="currentColor" className={isEnd ? "-rotate-[45deg]" : ""} />
                                            </div>

                                            <div className={`bg-[#0f172a]/95 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-3xl text-[8px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap transition-all duration-500 border border-white/10 ${
                                                isStart || isEnd || isInPath ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover/node:opacity-100 group-hover/node:translate-y-0'
                                            }`}>
                                                {node.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
