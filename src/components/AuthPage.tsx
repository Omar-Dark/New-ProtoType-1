"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Database, Code2 } from "lucide-react";
import type { AppUser } from "../types";

interface AuthPageProps {
  onLogin: (user: AppUser) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signin") {
      if (email === "admin@admin.com" && password === "adminadmin") {
        onLogin({ name: "Admin", email, role: "admin" });
        return;
      }
      if (email && password) {
        onLogin({ name: email.split("@")[0] || "User", email, role: "user" });
        return;
      }
      setError("Please enter valid credentials.");
    } else {
      if (!name || !email || !password) {
        setError("Please fill in all fields.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      onLogin({ name, email, role: "user" });
    }
  };

  const handleGuest = () => {
    onLogin({ name: "Guest", email: "guest@devpath.io", role: "guest" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#101418' }}
    >
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: '#1E293B' }}
      >
        <div
          className="text-xl font-bold"
          style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
        >
          DevPath
        </div>
        <div className="flex items-center gap-3">
          <span style={{ color: '#94A3B8', fontSize: '14px' }}>Platform</span>
          <div style={{ width: 1, height: 16, backgroundColor: '#2D3748' }} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Auth Card */}
        <div
          className="w-full max-w-md rounded-2xl border"
          style={{
            backgroundColor: '#161B22',
            borderColor: '#2D3748',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Blue top accent bar */}
          <div
            className="h-1 rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, #2563EB, #10B981)' }}
          />

          <div className="p-8">
            {/* Logo + Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  <Code2 size={16} color="white" />
                </div>
              </div>
              <h1
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
              >
                {mode === "signup" ? "Create Your Account" : "Sign In"}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                {mode === "signup"
                  ? "Start your engineering journey today."
                  : "Welcome back to DevPath."}
              </p>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 mb-5">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-medium text-sm transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  borderColor: '#2D3748',
                  backgroundColor: '#0D1117',
                  color: '#F8FAFC',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#4A5568')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2D3748')}
              >
                {/* Google Icon */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.712A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.712V4.956H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.956L3.964 7.288C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-medium text-sm transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  borderColor: '#2D3748',
                  backgroundColor: '#0D1117',
                  color: '#F8FAFC',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#4A5568')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2D3748')}
              >
                {/* GitHub Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5 font-sans">
              <div className="flex-1 h-px" style={{ backgroundColor: '#2D3748' }} />
              <span className="text-[11px] text-slate-500 tracking-wider font-semibold">OR EMAIL</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#2D3748' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label
                    className="block text-xs font-semibold mb-2"
                    style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
                  >
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="dev@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="text-xs font-semibold"
                    style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
                  >
                    PASSWORD
                  </label>
                  <span style={{ color: '#4A5568', fontSize: '11px' }}>At least 8 characters</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#4A5568' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.01] hover:brightness-110 cursor-pointer"
                style={{
                  backgroundColor: '#1E3A5F',
                  background: 'linear-gradient(135deg, #1E3A5F, #2563EB)',
                  color: '#F8FAFC',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {mode === "signup" ? "Create Account" : "Sign In"}
              </button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-5 space-y-2">
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="font-semibold hover:underline cursor-pointer text-blue-500"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-semibold hover:underline cursor-pointer text-blue-500"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={handleGuest}
                className="font-semibold hover:underline cursor-pointer text-blue-500 text-sm"
              >
                Continue as a guest
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className="mt-5 w-full max-w-md flex items-center gap-3 px-5 py-4 rounded-xl border"
          style={{
            backgroundColor: '#161B22',
            borderColor: '#2D3748',
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#1E293B' }}
          >
            <Database size={18} style={{ color: '#2563EB' }} />
          </div>
          <p style={{ color: '#94A3B8', fontSize: '13px' }}>
            Join <span className="text-slate-100 font-semibold">50,000+</span> developers shipping better code with our integrated IDE learning paths.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="flex items-center justify-between px-8 py-4 border-t"
        style={{ borderColor: '#1E293B' }}
      >
        <p style={{ color: '#4A5568', fontSize: '13px' }}>
          © 2024 DevPath IDE. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy", "Support"].map(link => (
            <a
              key={link}
              href="#"
              className="hover:underline"
              style={{ color: '#94A3B8', fontSize: '13px' }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
