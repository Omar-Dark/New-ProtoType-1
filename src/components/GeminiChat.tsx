"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const CS_RESPONSES: Record<string, string> = {
  "big o": "**Big O Notation** measures algorithm efficiency. Common complexities:\n- O(1) — Constant (array index access)\n- O(log n) — Logarithmic (binary search)\n- O(n) — Linear (simple loop)\n- O(n²) — Quadratic (nested loops)\n- O(2ⁿ) — Exponential (recursive subsets)",

  "linked list": "A **Linked List** is a linear data structure where each node contains:\n```\nclass Node {\n  data: any;\n  next: Node | null;\n}\n```\n**Types:** Singly, Doubly, Circular\n**Pros:** O(1) insertion/deletion at head\n**Cons:** O(n) random access",

  "react": "**React** is a JavaScript library for building UIs with a component-based architecture.\n\nKey concepts:\n- **JSX** — HTML-like syntax in JS\n- **State** — `useState()` for reactive data\n- **Props** — Component inputs\n- **Hooks** — `useEffect`, `useContext`, `useRef`\n- **Virtual DOM** — Efficient reconciliation",

  "algorithm": "**Algorithms** are step-by-step procedures to solve problems.\n\nCommon categories:\n1. **Sorting** — QuickSort O(n log n), MergeSort O(n log n)\n2. **Searching** — Binary Search O(log n)\n3. **Dynamic Programming** — Memoization\n4. **Graph** — BFS O(V+E), DFS O(V+E)\n5. **Greedy** — Locally optimal choices",

  "binary search": "**Binary Search** — O(log n) search on sorted arrays:\n```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n```",

  "hash": "**Hash Maps** offer O(1) average lookup, insert, delete.\n\n```javascript\nconst map = new Map();\nmap.set('key', 'value');\nmap.get('key'); // O(1)\n```\n**Hash Function** converts keys to array indices. Collisions handled via chaining or open addressing.",

  "sql": "**SQL** (Structured Query Language) for relational databases:\n\n```sql\n-- Basic CRUD\nSELECT * FROM users WHERE role = 'admin';\nINSERT INTO users (name, email) VALUES ('Alex', 'a@b.com');\nUPDATE users SET role = 'admin' WHERE id = 1;\nDELETE FROM users WHERE id = 1;\n\n-- Joins\nSELECT u.name, p.title\nFROM users u\nJOIN posts p ON u.id = p.user_id;\n```",

  "system design": "**System Design** key principles:\n\n1. **Scalability** — Horizontal vs Vertical scaling\n2. **Load Balancing** — Distribute traffic (Round Robin, Least Connections)\n3. **Caching** — Redis, CDN for fast reads\n4. **Database** — SQL vs NoSQL, Sharding, Replication\n5. **Microservices** — Independent deployable services\n6. **CAP Theorem** — Consistency, Availability, Partition Tolerance",

  "git": "**Git** version control essentials:\n\n```bash\ngit init              # Initialize repo\ngit clone <url>       # Clone remote\ngit add .             # Stage changes\ngit commit -m 'msg'   # Commit\ngit push origin main  # Push to remote\ngit pull              # Fetch + merge\ngit branch feature    # Create branch\ngit merge feature     # Merge branch\n```",

  "python": "**Python** key features:\n\n```python\n# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# Dictionary\nuser = {'name': 'Alex', 'level': 42}\n\n# Class\nclass Developer:\n    def __init__(self, name):\n        self.name = name\n    \n    def code(self):\n        return f'{self.name} is coding!'\n```",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(CS_RESPONSES)) {
    if (lower.includes(key)) return response;
  }

  // Generic helpful response
  const generics = [
    "Great question! I specialize in computer science concepts. Ask me about:\n- **Data Structures** (arrays, trees, graphs)\n- **Algorithms** (sorting, searching, DP)\n- **Programming** (Python, JavaScript)\n- **System Design** (scalability, databases)\n- **Tools** (Git, SQL, React)",
    "I'm your DevPath AI assistant! I can explain:\n✓ Big O complexity analysis\n✓ Data structure operations\n✓ Algorithm implementations\n✓ System design patterns\n✓ Code concepts and best practices\n\nWhat would you like to explore?",
    "That's an interesting topic! While I focus on CS education, I can help with:\n- Debugging strategies\n- Code review concepts\n- Architecture patterns\n- Learning roadmaps\n\nTry asking about specific topics like 'linked lists', 'binary search', or 'system design'.",
  ];
  return generics[Math.floor(Math.random() * generics.length)];
}

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "HI! How can I help you? ⚡\n\nAsk me anything about computer science — algorithms, data structures, system design, code concepts, and more!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMsg.content);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Code block
      if (line.startsWith('```')) return null;

      // Bold text
      const boldReplaced = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Bullet points
      if (line.startsWith('- ') || line.startsWith('✓ ') || line.match(/^\d+\./)) {
        return (
          <div
            key={i}
            className="ml-2 mt-0.5 text-xs text-slate-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldReplaced }}
          />
        );
      }

      // Code lines (inside code blocks)
      if (
        lines[i - 1]?.startsWith('```') ||
        (i > 0 &&
          !lines[i - 1]?.startsWith('```') &&
          (line.includes('{') || line.includes(';') || line.includes('def ') || line.includes('class ')))
      ) {
        return (
          <div
            key={i}
            className="font-mono text-xs text-[#DEFF9A] leading-relaxed"
          >
            {line}
          </div>
        );
      }

      return (
        <div
          key={i}
          className={`text-xs leading-relaxed ${line.includes('**') ? 'text-slate-100 font-medium' : 'text-slate-400'}`}
          dangerouslySetInnerHTML={{ __html: boldReplaced }}
        />
      );
    }).filter(Boolean);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg cursor-pointer"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
            : 'linear-gradient(135deg, #2563EB, #10B981)',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
        }}
      >
        {isOpen ? (
          <X size={22} color="white" />
        ) : (
          <MessageCircle size={22} color="white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] rounded-2xl border flex flex-col overflow-hidden animate-slide-up"
          style={{
            backgroundColor: '#161B22',
            borderColor: '#2D3748',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            height: '480px',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{
              borderColor: '#2D3748',
              background: 'linear-gradient(90deg, #161B22, #1E293B)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #10B981)' }}
            >
              <Bot size={18} color="white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span style={{ color: '#F8FAFC', fontSize: '14px', fontWeight: 600 }}>
                  Devpath Ai
                </span>
                <Sparkles size={12} style={{ color: '#DEFF9A' }} />
              </div>
              <span className="text-[11px] text-emerald-400">● Online</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto w-7 h-7 flex items-center justify-center rounded-full transition-all hover:bg-white/10 cursor-pointer"
              style={{ color: '#94A3B8' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #10B981)' }}
                  >
                    <Bot size={12} color="white" />
                  </div>
                )}
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{
                    backgroundColor: msg.role === 'user' ? '#2563EB' : '#0D1117',
                    border: msg.role === 'assistant' ? '1px solid #2D3748' : 'none',
                    maxWidth: '82%',
                  }}
                >
                  {msg.role === 'user' ? (
                    <p style={{ color: '#F8FAFC', fontSize: '13px', lineHeight: 1.5 }}>
                      {msg.content}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {renderMessageContent(msg.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #10B981)' }}
                >
                  <Bot size={12} color="white" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{ backgroundColor: '#0D1117', border: '1px solid #2D3748' }}
                >
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400"
                        style={{
                          animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="p-3 border-t"
            style={{ borderColor: '#2D3748' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ backgroundColor: '#0D1117', borderColor: '#2D3748' }}
            >
              <input
                type="text"
                placeholder="Ask about CS concepts..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[13px] text-slate-100 p-0"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 cursor-pointer"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg, #2563EB, #10B981)' : '#2D3748',
                  flexShrink: 0,
                }}
              >
                <Send size={14} color="white" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-1.5">
              Powered by DevPath AI • CS concepts & code explanations
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
