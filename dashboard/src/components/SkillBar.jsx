const categoryColors = {
  Frontend: "from-indigo-500 to-purple-500",
  Backend: "from-green-500 to-teal-500",
  Language: "from-yellow-500 to-orange-500",
  Cloud: "from-cyan-500 to-blue-500",
  DevOps: "from-red-500 to-pink-500",
  Database: "from-purple-500 to-pink-500",
  API: "from-teal-500 to-cyan-500",
};

export default function SkillBar({ skill }) {
  const gradient = categoryColors[skill.category] || "from-indigo-500 to-purple-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
          <span className="ml-2 text-xs text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
            {skill.category}
          </span>
        </div>
        <span className="text-sm font-semibold text-indigo-500">{skill.level}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`}
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
}
