"use client";

import React, { useState } from "react";
import { Users, Activity, Code2, Trash2, ArrowUpCircle, Plus, Shield, Terminal, X } from "lucide-react";
import type { AppUser, Page } from "../types";

interface AdminPageProps {
  user: AppUser | null;
  onNavigate: (page: Page, nav?: string) => void;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "User" | "Moderator" | "Admin";
  joined: string;
  avatar: string;
}

const initialUsers: ManagedUser[] = [
  {
    id: "USR-001",
    name: "Youssef Zidan",
    email: "youssef@devpath.io",
    role: "Admin",
    joined: "Jan 2022",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=compress&cs=tinysrgb&fit=crop&h=60&w=60",
  },
  {
    id: "USR-002",
    name: "Ahmed Waleed",
    email: "ahmed@devpath.io",
    role: "Moderator",
    joined: "Mar 2023",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=compress&cs=tinysrgb&fit=crop&h=60&w=60",
  },
  {
    id: "USR-003",
    name: "Abraam Michel",
    email: "abraam@devpath.io",
    role: "User",
    joined: "Jun 2023",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=compress&cs=tinysrgb&fit=crop&h=60&w=60",
  },
  {
    id: "USR-004",
    name: "Ali Mansour",
    email: "ali@devpath.io",
    role: "Moderator",
    joined: "Jan 2023",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=compress&cs=tinysrgb&fit=crop&h=60&w=60",
  },
  {
    id: "USR-005",
    name: "Omar Mosaad",
    email: "omar@devpath.io",
    role: "Admin",
    joined: "Sep 2023",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=compress&cs=tinysrgb&fit=crop&h=60&w=60",
  },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  User: { bg: '#2563EB20', text: '#2563EB' },
  Moderator: { bg: '#F59E0B20', text: '#F59E0B' },
  Admin: { bg: '#10B98120', text: '#10B981' },
};

