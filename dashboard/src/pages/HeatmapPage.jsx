import { useSelector } from "react-redux";

const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D"];

const zoneInfo = {
  "Zone A": { lat: "40.71°N", lng: "74.01°W", area: "Downtown", risk: "High" },
  "Zone B": { lat: "40.73°N", lng: "73.99°W", area: "Midtown", risk: "Medium" },
  "Zone C": { lat: "40.75°N", lng: "74.03°W", area: "North Park", risk: "Low" },
  "Zone D": { lat: "40.69°N", lng: "74.05°W", area: "South End", risk: "Medium" },
};

const riskColor = {
  High: "border-red-500/40 bg-red-500/5",
  Medium: "border-yellow-500/40 bg-yellow-500/5",
  Low: "border-green-500/40 bg-green-500/5",
};
const riskBadge = {
  High: "badge badge-high",
  Medium: "badge badge-medium",
  Low: "badge badge-low",
};

// Generate a fake heatmap grid (8x8) per zone
function generateGrid(count) {
  return Array.from({ length: 64 }, () => {
    const r = Math.random();
    if (r < count / 120) return "high";
    if (r < count / 60) return "med";
    if (r < count / 30) return "low";
    return "none";
  });
}

const cellColor = {
  high: "bg-red-500 opacity-80",
  med: "bg-orange-400 opacity-60",
  low: "bg-yellow-400 opacity-40",
  none: "bg-gray-200 dark:bg-white/5 opacity-30",
};

export default function HeatmapPage() {
  const incidents = useSelector((s) => s.incidents.list);

  const zoneCounts = ZONES.reduce((acc, z) => {
    acc[z] = incidents.filter((i) => i.zone === z).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5 fade-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Zone Map</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Crime density heatmap by patrol zone</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium">Density:</span>
        {[["bg-red-500", "High"], ["bg-orange-400", "Medium"], ["bg-yellow-400", "Low"], ["bg-gray-300 dark:bg-white/10", "None"]].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${c}`} />
            {l}
          </div>
        ))}
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ZONES.map((zone) => {
          const count = zoneCounts[zone] || 0;
          const info = zoneInfo[zone];
          const grid = generateGrid(count);

          return (
            <div key={zone} className={`card border ${riskColor[info.risk]}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{zone}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{info.area}</p>
                  <p className="text-[10px] text-gray-400 mono mt-1">{info.lat} · {info.lng}</p>
                </div>
                <div className="text-right">
                  <span className={riskBadge[info.risk]}>{info.risk} Risk</span>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{count}</p>
                  <p className="text-[10px] text-gray-400">incidents</p>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="zone-grid">
                {grid.map((level, i) => (
                  <div key={i} className={`zone-cell ${cellColor[level]}`} />
                ))}
              </div>

              {/* Active incidents list */}
              <div className="mt-4 space-y-1">
                {incidents.filter((i) => i.zone === zone && i.status !== "Resolved").map((inc) => (
                  <div key={inc._id || inc.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-100 dark:border-white/5 last:border-0">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{inc.type}</span>
                    <span className="text-gray-400">{inc.location}</span>
                    <span className={`badge ${inc.severity === "Critical" ? "badge-critical" : inc.severity === "High" ? "badge-high" : "badge-medium"}`}>
                      {inc.severity}
                    </span>
                  </div>
                ))}
                {incidents.filter((i) => i.zone === zone && i.status !== "Resolved").length === 0 && (
                  <p className="text-xs text-green-400 text-center py-2">✓ All clear</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
