"use client";

import { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import RoadmapPage from "./components/RoadmapPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage";
import GeminiChat from "./components/GeminiChat";
import type { AppUser, Page } from "./types";

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("roadmap_user");
        return savedUser ? JSON.parse(savedUser) : null;
      }
    } catch {}
    return null;
  });

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    try {
      if (typeof window !== "undefined") {
        const savedPage = localStorage.getItem("roadmap_page");
        const savedUser = localStorage.getItem("roadmap_user");
        if (!savedUser) return "auth";
        return (savedPage as Page) || "auth";
      }
    } catch {}
    return "auth";
  });

  const [activeNav, setActiveNav] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") {
        const savedNav = localStorage.getItem("roadmap_active_nav");
        return savedNav || "Home";
      }
    } catch {}
    return "Home";
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("roadmap_theme");
        return (savedTheme as "dark" | "light") || "dark";
      }
    } catch {}
    return "dark";
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("roadmap_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("roadmap_user");
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("roadmap_page", currentPage);
    } catch {}
  }, [currentPage]);

  useEffect(() => {
    try {
      localStorage.setItem("roadmap_active_nav", activeNav);
    } catch {}
  }, [activeNav]);

  useEffect(() => {
    try {
      localStorage.setItem("roadmap_theme", theme);
      if (theme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
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
    try {
      localStorage.removeItem("roadmap_user");
      localStorage.removeItem("roadmap_page");
      localStorage.removeItem("roadmap_active_nav");
    } catch {}
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
