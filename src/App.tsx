import { useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { detectPlatform } from "./lib/platform";

// Site
import SiteLayout from "./components/SiteLayout";
import Landing from "./site/Landing";
import Login from "./site/Login";
import Course from "./site/Course";
import ModuleDetail from "./site/ModuleDetail";
import SiteProfile from "./site/SiteProfile";

// PyQuest
import AppShell from "./app/AppShell";
import DailyQuest from "./app/DailyQuest";
import Categories from "./app/Categories";
import CategoryDetail from "./app/CategoryDetail";
import QuestRunner from "./app/QuestRunner";
import Leaderboard from "./app/Leaderboard";
import PracticeProfile from "./app/PracticeProfile";

// TMA
import TmaLayout from "./tma/TmaLayout";

export default function App() {
  const platform = useMemo(() => detectPlatform(), []);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const strict = platform === "pwa" || platform === "telegram";
    // Если открыто в TMA и зашли на "/", ведём сразу в /tma
    if (platform === "telegram" && location.pathname === "/") {
      navigate("/tma", { replace: true });
    } else if (platform === "pwa" && location.pathname === "/") {
      navigate("/app", { replace: true });
    }
  }, [platform, location.pathname, navigate]);

  // Общие страницы PyQuest для /app и /tma
  const questRoutes = (
    <>
      <Route index element={<DailyQuest />} />
      <Route path="categories" element={<Categories />} />
      <Route path="categories/:categoryId" element={<CategoryDetail />} />
      <Route path="quest/:questId" element={<QuestRunner />} />
      <Route path="leaderboard" element={<Leaderboard />} />
      <Route path="profile" element={<PracticeProfile />} />
    </>
  );

  return (
    <Routes>
      {/* ─── Сайт ─── */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:moduleId" element={<ModuleDetail />} />
        <Route path="/profile" element={<SiteProfile />} />
      </Route>

      {/* ─── PyQuest: PWA ─── */}
      <Route path="/app" element={<AppShell />}>
        {questRoutes}
      </Route>

      {/* ─── PyQuest: Telegram Mini App ─── */}
      <Route path="/tma" element={<TmaLayout />}>
        {questRoutes}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
