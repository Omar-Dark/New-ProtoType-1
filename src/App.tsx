"use client";

import { useState } from "react";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import RoadmapPage from "./components/RoadmapPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import GeminiChat from "./components/GeminiChat";
import type { AppUser, Page } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("auth");
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeNav, setActiveNav] = useState<string>("Home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const handleLogin = (user: AppUser) => {
    // Enrich with default profile info if needed
    const enrichedUser: AppUser = {
      ...user,
      username: user.username || "@alex_dev",
      bio: user.bio || "Full-stack engineer passionate about scalable architecture and clean code. Building the future one commit at a time.",
      location: user.location || "SF Bay Area",
      github: user.github || "github.com/alexdev",
      avatar: user.avatar || "https://images.pexels.com/photos/16881939/pexels-photo-16881939.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
      xp: user.xp !== undefined ? user.xp : 0,
      level: user.level !== undefined ? user.level : 1,
    };
    setCurrentUser(enrichedUser);
    if (enrichedUser.role === "admin") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("auth");
    setActiveNav("Home");
  };

  const handleNavigate = (page: Page, nav?: string) => {
    setCurrentPage(page);
    if (nav) setActiveNav(nav);
  };

  const handleUpdateUser = (updatedUser: AppUser) => {
    setCurrentUser(updatedUser);
  };

  const showChat = currentPage !== "auth";

  return (
    <div className={`min-h-screen ${theme}`} style={{ backgroundColor: theme === "dark" ? '#101418' : '#F8FAFC' }}>
      {currentPage === "auth" && (
        <AuthPage onLogin={handleLogin} />
      )}
      {currentPage === "dashboard" && (
        <Dashboard
          user={currentUser}
          activeNav={activeNav}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {currentPage === "roadmap" && (
        <RoadmapPage
          user={currentUser}
          activeNav={activeNav}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {currentPage === "profile" && (
        <ProfilePage
          user={currentUser}
          activeNav={activeNav}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
          onUpdateUser={handleUpdateUser}
        />
      )}
      {currentPage === "admin" && currentUser?.role === "admin" && (
        <AdminPage
          user={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {showChat && <GeminiChat theme={theme} />}
    </div>
  );
}
