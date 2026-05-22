"use client";

import { Terminal, Globe, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t mt-16"
      style={{ borderColor: '#1E293B', backgroundColor: '#0D1117' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo */}
          <div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: 'Urbanist, sans-serif', color: '#F8FAFC' }}
            >
              DevPath
            </div>
            <p style={{ color: '#4A5568', fontSize: '13px' }}>
              © 2024 DevPath IDE. Built for precision.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-6">
            {["Documentation", "Changelog", "Privacy", "Terms", "Discord"].map(link => (
              <a
                key={link}
                href="#"
                className="hover:underline transition-colors"
                style={{ color: '#94A3B8', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md border transition-all hover:border-blue-500"
              style={{ borderColor: '#2D3748', color: '#94A3B8' }}
            >
              <Terminal size={14} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md border transition-all hover:border-blue-500"
              style={{ borderColor: '#2D3748', color: '#94A3B8' }}
            >
              <Globe size={14} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md border transition-all hover:border-blue-500"
              style={{ borderColor: '#2D3748', color: '#94A3B8' }}
            >
              <Code2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
