"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ChevronRight, BookOpen, Code2, Link2, X, ExternalLink, Lock } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { AppUser, Page } from "../types";

interface NavProps {
  user: AppUser | null;
  activeNav: string;
  onNavigate: (page: Page, nav?: string) => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onUpdateUser?: (updatedUser: AppUser) => void;
}

interface SubModule {
  id: string;
  title: string;
  type: "reading" | "sandbox" | "challenge";
  completed: boolean;
  link?: string;
}

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  status: "completed" | "active" | "locked";
  progress: number;
  subModules: SubModule[];
}

const roadmapData: RoadmapNode[] = [
  {
    id: "1",
    title: "Programming Foundations",
    description: "Master core programming concepts, syntax, and problem-solving fundamentals.",
    icon: "⚡",
    color: "#10B981",
    status: "completed",
    progress: 100,
    subModules: [
      { id: "1a", title: "Variables & Data Types", type: "reading", completed: true, link: "#" },
      { id: "1b", title: "Control Flow & Loops", type: "reading", completed: true, link: "#" },
      { id: "1c", title: "Functions & Scope", type: "reading", completed: true, link: "#" },
      { id: "1d", title: "Hello World Challenge", type: "challenge", completed: true },
      { id: "1e", title: "Python Sandbox", type: "sandbox", completed: true },
    ],
  },
  {
    id: "2",
    title: "Data Structures",
    description: "Deep dive into arrays, linked lists, trees, graphs, and hash maps.",
    icon: "🌳",
    color: "#2563EB",
    status: "active",
    progress: 65,
    subModules: [
      { id: "2a", title: "Arrays & Dynamic Arrays", type: "reading", completed: true, link: "#" },
      { id: "2b", title: "Linked Lists", type: "reading", completed: true, link: "#" },
      { id: "2c", title: "Stacks & Queues", type: "reading", completed: false, link: "#" },
      { id: "2d", title: "Trees & Binary Search Trees", type: "reading", completed: false, link: "#" },
      { id: "2e", title: "Hash Maps", type: "reading", completed: false, link: "#" },
      { id: "2f", title: "Data Structures Sandbox", type: "sandbox", completed: true },
      { id: "2g", title: "Linked List Challenge", type: "challenge", completed: false },
    ],
  },
  {
    id: "3",
    title: "Algorithms",
    description: "Sorting, searching, dynamic programming, and algorithmic thinking.",
    icon: "🔢",
    color: "#8B5CF6",
    status: "active",
    progress: 20,
    subModules: [
      { id: "3a", title: "Sorting Algorithms", type: "reading", completed: true, link: "#" },
      { id: "3b", title: "Binary Search", type: "reading", completed: false, link: "#" },
      { id: "3c", title: "Recursion & Backtracking", type: "reading", completed: false, link: "#" },
      { id: "3d", title: "Dynamic Programming", type: "reading", completed: false, link: "#" },
      { id: "3e", title: "Merge Sort Sandbox", type: "sandbox", completed: false },
      { id: "3f", title: "Two Sum Challenge", type: "challenge", completed: false },
    ],
  },
  {
    id: "4",
    title: "Systems Architecture",
    description: "Design scalable, distributed systems with reliability and performance.",
    icon: "🏗️",
    color: "#F59E0B",
    status: "locked",
    progress: 0,
    subModules: [
      { id: "4a", title: "Scalability Principles", type: "reading", completed: false, link: "#" },
      { id: "4b", title: "Load Balancing", type: "reading", completed: false, link: "#" },
      { id: "4c", title: "Databases at Scale", type: "reading", completed: false, link: "#" },
      { id: "4d", title: "Microservices", type: "reading", completed: false, link: "#" },
      { id: "4e", title: "Architecture Sandbox", type: "sandbox", completed: false },
    ],
  },
  {
    id: "5",
    title: "Frontend Engineering",
    description: "Build polished, performant user interfaces with React and modern tooling.",
    icon: "🎨",
    color: "#EC4899",
    status: "locked",
    progress: 0,
    subModules: [
      { id: "5a", title: "HTML & CSS Fundamentals", type: "reading", completed: false, link: "#" },
      { id: "5b", title: "JavaScript Deep Dive", type: "reading", completed: false, link: "#" },
      { id: "5c", title: "React Framework", type: "reading", completed: false, link: "#" },
      { id: "5d", title: "State Management", type: "reading", completed: false, link: "#" },
      { id: "5e", title: "Component Sandbox", type: "sandbox", completed: false },
    ],
  },
];

