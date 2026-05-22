"use client";

import { useState } from "react";
import { Bell, Settings, Search, Code2, ChevronDown, Sun, Moon, Shield, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { AppUser, Page } from "../types";

interface NavbarProps {
  user: AppUser | null;
  activeNav: string;
  onNavigate: (page: Page, nav?: string) => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

const navItems = [
  { label: "Roadmaps", page: "roadmap" as Page },
  { label: "Library", page: "dashboard" as Page },
  { label: "Projects", page: "dashboard" as Page },
  { label: "About", page: "dashboard" as Page },
];

export default function Navbar({ user, activeNav, onNavigate, onLogout, theme, onToggleTheme }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isDark = theme === "dark";

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
    setShowProfileMenu(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
    setShowSettings(false);
  };

  const notifications = [
    { id: 1, title: "Welcome to DevPath! 🎉", desc: "Start customized coding roadmaps curated by FAANG leads.", time: "Just now" },
    { id: 2, title: "New Roadmap Available", desc: "Advanced Machine Learning Path is now online.", time: "2 hours ago" },
    { id: 3, title: "Zero Progress Checked ✔️", desc: "All course templates reset to 0% for your sandbox profile.", time: "1 day ago" }
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 border-b"
      style={{
        backgroundColor: isDark ? 'rgba(16, 20, 24, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#1E293B' : '#E2E8F0',
        backdropFilter: 'blur(12px)',
        color: isDark ? '#F8FAFC' : '#0F172A',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => onNavigate("dashboard", "Home")}
          className="flex items-center gap-2 cursor-pointer focus:outline-none bg-transparent border-none"
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center transition-transform hover:rotate-6"
            style={{ backgroundColor: '#2563EB' }}
          >
            <Code2 size={14} color="white" />
          </div>
          <span
            className="font-bold text-lg"
            style={{ fontFamily: 'Urbanist, sans-serif', color: isDark ? '#F8FAFC' : '#1E3A5F' }}
          >
            DevPath
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page, item.label)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer relative"
              style={{
                color: activeNav === item.label ? (isDark ? '#F8FAFC' : '#2563EB') : (isDark ? '#94A3B8' : '#64748B'),
              }}
            >
              {item.label}
              {activeNav === item.label && (
                <motion.div
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-3 right-3 h-[2px]"
                  style={{ backgroundColor: '#2563EB' }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Search + Icons + Avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all focus-within:ring-1 focus-within:ring-[#2563EB]"
          style={{
            backgroundColor: isDark ? '#161B22' : '#F1F5F9',
            borderColor: isDark ? '#2D3748' : '#CBD5E1',
            minWidth: '180px',
          }}
        >
          <Search size={14} style={{ color: isDark ? '#4A5568' : '#64748B' }} />
          <input
            type="text"
            placeholder="Search paths..."
            className="p-0 border-none outline-none focus:ring-0 focus:border-none"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: isDark ? '#94A3B8' : '#0F172A',
              fontSize: '13px',
              width: '100%',
              padding: 0,
            }}
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 cursor-pointer"
          style={{ color: isDark ? '#94A3B8' : '#475569' }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Bell - Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 cursor-pointer relative"
            style={{ color: isDark ? '#94A3B8' : '#475569' }}
          >
            <Bell size={17} />
            <span className="absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2" style={{ borderColor: isDark ? '#161B22' : '#FFFFFF' }} />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border p-4 shadow-xl z-50 overflow-hidden"
                style={{
                  backgroundColor: isDark ? '#161B22' : '#FFFFFF',
                  borderColor: isDark ? '#2D3748' : '#E2E8F0',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                }}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0' }}>
                  <span className="font-bold text-sm tracking-wide">Notifications</span>
                  <span className="text-[10px] font-semibold bg-[#2563EB]/10 text-[#2563EB] px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <div key={notif.id} className="text-left space-y-1">
                      <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{notif.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-relaxed" style={{ color: isDark ? '#94A3B8' : '#475569' }}>{notif.desc}</p>
                      <span className="block text-[9px] text-gray-400">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={toggleSettings}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 cursor-pointer"
            style={{ color: isDark ? '#94A3B8' : '#475569' }}
          >
            <Settings size={17} />
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 rounded-2xl border p-4 shadow-xl z-50 text-left"
                style={{
                  backgroundColor: isDark ? '#161B22' : '#FFFFFF',
                  borderColor: isDark ? '#2D3748' : '#E2E8F0',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                }}
              >
                <div className="flex items-center gap-2 pb-3 mb-3 border-b" style={{ borderColor: isDark ? '#2D3748' : '#E2E8F0' }}>
                  <Sliders size={14} className="text-[#2563EB]" />
                  <span className="font-bold text-sm">Workspace Settings</span>
                </div>
                <div className="space-y-3 font-sans">
                  {/* Option 1: Live Toggle */}
                  <div className="flex items-center justify-between text-xs">
                    <span>HMR Compiling</span>
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono text-[10px]" style={{ color: isDark ? '#94A3B8' : '#475569' }}>Disabled</span>
                  </div>
                  {/* Option 2: Database Server */}
                  <div className="flex items-center justify-between text-xs">
                    <span>Database Engine</span>
                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 font-semibold text-[10px]">Cloud Active</span>
                  </div>
                  {/* Option 3: Sound effects toggle */}
                  <button
                    onClick={onToggleTheme}
                    className="w-full text-left font-semibold text-xs text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1 mt-2 bg-transparent border-none"
                  >
                    💡 Toggle Theme ({isDark ? "Light" : "Dark"})
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Badge if admin */}
        {user?.role === "admin" && (
          <button
            onClick={() => onNavigate("admin")}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 cursor-pointer bg-transparent"
          >
            <Shield size={11} /> Admin Panel
          </button>
        )}

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 cursor-pointer focus:outline-none bg-transparent border-none"
            onClick={toggleProfileMenu}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden border-2 transition-transform hover:scale-105"
              style={{
                borderColor: '#2563EB',
                background: user?.avatar ? 'none' : 'linear-gradient(135deg, #2563EB, #10B981)',
                color: 'white',
              }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'G'
              )}
            </div>
            <ChevronDown size={12} style={{ color: isDark ? '#94A3B8' : '#64748B' }} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 rounded-2xl border py-1 shadow-2xl z-50 text-left overflow-hidden"
                style={{
                  backgroundColor: isDark ? '#161B22' : '#FFFFFF',
                  borderColor: isDark ? '#2D3748' : '#E2E8F0',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                }}
              >
                {user?.role !== 'guest' && (
                  <button
                    onClick={() => {
                      onNavigate("profile", "Profile");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5 cursor-pointer flex items-center gap-2 bg-transparent border-none"
                    style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}
                  >
                    👤 Profile
                  </button>
                )}

                {user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate("admin");
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-500 hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5 cursor-pointer flex items-center gap-2 bg-transparent border-none"
                  >
                    👑 Admin Panel
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-red-500/10 cursor-pointer flex items-center gap-2 border-t bg-transparent border-none"
                  style={{ color: '#EF4444', borderColor: isDark ? '#2D3748' : '#E2E8F0' }}
                >
                  🚪 Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
