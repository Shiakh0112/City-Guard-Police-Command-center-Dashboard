import { useSelector } from "react-redux";
import SkillBar from "../components/SkillBar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

export default function SkillsPage() {
  const skills = useSelector((s) => s.skills);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#2a2a4a" : "#e5e7eb";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold gradient-text">Skills</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Bars */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-5">Proficiency</h2>
          {skills.map((s) => <SkillBar key={s.name} skill={s} />)}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-5">Skills Overview</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={skills} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: isDark ? "#1a1a2e" : "#fff", border: "1px solid #6366f1", borderRadius: 8 }}
                labelStyle={{ color: isDark ? "#e2e8f0" : "#111" }}
              />
              <Bar dataKey="level" radius={[0, 6, 6, 0]}>
                {skills.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
