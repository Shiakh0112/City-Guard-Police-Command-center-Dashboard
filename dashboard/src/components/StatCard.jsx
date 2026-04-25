export default function StatCard({ icon: Icon, label, value, sub, accent = "stat-red", trend }) {
  return (
    <div className="card fade-up flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${accent} flex items-center justify-center shrink-0`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
          {trend >= 0 ? "+" : ""}{trend}%
        </span>
      )}
    </div>
  );
}
