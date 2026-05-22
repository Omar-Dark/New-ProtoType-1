"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin, Link2, Trophy, Flame, Code2, Target,
  Award, ExternalLink, CheckCircle2, XCircle
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RadarChart from "./RadarChart";
import type { AppUser, Page } from "../types";

interface ProfilePageProps {
  user: AppUser | null;
  activeNav: string;
  onNavigate: (page: Page, nav?: string) => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onUpdateUser?: (updated: AppUser) => void;
}

const skillData = [
  { label: "JavaScript", value: 85 },
  { label: "CSS", value: 78 },
  { label: "HTML", value: 90 },
  { label: "Python", value: 65 },
  { label: "SQL", value: 72 },
  { label: "Git", value: 80 },
];

const achievements = [
  {
    id: "1",
    title: "First Project Done",
    subtitle: "Completed onboarding",
    icon: Trophy,
    borderColor: "#10B981",
    bgColor: "#10B98120",
    iconColor: "#10B981",
  },
  {
    id: "2",
    title: "7-Day Streak",
    subtitle: "Consistent learning",
    icon: Flame,
    borderColor: "#EF4444",
    bgColor: "#EF444420",
    iconColor: "#EF4444",
  },
  {
    id: "3",
    title: "Python Pro",
    subtitle: "Mastered advanced OOP",
    icon: Code2,
    borderColor: "#8B5CF6",
    bgColor: "#8B5CF620",
    iconColor: "#8B5CF6",
  },
  {
    id: "4",
    title: "100% Accuracy",
    subtitle: "Flawless quiz score",
    icon: Target,
    borderColor: "#06B6D4",
    bgColor: "#06B6D420",
    iconColor: "#06B6D4",
  },
];

const certificates = [
  {
    id: "1",
    title: "Frontend Development Certificate",
    issued: "Sep 2023",
    id_num: "DP-FE-2023-004582",
  },
  {
    id: "2",
    title: "React Basics",
    issued: "Nov 2023",
    id_num: "DP-RC-2023-007891",
  },
];

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizModule {
  id: string;
  title: string;
  description?: string;
  rank?: string;
  questions?: QuizQuestion[];
}