function SubModuleIcon({ type }: { type: SubModule["type"] }) {
  if (type === "reading") return <BookOpen size={14} />;
  if (type === "sandbox") return <Code2 size={14} />;
  return <Link2 size={14} />;
}

function SubModulePanel({ node, onClose, onToggle }: {
  node: RoadmapNode;
  onClose: () => void;
  onToggle: (nodeId: string, subId: string) => void;
}) {
  const typeLabel = (type: SubModule["type"]) => {
    if (type === "reading") return { label: "Reading", color: "#2563EB" };
    if (type === "sandbox") return { label: "Sandbox", color: "#10B981" };
    return { label: "Challenge", color: "#F59E0B" };
  };

  return (
    <div
      className="fixed right-0 top-14 bottom-0 w-full max-w-md border-l z-40 flex flex-col animate-fade-in overflow-y-auto"
      style={{ backgroundColor: '#161B22', borderColor: '#2D3748' }}
    >
      {/* Panel Header */}
      <div
        className="flex items-start justify-between p-6 border-b sticky top-0"
        style={{ borderColor: '#2D3748', backgroundColor: '#161B22' }}
      >
        <div>
          <div className="text-2xl mb-2">{node.icon}</div>
          <h3
            className="text-lg font-bold font-display"
            style={{ color: '#F8FAFC' }}
          >
            {node.title}
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '13px' }} className="mt-1">
            {node.description}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white hover:bg-opacity-10 mt-1 cursor-pointer"
          style={{ color: '#94A3B8', flexShrink: 0 }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span style={{ color: '#94A3B8', fontSize: '13px' }}>Progress</span>
          <span style={{ color: node.color, fontSize: '13px', fontWeight: 600 }}>{node.progress}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#2D3748' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${node.progress}%`, backgroundColor: node.color }}
          />
        </div>
      </div>

      {/* Sub Modules */}
      <div className="px-6 pb-6 space-y-2 flex-1 font-sans">
        <h4 className="text-sm font-semibold mb-3" style={{ color: '#94A3B8' }}>
          MODULES ({node.subModules.filter(s => s.completed).length}/{node.subModules.length} completed)
        </h4>
        {node.subModules.map(sub => {
          const { label, color } = typeLabel(sub.type);
          return (
            <div
              key={sub.id}
              className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:border-opacity-80 cursor-pointer"
              style={{
                backgroundColor: sub.completed ? `${node.color}10` : '#0D1117',
                borderColor: sub.completed ? `${node.color}40` : '#2D3748',
              }}
              onClick={() => {
                if (node.status !== "locked") onToggle(node.id, sub.id);
              }}
            >
              <div style={{ color: sub.completed ? node.color : '#4A5568', flexShrink: 0 }}>
                {sub.completed
                  ? <CheckCircle2 size={18} />
                  : <Circle size={18} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: sub.completed ? '#F8FAFC' : '#94A3B8',
                      fontSize: '14px',
                      fontWeight: sub.completed ? 500 : 400,
                    }}
                  >
                    {sub.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span style={{ color, fontSize: '11px' }}>
                    <SubModuleIcon type={sub.type} />
                  </span>
                  <span style={{ color: '#4A5568', fontSize: '11px' }}>{label}</span>
                </div>
              </div>
              {sub.link && (
                <ExternalLink size={14} style={{ color: '#4A5568', flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RoadmapPage({ user, activeNav, onNavigate, onLogout, theme, onToggleTheme, onUpdateUser }: NavProps) {
  const [roadmaps, setRoadmaps] = useState<{ _id: string; title: string; description: string }[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>("");
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; sub: string; visible: boolean }>({ message: "", sub: "", visible: false });

  const showToastMessage = (message: string, sub: string) => {
    setToast({ message, sub, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/roadmaps");
        const data = await res.json();
        if (data.success && data.roadmap) {
          setRoadmaps(data.roadmap);
          if (data.roadmap.length > 0) {
            // Pick "Backend" by default if present, otherwise first available
            const defaultMap = data.roadmap.find((r: any) => r.title.toLowerCase().includes("backend")) || data.roadmap[0];
            setSelectedRoadmapId(defaultMap._id);
          }
        }
      } catch (err) {
        console.error("Error fetching roadmaps list:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (!selectedRoadmapId) return;
    const fetchRoadmapDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/roadmaps/${selectedRoadmapId}`);
        const data = await res.json();
        if (data.success && data.roadmap) {
          const detail = data.roadmap;
          const mappedNodes: RoadmapNode[] = (detail.sections || []).map((sec: any, idx: number) => {
            const emojis = ["⚡", "🌳", "🔢", "🏗️", "🎨", "📦", "🗺️", "🔐", "💎", "🐳", "🚀", "🛡️", "🧬", "📊", "🎯"];
            const colors = ["#10B981", "#2563EB", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#06B6D4", "#EF4444", "#3B82F6", "#059669"];
            
            const subModules = [
              { id: `${sec._id}-read`, title: `${sec.title} Handbook Guide`, type: "reading" as const, completed: false, link: "https://www.google.com/search?q=" + encodeURIComponent(sec.title + " computer science guide reference") },
              { id: `${sec._id}-sand`, title: `${sec.title} Playground`, type: "sandbox" as const, completed: false },
              { id: `${sec._id}-chal`, title: `${sec.title} Technical Interview Challenge`, type: "challenge" as const, completed: false }
            ];

            let status: "completed" | "active" | "locked" = "locked";
            if (idx === 0) {
              status = "active";
            }

            return {
              id: sec._id,
              title: sec.title,
              description: `Master ${sec.title} concepts. Learn structural rules, analyze tradeoffs, and master core tools.`,
              icon: emojis[idx % emojis.length],
              color: colors[idx % colors.length],
              status,
              progress: 0,
              subModules
            };
          });
          setNodes(mappedNodes);
          setSelectedNode(null); 
        }
      } catch (err) {
        console.error("Error fetching roadmap detail:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoadmapDetail();
  }, [selectedRoadmapId]);

  const handleNodeClick = (node: RoadmapNode) => {
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
    }
  };

  const handleToggleSubModule = (nodeId: string, subId: string) => {
    let xpDiff = 0;
    let nodeCompletedBonus = false;

    // Evaluate XP difference before updating the nodes state
    const matchedN = nodes.find(n => n.id === nodeId);
    if (matchedN) {
      const matchedSub = matchedN.subModules.find(s => s.id === subId);
      if (matchedSub) {
        if (!matchedSub.completed) {
          xpDiff += 15;
          const unfinishedSubs = matchedN.subModules.filter(s => s.id !== subId && !s.completed);
          if (unfinishedSubs.length === 0) {
            nodeCompletedBonus = true;
            xpDiff += 50;
          }
        } else {
          xpDiff -= 15;
          const allCompletedBefore = matchedN.subModules.every(s => s.completed);
          if (allCompletedBefore) {
            xpDiff -= 50;
          }
        }
      }
    }

    if (xpDiff !== 0 && onUpdateUser && user) {
      const currentXP = user.xp || 0;
      const newXP = Math.max(0, currentXP + xpDiff);
      const currentLevel = user.level || 1;
      const newLevel = Math.floor(newXP / 100) + 1;

      onUpdateUser({
        ...user,
        xp: newXP,
        level: newLevel,
      });

      if (xpDiff > 0) {
        let msg = `Gained +${xpDiff} XP!`;
        let sText = `Successfully advanced backend competency.`;
        if (nodeCompletedBonus) {
          msg = `Module Fully Complete! +65 XP! 🎉`;
          sText = `Awarded maximum module mastery points.`;
        }
        if (newLevel > currentLevel) {
          msg = `LEVEL UP! LEVEL ${newLevel}! 🚀`;
          sText = `Fantastic work! You have advanced to Level ${newLevel}.`;
        }
        showToastMessage(msg, sText);
      } else {
        showToastMessage(`Removed ${Math.abs(xpDiff)} XP`, `Task status updated.`);
      }
    }

    setNodes(prev => {
      const updatedNodes = prev.map(n => {
        if (n.id !== nodeId) return n;
        const updatedSubs = n.subModules.map(s =>
          s.id === subId ? { ...s, completed: !s.completed } : s
        );
        const completedCount = updatedSubs.filter(s => s.completed).length;
        const progress = Math.round((completedCount / updatedSubs.length) * 100);
        const status = progress === 100 ? "completed" as const : "active" as const;
        return { ...n, subModules: updatedSubs, progress, status };
      });

      // Sequential unlocking
      for (let i = 0; i < updatedNodes.length - 1; i++) {
        if (updatedNodes[i].status === "completed" && updatedNodes[i + 1].status === "locked") {
          updatedNodes[i + 1].status = "active";
        }
      }

      setTimeout(() => {
        const matchingNode = updatedNodes.find(n => n.id === nodeId);
        if (matchingNode) {
          setSelectedNode(matchingNode);
        }
      }, 0);

      return updatedNodes;
    });
  };

  const isDark = theme === "dark";
  const activeRoadmap = roadmaps.find(r => r._id === selectedRoadmapId);

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDark ? '#101418' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', transition: 'background-color 0.2s, color 0.2s' }}>
      <Navbar user={user} activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />

      <main className="pt-14 flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${selectedNode ? 'mr-[400px]' : ''}`}>
          <div className="max-w-4xl mx-auto px-6 py-12">
            
            {/* Header */}
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
                style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', backgroundColor: isDark ? '#161B22' : '#FFFFFF' }}
              >
                <span className="text-[11px] tracking-wider font-semibold" style={{ color: isDark ? '#94A3B8' : '#475569' }}>CS LEARNING PATHWAYS</span>
              </div>
              <h1
                className="text-4xl font-bold mb-3 font-display"
                style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}
              >
                {activeRoadmap?.title || "Computer Science Roadmaps"}
              </h1>
              <p style={{ color: isDark ? '#94A3B8' : '#475569' }} className="text-sm">
                {activeRoadmap?.description || "A sequential curriculum tree from fundamentals to advanced systems. Click any node to explore modules."}
              </p>
            </div>

            {/* Dynamic Track Selector Card */}
            <div className="mb-10 p-5 rounded-2xl border transition-all duration-200" style={{ backgroundColor: isDark ? '#161B22' : '#FFFFFF', borderColor: isDark ? '#2D3748' : '#E2E8F0' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-wide uppercase" style={{ color: isDark ? '#10B981' : '#059669' }}>
                    Active Learning Track
                  </h3>
                  <p className="text-xs" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                    Choose between 15 professional branches loaded live from our database sandbox.
                  </p>
                </div>
                <div className="relative min-w-[240px]">
                  <select
                    value={selectedRoadmapId}
                    onChange={(e) => setSelectedRoadmapId(e.target.value)}
                    className="w-full text-xs font-bold uppercase tracking-wider p-3 rounded-xl border outline-none cursor-pointer appearance-none pr-10"
                    style={{
                      backgroundColor: isDark ? '#0D1117' : '#F8FAFC',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      borderColor: isDark ? '#2D3748' : '#CBD5E1',
                    }}
                  >
                    {roadmaps.map(r => (
                      <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                    <ChevronRight size={14} className="transform rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-10 h-10 border-4 border-t-[#2563EB] rounded-full animate-spin" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', borderTopColor: '#2563EB' }} />
                <p className="text-xs font-mono font-bold tracking-wider animate-pulse" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
                  FETCHING REAL-TIME SECURE DATA...
                </p>
              </div>
            )}

            {/* Roadmap Flow */}
            {!isLoading && nodes.length === 0 && (
              <div className="text-center py-16 border rounded-2xl" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', backgroundColor: isDark ? '#161B22' : '#FFFFFF' }}>
                <p style={{ color: isDark ? '#94A3B8' : '#475569' }}>No curriculum steps found for this layout.</p>
              </div>
            )}

            {!isLoading && nodes.length > 0 && (
              <div className="relative">
                {nodes.map((node, index) => (
                  <div key={node.id} className="relative">
                    {/* Connector Line */}
                    {index < nodes.length - 1 && (
                      <div
                        className="absolute left-9 top-full w-0.5 z-0"
                        style={{
                          height: '40px',
                          backgroundColor: node.status === 'completed' ? node.color : (isDark ? '#2D3748' : '#E2E8F0'),
                        }}
                      />
                    )}

                    {/* Node Card */}
                    <div
                      className="relative flex items-start gap-5 p-5 rounded-2xl border mb-10 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      style={{
                        backgroundColor: selectedNode?.id === node.id 
                          ? `${node.color}15` 
                          : (isDark ? '#161B22' : '#FFFFFF'),
                        borderColor: selectedNode?.id === node.id 
                          ? node.color 
                          : node.status === 'locked' 
                          ? (isDark ? '#1E293B' : '#F1F5F9') 
                          : (isDark ? '#2D3748' : '#E2E8F0'),
                        opacity: node.status === 'locked' ? 0.55 : 1,
                        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* Icon Circle */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                        style={{
                          backgroundColor: node.status === 'locked' ? (isDark ? '#1E293B' : '#F1F5F9') : `${node.color}20`,
                          border: `2px solid ${node.status === 'locked' ? (isDark ? '#2D3748' : '#E2E8F0') : node.color}`,
                        }}
                      >
                        {node.status === 'locked' ? <Lock size={20} style={{ color: isDark ? '#4A5568' : '#94A3B8' }} /> : node.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3
                            className="font-bold text-base font-display"
                            style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}
                          >
                            {node.title}
                          </h3>
                          {/* Status Badge */}
                          <span
                            className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: node.status === 'completed'
                                ? '#10B98120'
                                : node.status === 'active'
                                ? '#2563EB20'
                                : (isDark ? '#2D3748' : '#F1F5F9'),
                              color: node.status === 'completed'
                                ? '#10B981'
                                : node.status === 'active'
                                ? '#2563EB'
                                : (isDark ? '#4A5568' : '#64748B'),
                            }}
                          >
                            {node.status === 'completed' ? 'Completed' : node.status === 'active' ? 'Active' : 'Locked'}
                          </span>
                        </div>
                        <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '13px' }} className="font-sans mb-3 leading-relaxed">
                          {node.description}
                        </p>

                        {/* Progress Bar */}
                        {node.status !== 'locked' && (
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden animate-pulse-glow" style={{ backgroundColor: isDark ? '#2D3748' : '#E2E8F0' }}>
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${node.progress}%`, backgroundColor: node.color }}
                              />
                            </div>
                            <span style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '12px', flexShrink: 0 }} className="font-mono">
                              {node.subModules.filter(s => s.completed).length}/{node.subModules.length} lessons
                            </span>
                          </div>
                        )}
                      </div>

                      <ChevronRight
                        size={18}
                        style={{
                          color: isDark ? '#4A5568' : '#94A3B8',
                          transform: selectedNode?.id === node.id ? 'rotate(90deg)' : 'none',
                          transition: 'transform 200ms',
                          flexShrink: 0,
                          marginTop: '4px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        {selectedNode && (
          <SubModulePanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onToggle={handleToggleSubModule}
          />
        )}
      </main>

      <Footer />

      {/* FLOATING XP EVENT TOAST */}
      {toast.visible && (
        <div 
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex flex-col gap-1 transition-all duration-300 animate-slide-in"
          style={{ 
            backgroundColor: isDark ? '#161B22' : '#FFFFFF', 
            borderColor: '#2563EB', 
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.25)' 
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#2563EB] font-bold text-xs uppercase tracking-wider">⚡ XP COMPLIANCE UPDATE</span>
          </div>
          <p className="text-sm font-extrabold" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{toast.message}</p>
          <p className="text-[11px]" style={{ color: isDark ? '#94A3B8' : '#475569' }}>{toast.sub}</p>
        </div>
      )}
    </div>
  );
}
