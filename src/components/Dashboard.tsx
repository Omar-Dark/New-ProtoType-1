"use client";

import { useState, useEffect } from "react";
import { Terminal, Globe, BookOpen, Layers, Zap, Code2, Shield, Heart, HelpCircle, ChevronRight, Check } from "lucide-react";
import { motion } from "motion/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RadarChart from "./RadarChart";
import type { AppUser, Page } from "../types";

interface DashboardProps {
  user: AppUser | null;
  activeNav: string;
  onNavigate: (page: Page, nav?: string) => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onUpdateUser?: (updatedUser: AppUser) => void;
}

// 5 White Men Team Members
const teamMembers = [
  {
    name: "Youssef Zidan",
    role: "Founder & CEO",
    roleColor: "#2563EB",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
  {
    name: "Ahmed Waleed",
    role: "Design Lead",
    roleColor: "#2563EB",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
  {
    name: "Abraam Michel",
    role: "HR",
    roleColor: "#2563EB",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
  {
    name: "Ali Mansour",
    role: "API",
    roleColor: "#2563EB",
    img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
  {
    name: "Omar Mosaad",
    role: "Head of Engineering",
    roleColor: "#2563EB",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  },
];

const pillars = [
  {
    title: "Architecture First",
    desc: "We teach patterns, not just syntax. Understanding the 'why' is as important as the 'how'.",
    borderColor: "#2563EB",
    icon: Layers,
  },
  {
    title: "Precision Tools",
    desc: "Our built-in IDE and sandbox environments are designed for real-world production performance.",
    borderColor: "#4A5568",
    icon: Terminal,
  },
  {
    title: "Guided Mastery",
    desc: "Paths are curated by experts to ensure you never hit a wall or learn deprecated technologies.",
    borderColor: "#10B981",
    icon: Zap,
  },
];

// Course list with all progress strictly forced to 0% and starting Level = 0
const libraryCourses = [
  { title: "Frontend Development", lessons: 42, icon: "🎨", color: "#2563EB", level: "Beginner", progress: 0 },
  { title: "Data Structures & Algorithms", lessons: 38, icon: "🌳", color: "#10B981", level: "Intermediate", progress: 0 },
  { title: "System Design", lessons: 24, icon: "⚙️", color: "#8B5CF6", level: "Advanced", progress: 0 },
  { title: "DevOps & Cloud", lessons: 31, icon: "☁️", color: "#F59E0B", level: "Intermediate", progress: 0 },
  { title: "Machine Learning", lessons: 45, icon: "🤖", color: "#EC4899", level: "Intermediate", progress: 0 },
  { title: "Database Engineering", lessons: 28, icon: "🗄️", color: "#06B6D4", level: "All Levels", progress: 0 },
];

const dashboardProjects = [
  { title: "Build an Express-like Router", lessons: 8, icon: "⚙️", color: "#2563EB", level: "Intermediate", progress: 0, desc: "Write a high-performance HTTP multiplexer from scratch." },
  { title: "Custom Web IDE Sandbox", lessons: 12, icon: "💻", color: "#10B981", level: "Advanced", progress: 0, desc: "Implement in-browser dynamic bundling and output piping." },
  { title: "Visual SVG Git Tree Viewer", lessons: 6, icon: "🌳", color: "#8B5CF6", level: "Beginner", progress: 0, desc: "Map commit graphs into lightweight nested geometric paths." },
  { title: "State Engine with Proxies", lessons: 10, icon: "🧠", color: "#F59E0B", level: "Advanced", progress: 0, desc: "Develop a reactive micro-framework with JS getters and setters." },
];

const radarData = [
  { label: "JavaScript", value: 85 },
  { label: "CSS", value: 78 },
  { label: "HTML", value: 90 },
  { label: "Python", value: 65 },
  { label: "SQL", value: 72 },
  { label: "Git", value: 80 },
];

export default function Dashboard({ user, activeNav, onNavigate, onLogout, theme, onToggleTheme, onUpdateUser }: DashboardProps) {
  const isDark = theme === "dark";

  const [projectProgress, setProjectProgress] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ message: string; sub: string; visible: boolean }>({ message: "", sub: "", visible: false });

  const showToastMessage = (message: string, sub: string) => {
    setToast({ message, sub, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4500);
  };

  const handleUpdateProjectProgress = (title: string, color: string) => {
    const currentProg = projectProgress[title] || 0;
    if (currentProg === 100) return; // already completed

    const nextProg = Math.min(100, currentProg + 25);
    setProjectProgress(prev => ({ ...prev, [title]: nextProg }));

    // Gained +20 XP per chunk, plus +80 XP bonus on hitting 100%!
    let xpAwarded = 20;
    let titleCompleted = false;

    if (nextProg === 100) {
      xpAwarded += 80; // +100 total
      titleCompleted = true;
    }

    if (onUpdateUser && user) {
      const currentXP = user.xp || 0;
      const newXP = currentXP + xpAwarded;
      const currentLevel = user.level || 1;
      const newLevel = Math.floor(newXP / 100) + 1;

      onUpdateUser({
        ...user,
        xp: newXP,
        level: newLevel,
      });

      if (titleCompleted) {
        let msg = `Project Completed! +100 XP! 🏆`;
        let sText = `"${title}" has been added to your professional workspace portfolio successfully.`;
        if (newLevel > currentLevel) {
          msg = `LEVEL UP! LEVEL ${newLevel}! 🚀`;
          sText = `Outstanding job completion! You've level-advanced to Level ${newLevel}!`;
        }
        showToastMessage(msg, sText);
      } else {
        showToastMessage(`Building Project... +20 XP!`, `Pushed progress on "${title}" to ${nextProg}% matches.`);
      }
    }
  };

  // Styles utility mapper
  const styles = {
    bg: isDark ? '#101418' : '#F8FAFC',
    card: isDark ? '#161B22' : '#FFFFFF',
    text: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#475569',
    border: isDark ? '#2E384D' : '#E2E8F0',
    innerBg: isDark ? '#0D1117' : '#F1F5F9',
  };

  const currentTab = activeNav || "Home";

  const [projects, setProjects] = useState(dashboardProjects);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success && data.projects) {
          const mapped = data.projects.map((p: any, idx: number) => {
            const colors = ["#2563EB", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"];
            const icons = ["⚙️", "💻", "🌳", "🧠", "🔮", "⚡", "🛡️", "🧬"];
            const chosenColor = p.color || colors[idx % colors.length];
            const chosenIcon = p.icon || icons[idx % icons.length];
            
            return {
              title: p.title || "Custom Engineering Project",
              lessons: p.topicsCount || p.lessons || 8,
              icon: chosenIcon,
              color: chosenColor,
              level: p.rank || p.complexity || p.level || "Intermediate",
              progress: 0,
              desc: p.description || p.desc || "Dive deep into modern real-world engineering concepts by building robust production systems."
            };
          });
          setProjects(mapped);
        }
      } catch (err) {
        console.error("Error fetching projects list:", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: styles.bg, color: styles.text, transition: 'background-color 0.2s, color 0.2s' }}>
      <Navbar user={user} activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />

      <main className="pt-14 pb-16">
        {/* ==================================== TAB 1: HOME LANDING PAGE ==================================== */}
        {currentTab === "Home" && (
          <div className="space-y-24">
            {/* Hero Heading Section */}
            <section className="text-center pt-24 pb-12 px-6 max-w-5xl mx-auto space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', backgroundColor: isDark ? '#161B22' : '#FFFFFF' }}>
                <span className="text-[#2563EB] tracking-wider uppercase font-bold text-[10px]">✨ NEW: AI-POWERED LEARNING PATHS</span>
              </div>

              <h1
                className="text-5xl md:text-7xl font-bold leading-tight tracking-tight max-w-4xl mx-auto font-display"
                style={{
                  background: isDark ? 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)' : 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Master the Path to Engineering Excellence
              </h1>

              <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans" style={{ color: styles.textMuted }}>
                Stop wandering through endless tutorials. Follow curated, project-based roadmaps designed by industry experts to take you from hello world to senior engineer.
              </p>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate("roadmap", "Roadmaps")}
                  className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-105 cursor-pointer shadow-lg"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Get Started for Free
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("dashboard", "About")}
                  className="px-6 py-3 rounded-lg text-sm font-semibold border transition-all hover:bg-black hover:bg-opacity-5 cursor-pointer"
                  style={{ borderColor: styles.border, color: styles.text }}
                >
                  View Team & Mission
                </button>
              </div>

              {/* IDE Interactive Mockup */}
              <div className="pt-12 max-w-5xl mx-auto">
                <div
                  className="rounded-2xl border overflow-hidden shadow-2xl transition-all"
                  style={{ backgroundColor: isDark ? '#0D1117' : '#FFFFFF', borderColor: styles.border }}
                >
                  {/* macOS controls */}
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: styles.border, backgroundColor: isDark ? '#161B22' : '#F1F5F9' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[11px] font-mono" style={{ color: styles.textMuted }}>DevPath Interactive Sandboxed Sandbox Shell</span>
                    <div className="w-12" />
                  </div>

                  {/* Editor mockup layout */}
                  <div className="grid grid-cols-1 md:grid-cols-4 text-left font-mono text-xs">
                    {/* Folder Tree */}
                    <div className="p-4 border-r hidden md:block" style={{ borderColor: styles.border, backgroundColor: isDark ? '#090D10' : '#F8FAFC' }}>
                      <p className="font-bold uppercase tracking-wider text-[10px] mb-4 text-blue-500">Workspace</p>
                      <div className="space-y-2" style={{ color: styles.textMuted }}>
                        <p className="text-blue-500">📁 components</p>
                        <p className="pl-4">📄 CodeEditor.tsx</p>
                        <p className="pl-4">📄 Compiler.ts</p>
                        <p className="pl-4">📄 Sandbox.tsx</p>
                        <p>📁 roadmaps</p>
                        <p className="pl-4">📄 system_design.json</p>
                        <p className="pl-4 text-emerald-500">📄 level0_novice.json ✓</p>
                        <p>📄 package.json</p>
                        <p>📄 tsconfig.json</p>
                      </div>
                    </div>

                    {/* Editor view */}
                    <div className="col-span-3 p-6 space-y-4" style={{ backgroundColor: isDark ? '#0D1117' : '#FFFFFF' }}>
                      <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: styles.border }}>
                        <span className="text-[#2563EB] font-bold">📄 main.tsx</span>
                        <span className="text-gray-400 font-normal">| Editor active</span>
                      </div>
                      <pre className="overflow-x-auto leading-relaxed text-[11px] md:text-xs text-left" style={{ color: isDark ? '#DEFF9A' : '#1E3A5F' }}>
{`import { createSandbox } from "devpath-core";

function compileAndVerify() {
  const profile_level = 0; // Novice Starting Value
  const course_progress = 0; // Forced Initialization Progress
  
  console.log(\`Running sandbox template compilation. Level: \${profile_level}\`);
  return createSandbox({
    autoLint: true,
    initialProgress: course_progress
  });
}

compileAndVerify().run();`}
                      </pre>
                      <div className="rounded-xl border p-4 bg-emerald-500/10 border-emerald-500/30">
                        <p className="text-emerald-500 font-bold flex items-center gap-1.5">
                          <Check size={14} /> Compiler active: Sandboxes set to 0% progress & level 0!
                        </p>
                        <p className="text-[11px]" style={{ color: styles.textMuted }}>Outputs nominal, system is fully responsive and verified.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistics Banner */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl border" style={{ borderColor: styles.border, backgroundColor: styles.card }}>
                <div className="text-center lg:text-left space-y-1">
                  <h3 className="text-3xl font-extrabold" style={{ color: '#2563EB' }}>50,000+</h3>
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: styles.textMuted }}>Active Students</p>
                </div>
                <div className="text-center lg:text-left space-y-1">
                  <h3 className="text-3xl font-extrabold" style={{ color: '#2563EB' }}>100+</h3>
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: styles.textMuted }}>Expert Roadmaps</p>
                </div>
                <div className="text-center lg:text-left space-y-1">
                  <h3 className="text-3xl font-extrabold" style={{ color: '#2563EB' }}>500+</h3>
                  <p className="text-xs uppercase tracking-widest font-bold" style={{ color: styles.textMuted }}>Real-world Projects</p>
                </div>
                <div className="text-center lg:text-left space-y-1 border-t lg:border-t-0 pt-4 lg:pt-0 col-span-2 lg:col-span-1 border-gray-100 dark:border-gray-800">
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: styles.textMuted }}>TRUSTED BY ENGINEERS FROM</p>
                  <div className="flex gap-4 items-center justify-center lg:justify-start pt-2 opacity-70">
                    <Globe size={18} />
                    <Terminal size={18} />
                    <Code2 size={18} />
                    <span className="font-bold text-xs">FAANG</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Engineered for Deep Learning */}
            <section className="max-w-7xl mx-auto px-6 space-y-12">
              <div className="text-left max-w-xl">
                <h2 className="text-3xl font-bold font-display" style={{ color: styles.text }}>Engineered for Deep Learning</h2>
                <p style={{ color: styles.textMuted, fontSize: '14px' }}>Precision tools built by developers, for developers.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Card 1: Interactive Roadmaps */}
                <div className="lg:col-span-3 rounded-2xl border p-8 flex flex-col justify-between" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#2563EB]/10 text-[#2563EB]">
                      <Layers size={20} />
                    </div>
                    <h3 className="text-2xl font-bold font-display">Interactive Roadmaps</h3>
                    <p style={{ color: styles.textMuted }}>Visualize your journey with non-linear paths. Jump between modules based on your current skill level and goals.</p>
                  </div>
                  <div className="mt-8 border-t pt-6 flex gap-4 overflow-hidden" style={{ borderColor: styles.border }}>
                    {/* Simulating nodes */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-[10px] font-bold text-white">0</div>
                      <span className="text-[11px] font-mono">Novice Profile Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-gray-300" />
                      <div className="w-6 h-6 rounded-full border border-[#2563EB] flex items-center justify-center text-[10px] text-[#2563EB] font-semibold">1</div>
                      <span className="text-[11px] font-mono">Variables</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Industry Verified */}
                <div className="lg:col-span-2 rounded-2xl border p-8 flex flex-col justify-between" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                      <Shield size={20} />
                    </div>
                    <h3 className="text-2xl font-bold font-display">Industry Verified</h3>
                    <p style={{ color: styles.textMuted }}>Earn credentials that matter. Our certifications are backed by performance in real projects.</p>
                  </div>
                  <div className="mt-8 p-4 rounded-xl border text-left flex items-center gap-3" style={{ borderColor: styles.border, backgroundColor: styles.innerBg }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#10B981]" />
                    <div>
                      <h4 className="font-bold text-xs">Alex Developer</h4>
                      <p className="text-[10px]" style={{ color: styles.textMuted }}>Level 0 Learner • Unlocked Feb 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Visual Data-Driven Growth with Radar */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-10 rounded-2xl border" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold font-display">Visual Data-Driven Growth</h3>
                  <p style={{ color: styles.textMuted, fontSize: '15px', lineHeight: '1.6' }}>
                    Our Skill Radar analyzes your code submissions to provide an objective look at your technical depth across different dimensions like Scalability, Security, and Syntax.
                  </p>
                  <div className="flex gap-4">
                    <div className="p-4 rounded-xl flex-1 border" style={{ borderColor: styles.border, backgroundColor: styles.innerBg }}>
                      <span className="text-[10px] uppercase font-bold text-blue-500">Frontend</span>
                      <p className="font-bold text-lg">Advanced</p>
                    </div>
                    <div className="p-4 rounded-xl flex-1 border" style={{ borderColor: styles.border, backgroundColor: styles.innerBg }}>
                      <span className="text-[10px] uppercase font-bold text-emerald-500">Algorithms</span>
                      <p className="font-bold text-lg">Intermediate</p>
                    </div>
                  </div>
                </div>
                {/* Radar Chart Component Integration */}
                <div className="flex items-center justify-center bg-[#101418]/10 dark:bg-[#101418]/50 p-6 rounded-2xl border" style={{ borderColor: styles.border }}>
                  <RadarChart data={radarData} size={280} />
                </div>
              </div>
            </section>

            {/* The Workspace of Tomorrow */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-left">
                  <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">INTEGRATED ENVIRONMENT</span>
                  <h3 className="text-4xl font-extrabold font-display">The Workspace of Tomorrow</h3>
                  <p style={{ color: styles.textMuted, fontSize: '15px', lineHeight: '1.6' }}>
                    Forget switching tabs. DevPath IDE brings the roadmap, the documentation, and the terminal into a single, cohesive interface.
                  </p>
                  <div className="space-y-4 pt-2">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Cloud-Native Code Editor</h4>
                        <p className="text-xs" style={{ color: styles.textMuted }}>Pre-configured environments for every project node.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Real-time Linting & Feedback</h4>
                        <p className="text-xs" style={{ color: styles.textMuted }}>Get instant validation as you follow the path.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monitor display mockup */}
                <div className="relative p-6 rounded-3xl border shadow-2xl" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                  <div className="rounded-xl overflow-hidden border bg-[#0D1117] aspect-video flex flex-col justify-between p-4" style={{ borderColor: styles.border }}>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <span className="text-[9px] font-mono text-gray-500">DevPath Workspace Terminal</span>
                    </div>

                    <div className="flex-1 font-mono text-[10px] text-green-400 py-3 space-y-1 text-left">
                      <p className="text-slate-500">$ npx devpath-lint --file index.tsx</p>
                      <p>✓ index.tsx has zero syntax warnings!</p>
                      <p className="text-blue-400">{"->"} Project progress synchronized with level 0.</p>
                      <p className="text-slate-500">$ npm run dev (serving on host 0.0.0.0, port 3000)</p>
                    </div>

                    <div className="h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[9px] font-extrabold uppercase tracking-widest leading-none">
                      SUCCESS - SANDBOX COMPILED nominal
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-6 text-center space-y-12">
              <div className="space-y-2">
                <h3 className="text-4xl font-extrabold font-display">Loved by Developers Worldwide</h3>
                <p style={{ color: styles.textMuted, fontSize: '14px' }}>From bootcamp grads to FAANG engineers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {[
                  { name: "Alex Chen", role: "Software Engineer @ Meta", text: "DevPath's node-based approach helped me finally understand system design. It's like having a senior mentor guiding you 24/7." },
                  { name: "Sarah Jenkins", role: "Frontend Lead @ Stripe", text: "The integrated IDE is a game changer. I spent less time setting up my environment and more time actually building features." },
                  { name: "Marcus Thorne", role: "CTO @ Vercel", text: "The curriculum is the most up-to-date I've seen. We now use DevPath to onboard all our junior hires." }
                ].map(item => (
                  <div key={item.name} className="p-6 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                    <p style={{ color: styles.text, fontSize: '13.5px', lineHeight: '1.6' }} className="italic font-normal">
                      &quot;{item.text}&quot;
                    </p>
                    <div className="flex items-center gap-3 pt-6 border-t mt-6" style={{ borderColor: styles.border }}>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center font-bold text-xs text-white uppercase">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">{item.name}</h4>
                        <p className="text-[10px]" style={{ color: styles.textMuted }}>{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Blue CTA Banner */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="rounded-2xl p-12 text-center text-white flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #1E293B 100%)', border: '1px solid #1E3A5F' }}>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-3 font-display">Ready to master your path?</h3>
                <p className="max-w-2xl text-slate-200 text-sm md:text-base mb-8">
                  Join over 50,000 developers building the future of software engineering. Start your first roadmap today.
                </p>
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <button
                    onClick={() => onNavigate("roadmap", "Roadmaps")}
                    className="px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase bg-white text-[#2563EB] hover:scale-105 transition-all cursor-pointer"
                  >
                    Start Coding Now
                  </button>
                  <button
                    onClick={() => onNavigate("dashboard", "About")}
                    className="px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase border border-white/30 text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Request Demo
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================================== TAB 2: COURSE LIBRARY (0% PROGRESS) ==================================== */}
        {currentTab === "Library" && (
          <div className="max-w-7xl mx-auto px-6 pt-12 space-y-10">
            <div className="text-left space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Course Library</span>
              <h1 className="text-4xl font-extrabold font-display">Build Real Systems</h1>
              <p style={{ color: styles.textMuted }}>All templates set to level 0. Finish quizzes to level up your competency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryCourses.map(course => (
                <div
                  key={course.title}
                  className="rounded-2xl p-6 border transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: styles.card,
                    borderColor: styles.border,
                  }}
                >
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <h3 className="font-bold text-base mb-2 font-display">{course.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ color: styles.textMuted, fontSize: '13px' }}>{course.lessons} lessons</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                      {course.level}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: styles.textMuted }}>
                      <span>Course Completion</span>
                      <span>{course.progress}%</span>
                    </div>
                    {/* Progress slider strictly filled to 0% */}
                    <div className="h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <div className="h-full rounded-full" style={{ width: '0%', backgroundColor: course.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================== TAB 3: PROJECTS (0% PROGRESS) ==================================== */}
        {currentTab === "Projects" && (
          <div className="max-w-7xl mx-auto px-6 pt-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="text-left space-y-2 max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Curated Projects</span>
                <h1 className="text-4xl font-extrabold font-display">Engineering Projects</h1>
                <p style={{ color: styles.textMuted }}>Submit dynamic sandboxed repositories. Current completion level: 0%.</p>
              </div>
              {loadingProjects && (
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] animate-pulse">
                  <div className="w-3 h-3 border-2 border-t-[#2563EB] rounded-full animate-spin" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', borderTopColor: '#2563EB' }} />
                  <span>Syncing Secure Project Database...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(proj => {
                const prog = projectProgress[proj.title] || 0;
                return (
                  <div
                    key={proj.title}
                    className="rounded-2xl p-6 border transition-all hover:scale-[1.01] flex flex-col justify-between"
                    style={{
                      backgroundColor: styles.card,
                      borderColor: styles.border,
                    }}
                  >
                    <div className="space-y-3">
                      <div className="text-4xl">{proj.icon}</div>
                      <h3 className="font-bold text-lg font-display">{proj.title}</h3>
                      <p className="text-xs leading-relaxed dark:text-gray-300" style={{ color: styles.textMuted }}>{proj.desc}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${proj.color}20`, color: proj.color }}>
                          {proj.level}
                        </span>
                        <span className="text-[11px]" style={{ color: styles.textMuted }}>• {proj.lessons} subtopics</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t mt-6" style={{ borderColor: styles.border }}>
                      <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: styles.textMuted }}>
                        <span>Project Match Completion</span>
                        <span className="font-mono text-[12px] font-bold" style={{ color: prog === 100 ? '#10B981' : styles.text }}>{prog}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${prog}%`, backgroundColor: proj.color }} />
                      </div>
                      <button
                        onClick={() => handleUpdateProjectProgress(proj.title, proj.color)}
                        className="w-full py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-white transition-all hover:scale-[1.02] cursor-pointer"
                        style={{ backgroundColor: prog === 100 ? '#10B981' : '#2563EB' }}
                      >
                        {prog === 100 ? '✓ Completed' : prog > 0 ? `Build Stage (Resume ${prog}%)` : 'Begin Construction'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================== TAB 4: ABOUT & TEAM (= 5 WHITE MEN) ==================================== */}
        {currentTab === "About" && (
          <div className="space-y-20 pt-12">
            {/* Heading */}
            <section className="text-center px-6 max-w-4xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold" style={{ borderColor: styles.border, backgroundColor: styles.card }}>
                <span style={{ color: styles.textMuted, fontSize: '10px', letterSpacing: '0.1em' }} className="font-bold">OUR MISSION</span>
              </div>
              <h1 className="text-5xl font-extrabold font-display leading-tight">Empowering developers through guided paths.</h1>
              <p className="max-w-xl mx-auto text-base" style={{ color: styles.textMuted }}>
                We believe learning to code shouldn&apos;t be a chaotic journey. DevPath provides the structure, tools, and community needed to master complex engineering domains with precision and confidence.
              </p>
            </section>

            {/* Story Card */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 rounded-2xl border p-8" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                  <h2 className="text-2xl font-bold mb-5 font-display" style={{ color: '#2563EB' }}>Our Story</h2>
                  <p className="mb-4 leading-relaxed text-sm" style={{ color: styles.textMuted }}>
                    DevPath was born in 2022 from a simple frustration: the gap between generic tutorials and professional-grade engineering requirements. Our founders, former lead engineers at top-tier tech firms, realized that modern developers needed more than just syntax—they needed architecture, context, and clear progression.
                  </p>
                  <p className="mb-8 leading-relaxed text-sm" style={{ color: styles.textMuted }}>
                    What started as a collection of internal training docs quickly evolved into an integrated development ecosystem. Today, we serve thousands of developers worldwide, providing a workspace that feels like a high-end IDE while functioning as a comprehensive educational hub.
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onNavigate("roadmap", "Roadmaps")}
                      className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-600 text-white transition-all hover:scale-105 cursor-pointer"
                    >
                      View Roadmap
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="flex-1 rounded-2xl p-7 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', color: '#FFFFFF' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
                      <Terminal size={20} color="white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-sans">25M+ Lines of Code</h3>
                      <p className="text-white/80 text-xs">Compiled and executed within our integrated sandboxes by developers worldwide.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl p-7 border relative overflow-hidden" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold tracking-widest text-[#2563EB]">GLOBAL REACH</span>
                        <h3 className="text-4xl font-extrabold font-display pt-2">140+</h3>
                        <p className="text-xs" style={{ color: styles.textMuted }}>Countries Represented</p>
                      </div>
                      <Globe size={40} style={{ color: styles.textMuted, opacity: 0.3 }} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Meet the Team - Redesigned to feature all white men portrait photos */}
            <section className="max-w-7xl mx-auto px-6 space-y-8">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: styles.border }}>
                <h2 className="text-3xl font-extrabold font-display">Meet the Team</h2>
                <span className="text-[10px] font-bold tracking-widest" style={{ color: styles.textMuted }}>FOUNDED IN SAN FRANCISCO</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {teamMembers.map(member => (
                  <div key={member.name} className="group">
                    <div
                      className="rounded-2xl overflow-hidden mb-3 aspect-[3/4] relative border"
                      style={{ backgroundColor: styles.innerBg, borderColor: styles.border }}
                    >
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                    <h3 className="font-bold text-sm tracking-wide" style={{ color: styles.text }}>
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-extrabold tracking-wider uppercase mt-0.5" style={{ color: member.roleColor }}>
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pillars Section */}
            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pillars.map(p => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.title}
                      className="rounded-2xl p-6 border-l-4 transition-all hover:scale-[1.01]"
                      style={{
                        backgroundColor: styles.card,
                        borderColor: styles.border,
                        borderLeft: `4px solid ${p.borderColor}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={16} style={{ color: p.borderColor }} />
                        <h3 className="font-extrabold text-sm font-display">{p.title}</h3>
                      </div>
                      <p style={{ color: styles.textMuted, fontSize: '13px', lineHeight: '1.6' }}>{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />

      {/* FLOATING PROJECT XP EVENT TOAST */}
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
            <span className="text-[#2563EB] font-bold text-xs uppercase tracking-wider">⚡ WORKSPACE VERIFICATION UPDATE</span>
          </div>
          <p className="text-sm font-extrabold" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{toast.message}</p>
          <p className="text-[11px]" style={{ color: isDark ? '#94A3B8' : '#475569' }}>{toast.sub}</p>
        </div>
      )}
    </div>
  );
}