function QuizView({ theme, user, onUpdateUser }: { theme: "dark" | "light"; user: AppUser | null; onUpdateUser?: (updated: AppUser) => void }) {
  const [quizzes, setQuizzes] = useState<QuizModule[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizModule | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setListLoading(true);
        const res = await fetch("/api/quizzes");
        const data = await res.json();
        if (data.success && data.quizData) {
          const mapped: QuizModule[] = data.quizData.map((q: any) => ({
            id: q._id,
            title: q.title,
            description: q.description,
            rank: q.rank,
            questions: []
          }));
          setQuizzes(mapped);
        }
      } catch (err) {
        console.error("Error loading quizzes:", err);
      } finally {
        setListLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleModuleSelect = async (mod: QuizModule) => {
    try {
      setDetailLoading(true);
      setSelectedQuiz(mod);
      setCurrentQ(0);
      setSelected(null);
      setAnswered(false);
      setScore(0);
      setFinished(false);

      const res = await fetch(`/api/quizzes/${mod.id}`);
      const data = await res.json();
      if (data.success && data.quiz && data.quiz.questions) {
        const mappedQuestions: QuizQuestion[] = data.quiz.questions.map((q: any) => {
          let correctIdx = (q.options || []).indexOf(q.answer);
          if (correctIdx === -1) correctIdx = 0; 
          return {
            question: q.question,
            options: q.options || [],
            correct: correctIdx
          };
        });
        setQuestions(mappedQuestions);
      }
    } catch (err) {
      console.error("Error loading quiz questions:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);

      // Award XP when the quiz lands on the finished screen
      if (onUpdateUser && user) {
        const xpForAnswers = score * 25;
        const perfectBonus = score === questions.length ? 50 : 0;
        const totalEarned = xpForAnswers + perfectBonus;

        if (totalEarned > 0) {
          const currentXP = user.xp || 0;
          const newXP = currentXP + totalEarned;
          const currentLevel = user.level || 1;
          const newLevel = Math.floor(newXP / 100) + 1;

          onUpdateUser({
            ...user,
            xp: newXP,
            level: newLevel,
          });
        }
      }
    }
  };

  const handleReset = () => {
    setSelectedQuiz(null);
    setQuestions([]);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const isDark = theme === "dark";

  if (listLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <div className="w-8 h-8 border-4 border-t-[#2563EB] rounded-full animate-spin" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', borderTopColor: '#2563EB' }} />
        <p className="text-xs font-mono font-bold uppercase tracking-wider animate-pulse animate-duration-700" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
          LOADING QUIZZES OVERSECURE CLOUD...
        </p>
      </div>
    );
  }

  if (!selectedQuiz) {
    return (
      <div className="space-y-3">
        <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '13px', marginBottom: '16px' }}>
          Select a dynamic skill-level quiz module to begin testing your engineering competency:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {quizzes.map(mod => (
            <button
              key={mod.id}
              onClick={() => handleModuleSelect(mod)}
              className="group flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-sm cursor-pointer"
              style={{ 
                backgroundColor: isDark ? '#0D1117' : '#FFFFFF', 
                borderColor: isDark ? '#2D3748' : '#E2E8F0' 
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563EB')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = isDark ? '#2D3748' : '#E2E8F0')}
            >
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: mod.rank === "Expert" || mod.rank === "Master" ? '#F59E0B20' : '#10B98120',
                      color: mod.rank === "Expert" || mod.rank === "Master" ? '#F59E0B' : '#10B981',
                    }}
                  >
                    {mod.rank || "General"}
                  </span>
                </div>
                <h4 className="font-bold text-sm" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{mod.title}</h4>
                <p style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '11px', mt: '4px' }} className="line-clamp-2">
                  {mod.description}
                </p>
              </div>
              <div className="w-full flex items-center justify-between border-t pt-2.5 mt-2" style={{ borderColor: isDark ? '#1E293B' : '#F1F5F9' }}>
                <span style={{ color: isDark ? '#4A5568' : '#94A3B8', fontSize: '11px' }} className="font-mono">
                  30 questions
                </span>
                <span
                  className="text-xs font-semibold group-hover:translate-x-0.5 transition-transform"
                  style={{ color: '#2563EB' }}
                >
                  Start Quiz →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (detailLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-8 h-8 border-4 border-t-[#2563EB] rounded-full animate-spin" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', borderTopColor: '#2563EB' }} />
        <p className="text-xs font-mono font-bold uppercase tracking-wider animate-pulse" style={{ color: isDark ? '#94A3B8' : '#475569' }}>
          LOADING COMPREHENSIVE CURRICULUM QUESTIONS...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: isDark ? '#94A3B8' : '#475569' }}>Offline validation challenge: Questions could not be resolved from cloud repository.</p>
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
        >
          Return to Quizzes
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const xpForAnswers = score * 25;
    const perfectBonus = score === questions.length ? 50 : 0;
    const xpEarned = xpForAnswers + perfectBonus;

    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">{pct >= 70 ? "🎉" : "📚"}</div>
        <h3 className="text-xl font-bold mb-2 font-display" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>
          Quiz Complete!
        </h3>
        <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '13px', marginBottom: '8px' }}>
          {selectedQuiz.title}
        </p>
        <div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl mb-4 font-mono"
          style={{
            backgroundColor: pct >= 70 ? '#10B98120' : '#EF444420',
            border: `1px solid ${pct >= 70 ? '#10B981' : '#EF4444'}`,
          }}
        >
          <span
            className="text-2xl font-bold"
            style={{ color: pct >= 70 ? '#10B981' : '#EF4444' }}
          >
            {score}/{questions.length}
          </span>
          <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>({pct}%)</span>
        </div>
        
        {xpEarned > 0 && (
          <div className="mb-6 animate-pulse-glow">
            <span className="text-[#10B981] font-bold text-sm">⚡ +{xpEarned} XP AWARDED SECURELY</span>
            {perfectBonus > 0 && <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mt-0.5">100% Perfect Run Bonus Included (+50 XP)</p>}
          </div>
        )}

        <br />
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
          style={{ backgroundColor: '#2563EB', color: '#F8FAFC' }}
        >
          Choose Another Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div>
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleReset}
          style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '13px' }}
          className="hover:underline cursor-pointer font-bold uppercase tracking-wider"
        >
          ← Quit quiz
        </button>
        <span style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '12px' }} className="font-mono">
          Question {currentQ + 1} of {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full overflow-hidden mb-6 animate-pulse-glow" style={{ backgroundColor: isDark ? '#2D3748' : '#E2E8F0' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%`,
            backgroundColor: '#2563EB',
          }}
        />
      </div>

      <h4 className="font-bold text-base mb-5" style={{ color: isDark ? '#F8FAFC' : '#0F172A', lineHeight: 1.5 }}>
        {q.question}
      </h4>

      <div className="space-y-2 mb-6">
        {q.options.map((opt, idx) => {
          let borderColor = isDark ? '#2D3748' : '#E2E8F0';
          let bgColor = isDark ? '#0D1117' : '#FFFFFF';
          let textColor = isDark ? '#F8FAFC' : '#0F172A';
          if (answered) {
            if (idx === q.correct) {
              borderColor = '#10B981';
              bgColor = '#10B98115';
              textColor = '#10B981';
            } else if (idx === selected && idx !== q.correct) {
              borderColor = '#EF4444';
              bgColor = '#EF444415';
              textColor = '#EF4444';
            }
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 duration-150"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              {answered && idx === q.correct && (
                <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
              )}
              {answered && idx === selected && idx !== q.correct && (
                <XCircle size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
              )}
              {(!answered || (idx !== q.correct && idx !== selected)) && (
                <div
                  className="w-4 h-4 rounded-full border flex-shrink-0"
                  style={{ borderColor: isDark ? '#4A5568' : '#CBD5E1' }}
                />
              )}
              <span style={{ color: textColor, fontSize: '13px', fontWeight: 500 }} className="flex-1 leading-normal">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:brightness-110 cursor-pointer"
          style={{ backgroundColor: '#2563EB', color: '#F8FAFC' }}
        >
          {currentQ < questions.length - 1 ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}

// Progress Ring Component
function ProgressRing({ progress, size = 140 }: { progress: number; size?: number }) {
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size}>
      {/* Background circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#2D3748"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#progressGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="progress-ring-circle"
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DEFF9A" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ProfilePage({ user, activeNav, onNavigate, onLogout, theme, onToggleTheme, onUpdateUser }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"achievements" | "certificates" | "quiz">("achievements");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "Alex Developer",
    username: user?.username || "@alex_dev",
    bio: user?.bio || "Full-stack engineer passionate about scalable architecture and clean code. Building the future one commit at a time.",
    location: user?.location || "SF Bay Area",
    github: user?.github || "github.com/alexdev",
    avatar: user?.avatar || "https://images.pexels.com/photos/16881939/pexels-photo-16881939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  });

  const isDark = theme === "dark";

  const xpTotal = user?.xp || 0;
  const xpProgress = xpTotal % 100;
  const xpToNext = 100 - xpProgress;
  const currentLevel = user?.level || 1;

  const getRankName = (lvl: number) => {
    if (lvl <= 2) return "NOVICE DEVELOPER";
    if (lvl <= 4) return "SYSTEM APPRENTICE";
    if (lvl <= 6) return "COMPILER ENGINEMAN";
    if (lvl <= 8) return "INFRASTRUCTURE MASTER";
    return "ALGORITHMIC DEITY";
  };

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        setFormData(prev => ({ ...prev, avatar: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: "achievements" as const, label: "Achievements" },
    { id: "certificates" as const, label: "Certificates" },
    { id: "quiz" as const, label: "Quiz" },
  ];

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || "Alex Developer",
      username: user?.username || "@alex_dev",
      bio: user?.bio || "Full-stack engineer passionate about scalable architecture and clean code. Building the future one commit at a time.",
      location: user?.location || "SF Bay Area",
      github: user?.github || "github.com/alexdev",
      avatar: user?.avatar || "https://images.pexels.com/photos/16881939/pexels-photo-16881939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser && user) {
      onUpdateUser({
        ...user,
        ...formData
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDark ? '#101418' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', transition: 'background-color 0.2s, color 0.2s' }}>
      <Navbar user={user} activeNav={activeNav} onNavigate={onNavigate} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />

      <main className="pt-14 max-w-7xl mx-auto px-6 py-8">
        {/* Top Profile Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
          {/* Profile Card */}
          <div
            className="lg:col-span-3 rounded-2xl border p-6"
            style={{ backgroundColor: isDark ? '#161B22' : '#FFFFFF', borderColor: isDark ? '#2D3748' : '#E2E8F0' }}
          >
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden border-2"
                  style={{ borderColor: '#10B981' }}
                >
                  <img
                    src={user?.avatar || "https://images.pexels.com/photos/16881939/pexels-photo-16881939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300"}
                    alt={user?.name || "Alex Developer"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 animate-pulse-glow"
                  style={{ backgroundColor: '#10B981', borderColor: isDark ? '#161B22' : '#FFFFFF' }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 font-sans">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1
                      className="text-3xl font-bold mb-1 font-display"
                      style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}
                    >
                      {user?.name || "Alex Developer"}
                    </h1>
                    <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '14px' }}>
                      <span style={{ color: '#2563EB' }}>{user?.username || "@alex_dev"}</span>
                      {" • "}
                      <span>Joined Jan 2023</span>
                    </p>
                  </div>
                  <button
                    onClick={handleOpenEdit}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all hover:scale-105 cursor-pointer text-slate-100 hover:text-white"
                    style={{ borderColor: isDark ? '#2D3748' : '#CBD5E1', backgroundColor: '#2563EB' }}
                  >
                    Edit Profile
                  </button>
                </div>

                <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '14px', lineHeight: 1.6, margin: '12px 0' }}>
                  {user?.bio || "Full-stack engineer passionate about scalable architecture and clean code. Building the future one commit at a time."}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', backgroundColor: isDark ? '#0D1117' : '#F1F5F9' }}
                  >
                    <MapPin size={12} style={{ color: isDark ? '#4A5568' : '#475569' }} />
                    <span style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '12px' }}>{user?.location || "SF Bay Area"}</span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0', backgroundColor: isDark ? '#0D1117' : '#F1F5F9' }}
                  >
                    <Link2 size={12} style={{ color: isDark ? '#4A5568' : '#475569' }} />
                    <span style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '12px' }}>{user?.github || "github.com/alexdev"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div
            className="lg:col-span-2 rounded-2xl border p-6 flex flex-col items-center justify-center text-center"
            style={{ backgroundColor: isDark ? '#161B22' : '#FFFFFF', borderColor: isDark ? '#2D3748' : '#E2E8F0' }}
          >
            <h2
              className="text-2xl font-bold mb-1 font-display"
              style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}
            >
              Level {currentLevel}
            </h2>
            <p className="text-xs font-bold tracking-widest mb-5" style={{ color: '#10B981' }}>
              {getRankName(currentLevel)}
            </p>

            {/* Progress Ring */}
            <div className="relative mb-4">
              <ProgressRing progress={xpProgress} size={140} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{xpTotal} XP</span>
                <span style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '12px' }}>XP Total</span>
              </div>
            </div>

            <p style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: '13px' }}>
              {xpToNext} XP to next level
            </p>
          </div>
        </div>

        {/* Profile Edit Overlay Form */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
            <div
              className="rounded-3xl border w-full max-w-lg p-6 space-y-5 animate-fade-in text-left shadow-2xl"
              style={{ backgroundColor: isDark ? '#161B22' : '#FFFFFF', borderColor: isDark ? '#2D3748' : '#E2E8F0' }}
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>Customize Profile Sandbox</h3>
                <p className="text-xs" style={{ color: isDark ? '#94A3B8' : '#475569' }}>These values update all badges and your active workspace environment credentials.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs md:text-sm">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold tracking-wide uppercase" style={{ color: isDark ? '#94A3B8' : '#475569' }}>Display Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold tracking-wide uppercase" style={{ color: isDark ? '#94A3B8' : '#475569' }}>Username handle</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold tracking-wide uppercase" style={{ color: isDark ? '#94A3B8' : '#475569' }}>Short Biography</label>
                  <textarea
                    required
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border outline-none font-sans"
                    style={{ backgroundColor: isDark ? '#101418' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#0F172A', borderColor: isDark ? '#2D3748' : '#E2E8F0' }}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold tracking-wide uppercase" style={{ color: isDark ? '#94A3B8' : '#475569' }}>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold tracking-wide uppercase" style={{ color: isDark ? '#94A3B8' : '#475569' }}>GitHub handle</label>
                    <input
                      type="text"
                      value={formData.github}
                      onChange={e => setFormData({ ...formData, github: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold tracking-wide uppercase" style={{ color: isDark ? '#94A3B8' : '#475569' }}>Profile Picture</label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      const input = document.getElementById("avatar-file-input");
                      if (input) input.click();
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                      isDragOver 
                        ? "border-[#2563EB] bg-[#2563EB10]" 
                        : isDark ? "border-[#2D3748] hover:border-[#4A5568] bg-[#0D1117]" : "border-[#E2E8F0] hover:border-[#CBD5E1] bg-[#F8FAFC]"
                    }`}
                  >
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]);
                        }
                      }}
                    />
                    
                    {formData.avatar ? (
                      <div className="flex items-center gap-3 w-full">
                        <img 
                          src={formData.avatar} 
                          alt="Preview" 
                          className="w-12 h-12 rounded-lg object-cover border" 
                          style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0' }}
                        />
                        <div className="text-left animate-fade-in">
                          <p className="font-semibold text-xs text-[#2563EB]">Image loaded securely</p>
                          <p className="text-[10px]" style={{ color: isDark ? '#94A3B8' : '#475569' }}>Drag & drop another image or click to replace</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 animate-fade-in">
                        <p className="font-semibold text-xs" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>Drag & Drop your avatar here</p>
                        <p className="text-[10px]" style={{ color: isDark ? '#94A3B8' : '#475569' }}>or click to browse from device (JPEG, PNG, SVG)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer"
                    style={{ borderColor: isDark ? '#2D3748' : '#CBD5E1', color: isDark ? '#94A3B8' : '#475569' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                    style={{ backgroundColor: '#2563EB' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left: Tabs Content */}
          <div className="lg:col-span-3">
            {/* Tab Nav */}
            <div className="flex items-center gap-1 mb-5 border-b" style={{ borderColor: '#2D3748' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer"
                  style={{
                    color: activeTab === tab.id ? '#F8FAFC' : '#94A3B8',
                    borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold font-display" style={{ color: '#F8FAFC' }}>
                    Achievements
                  </h2>
                  <span style={{ color: '#10B981', fontSize: '14px', fontWeight: 600 }}>4 Unlocked</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map(ach => {
                    const Icon = ach.icon;
                    return (
                      <div
                        key={ach.id}
                        className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02]"
                        style={{
                          backgroundColor: '#161B22',
                          borderColor: ach.borderColor,
                          borderWidth: 1,
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: ach.bgColor }}
                        >
                          <Icon size={20} style={{ color: ach.iconColor }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm" style={{ color: '#F8FAFC', fontFamily: 'monospace' }}>
                            {ach.title}
                          </h4>
                          <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'monospace' }}>
                            {ach.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Certificates preview */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold font-display" style={{ color: '#F8FAFC' }}>
                      Certificates
                    </h2>
                    <button
                      onClick={() => setActiveTab("certificates")}
                      style={{ color: '#10B981', fontSize: '14px', fontWeight: 600 }}
                      className="hover:underline cursor-pointer"
                    >
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certificates.map(cert => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-xl border transition-all hover:scale-[1.01]"
                        style={{ backgroundColor: '#161B22', borderColor: '#2D3748' }}
                      >
                        <Award size={24} style={{ color: '#94A3B8', marginBottom: '8px' }} />
                        <h4 className="font-bold text-sm" style={{ color: '#F8FAFC', marginBottom: '4px' }}>
                          {cert.title}
                        </h4>
                        <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '8px' }}>
                          Issued: {cert.issued}
                        </p>
                        <button
                          className="flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
                          style={{ color: '#2563EB' }}
                        >
                          View Credential <ExternalLink size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === "certificates" && (
              <div>
                <h2 className="text-xl font-bold mb-4 font-display" style={{ color: '#F8FAFC' }}>
                  Certificates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificates.map(cert => (
                    <div
                      key={cert.id}
                      className="p-6 rounded-xl border transition-all hover:scale-[1.01]"
                      style={{
                        backgroundColor: '#161B22',
                        borderColor: '#2D3748',
                        background: 'linear-gradient(135deg, #161B22 0%, #1E293B 100%)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: '#2563EB20' }}
                      >
                        <Award size={24} style={{ color: '#2563EB' }} />
                      </div>
                      <h4
                        className="font-bold text-base mb-1 font-display"
                        style={{ color: '#F8FAFC' }}
                      >
                        {cert.title}
                      </h4>
                      <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '4px' }}>
                        Issued: {cert.issued}
                      </p>
                      <p style={{ color: '#4A5568', fontSize: '11px', fontFamily: 'monospace', marginBottom: '12px' }}>
                        {cert.id_num}
                      </p>
                      <button
                        className="flex items-center gap-1.5 text-sm font-semibold hover:underline cursor-pointer"
                        style={{ color: '#2563EB' }}
                      >
                        View Credential <ExternalLink size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === "quiz" && (
              <div>
                <h2 className="text-xl font-bold mb-4 font-display" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>
                  Knowledge Quiz
                </h2>
                <div
                  className="p-6 rounded-xl border"
                  style={{ backgroundColor: isDark ? '#161B22' : '#FFFFFF', borderColor: isDark ? '#2D3748' : '#E2E8F0' }}
                >
                  <QuizView theme={theme} user={user} onUpdateUser={onUpdateUser} />
                </div>
              </div>
            )}
          </div>

          {/* Right: Skill Proficiency Chart */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-5 font-display" style={{ color: '#F8FAFC' }}>
              Skill Proficiency
            </h2>
            <div
              className="rounded-2xl border p-6 flex items-center justify-center"
              style={{ backgroundColor: '#161B22', borderColor: '#2D3748' }}
            >
              <RadarChart data={skillData} size={300} />
            </div>

            {/* Skill Bars */}
            <div
              className="mt-4 rounded-2xl border p-5 space-y-3"
              style={{ backgroundColor: '#161B22', borderColor: '#2D3748' }}
            >
              {skillData.map(skill => (
                <div key={skill.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>{skill.label}</span>
                    <span style={{ color: '#F8FAFC', fontSize: '12px', fontWeight: 600 }}>{skill.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#2D3748' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${skill.value}%`,
                        background: 'linear-gradient(90deg, #2563EB, #10B981)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