export default function AdminPage({ user, onNavigate, onLogout, theme, onToggleTheme }: AdminPageProps) {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [notification, setNotification] = useState("");

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleRemove = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showNotif("User removed successfully.");
  };

  const handlePromote = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const next: ManagedUser["role"] =
        u.role === "User" ? "Moderator" : u.role === "Moderator" ? "Admin" : "User";
      return { ...u, role: next };
    }));
    showNotif("User role updated.");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const newUser: ManagedUser = {
      id: `USR-${String(Date.now()).slice(-3)}`,
      name: newName,
      email: newEmail,
      role: "User",
      joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      avatar: "",
    };
    setUsers(prev => [...prev, newUser]);
    setNewName("");
    setNewEmail("");
    showNotif(`User "${newName}" added successfully.`);
  };

  const metrics = [
    {
      title: "Total System Accounts",
      value: String(users.length + 49995),
      icon: Users,
      color: "#2563EB",
      sub: `+${users.length} this session`,
    },
    {
      title: "Daily Active Sandbox Instances",
      value: "2,847",
      icon: Terminal,
      color: "#10B981",
      sub: "↑ 12% from yesterday",
    },
    {
      title: "Active API Integrations",
      value: "18",
      icon: Code2,
      color: "#8B5CF6",
      sub: "3 pending review",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: Activity,
      color: "#F59E0B",
      sub: "All services nominal",
    },
  ];

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDark ? '#101418' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', transition: 'background-color 0.2s, color 0.2s' }}>
      {/* Admin Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 border-b"
        style={{
          backgroundColor: isDark ? 'rgba(16, 20, 24, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderColor: isDark ? '#2D3748' : '#E2E8F0',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: '#2563EB' }}
          >
            <Code2 size={14} color="white" />
          </div>
          <span
            className="font-bold text-lg"
            style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
          >
            DevPath
          </span>
          <div className="w-px h-4 mx-1" style={{ backgroundColor: '#2D3748' }} />
          <div className="flex items-center gap-1.5">
            <Shield size={14} style={{ color: '#F59E0B' }} />
            <span style={{ color: '#F59E0B', fontSize: '13px', fontWeight: 600 }}>Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("dashboard", "About")}
            className="text-sm hover:underline cursor-pointer"
            style={{ color: '#94A3B8' }}
          >
            View Site
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-sm border hover:border-red-500 transition-all cursor-pointer"
            style={{ borderColor: '#2D3748', color: '#EF4444' }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Notification Toast */}
      {notification && (
        <div
          className="fixed top-16 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border animate-fade-in"
          style={{
            backgroundColor: '#161B22',
            borderColor: '#10B981',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
          <span style={{ color: '#F8FAFC', fontSize: '14px' }}>{notification}</span>
          <button onClick={() => setNotification("")} className="cursor-pointer">
            <X size={14} style={{ color: '#94A3B8' }} />
          </button>
        </div>
      )}

      <main className="pt-14 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} style={{ color: '#F59E0B' }} />
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
            >
              System Administration
            </h1>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>
            User Management Dashboard — Logged in as{" "}
            <span style={{ color: '#F59E0B', fontWeight: 600 }}>
              {user?.email}
            </span>
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map(metric => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className="rounded-xl border p-5 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: '#161B22', borderColor: '#2D3748' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <Icon size={18} style={{ color: metric.color }} />
                  </div>
                </div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
                >
                  {metric.value}
                </div>
                <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>{metric.title}</p>
                <p style={{ color: metric.color, fontSize: '11px', fontWeight: 500 }}>{metric.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Users Table */}
        <div
          className="rounded-2xl border overflow-hidden mb-6"
          style={{ backgroundColor: '#161B22', borderColor: '#2D3748' }}
        >
          {/* Table Header Bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: '#2D3748' }}
          >
            <h2
              className="font-bold text-base"
              style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
            >
              Active User Accounts
            </h2>
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>
              {users.length} users
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2D3748' }}>
                  {["User ID", "Profile", "Full Name", "Email", "Role", "Joined", "Actions"].map(col => (
                    <th
                      key={col}
                      className="text-left px-5 py-3"
                      style={{ color: '#4A5568', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}
                    >
                      {col.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-[#0D1117]/50"
                    style={{
                      borderBottom: idx < users.length - 1 ? '1px solid #1E293B' : 'none',
                    }}
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <span
                        style={{ color: '#4A5568', fontSize: '12px', fontFamily: 'monospace' }}
                      >
                        {u.id}
                      </span>
                    </td>

                    {/* Avatar */}
                    <td className="px-5 py-4">
                      {u.avatar ? (
                        <div
                          className="w-9 h-9 rounded-full overflow-hidden border"
                          style={{ borderColor: '#2D3748' }}
                        >
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{
                            background: 'linear-gradient(135deg, #2563EB, #10B981)',
                            color: 'white',
                          }}
                        >
                          {u.name.charAt(0)}
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4">
                      <span style={{ color: '#F8FAFC', fontSize: '14px', fontWeight: 500 }}>{u.name}</span>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <span style={{ color: '#94A3B8', fontSize: '13px' }}>{u.email}</span>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: roleColors[u.role].bg,
                          color: roleColors[u.role].text,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4">
                      <span style={{ color: '#4A5568', fontSize: '13px' }}>{u.joined}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePromote(u.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105 cursor-pointer"
                          style={{
                            borderColor: '#10B981',
                            color: '#10B981',
                            backgroundColor: '#10B98110',
                          }}
                          title="Cycle role"
                        >
                          <ArrowUpCircle size={13} />
                          Promote
                        </button>
                        <button
                          onClick={() => handleRemove(u.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105 cursor-pointer"
                          style={{
                            borderColor: '#EF4444',
                            color: '#EF4444',
                            backgroundColor: '#EF444410',
                          }}
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Form */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: '#161B22', borderColor: '#2D3748' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Plus size={18} style={{ color: '#2563EB' }} />
            <h2
              className="font-bold text-base"
              style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
            >
              Add User Manually
            </h2>
          </div>

          <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="flex-1"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:scale-105 whitespace-nowrap cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F, #2563EB)',
                color: '#F8FAFC',
                border: 'none',
              }}
            >
              <Plus size={16} />
              Insert User
            </button>
          </form>
          <p style={{ color: '#4A5568', fontSize: '12px', marginTop: '8px' }}>
            New users are added with default &quot;User&quot; role. You can promote them from the table above.
          </p>
        </div>
      </main>
    </div>
  );
}
