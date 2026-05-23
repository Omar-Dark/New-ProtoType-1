import express from "express";
import path from "path";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

const ROADMAP_BASE_URL = "https://roadmap-project-chi.vercel.app/api/v1";
const API_KEY = process.env.ROADMAP_API_KEY || "e7b12f8bf9c4e92b13a45b0d7c9e1b342fc4d8ff6c2a9a1e3b6d91f7c8a12bcd";

import fallbackData from "./src/fallback_data";

// ---------------- API ENDPOINTS WITH ROBUST RESILIENT FALLBACKS ----------------

// 1. ROADMAPS GET LIST
app.get("/api/roadmaps", async (req, res) => {
  try {
    const response = await fetch(`${ROADMAP_BASE_URL}/roadmap`, {
      headers: { "x-api-key": API_KEY }
    });
    if (!response.ok) {
      console.warn(`External API returned status ${response.status} for /roadmap. Falling back to offline data.`);
      return res.json({ success: true, roadmap: fallbackData.roadmaps, isFallback: true });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.warn("Proxy error /api/roadmaps, triggering fallback:", error.message);
    return res.json({ success: true, roadmap: fallbackData.roadmaps, isFallback: true });
  }
});

// 2. ROADMAP GET DETAIL
app.get("/api/roadmaps/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${ROADMAP_BASE_URL}/roadmap/${id}`, {
      headers: { "x-api-key": API_KEY }
    });
    if (!response.ok) {
      console.warn(`External API returned ${response.status} for /roadmap/${id}. Falling back offline.`);
      const localMap = fallbackData.roadmaps.find((r: any) => r._id === id);
      if (localMap) {
        return res.json({ success: true, roadmap: localMap, isFallback: true });
      }
      return res.status(response.status).json({ success: false, error: "Roadmap not found offline" });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.warn(`Proxy error /api/roadmaps/${req.params.id}, triggering fallback:`, error.message);
    const localMap = fallbackData.roadmaps.find((r: any) => r._id === req.params.id);
    if (localMap) {
      return res.json({ success: true, roadmap: localMap, isFallback: true });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. QUIZZES GET LIST
app.get("/api/quizzes", async (req, res) => {
  try {
    const response = await fetch(`${ROADMAP_BASE_URL}/quiz`, {
      headers: { "x-api-key": API_KEY }
    });
    if (!response.ok) {
      console.warn(`External API returned ${response.status} for /quiz. Falling back offline.`);
      return res.json({ success: true, quizData: fallbackData.quizzes, isFallback: true });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.warn("Proxy error /api/quizzes, triggering fallback:", error.message);
    return res.json({ success: true, quizData: fallbackData.quizzes, isFallback: true });
  }
});

// 4. QUIZ GET DETAIL
app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${ROADMAP_BASE_URL}/quiz/${id}`, {
      headers: { "x-api-key": API_KEY }
    });
    if (!response.ok) {
      console.warn(`External API returned ${response.status} for /quiz/${id}. Falling back offline.`);
      const localQuiz = fallbackData.quizzes.find((q: any) => q._id === id);
      if (localQuiz) {
        return res.json({ success: true, quiz: localQuiz, isFallback: true });
      }
      return res.status(response.status).json({ success: false, error: "Quiz not found offline" });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.warn(`Proxy error /api/quizzes/${req.params.id}, triggering fallback:`, error.message);
    const localQuiz = fallbackData.quizzes.find((q: any) => q._id === req.params.id);
    if (localQuiz) {
      return res.json({ success: true, quiz: localQuiz, isFallback: true });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 5. PROJECTS GET LIST
app.get("/api/projects", async (req, res) => {
  try {
    const response = await fetch(`${ROADMAP_BASE_URL}/project`, {
      headers: { "x-api-key": API_KEY }
    });
    if (!response.ok) {
      console.warn(`External API returned status ${response.status} for /project. Falling back offline.`);
      return res.json({ success: true, projects: fallbackData.projects, isFallback: true });
    }
    const data = await response.json();
    let computedProjects = [];
    if (data && typeof data === "object") {
      computedProjects = data.projects || data.project || (Array.isArray(data) ? data : []);
    }
    if (computedProjects.length === 0) {
      computedProjects = fallbackData.projects;
    }
    return res.json({ success: true, projects: computedProjects, isFallback: false });
  } catch (error: any) {
    console.warn("Proxy error /api/projects, triggering fallback:", error.message);
    return res.json({ success: true, projects: fallbackData.projects, isFallback: true });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fullstack server listening on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
