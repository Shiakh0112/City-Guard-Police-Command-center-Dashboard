import { useState } from "react";
import { useSelector } from "react-redux";
import { FaGithub, FaExternalLinkAlt, FaStar } from "react-icons/fa";

const statusColors = {
  Live: "bg-green-500/15 text-green-500 border-green-500/30",
  "In Progress": "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  Planning: "bg-blue-500/15 text-blue-500 border-blue-500/30",
};

const filters = ["All", "Live", "In Progress", "Planning"];

export default function Projects() {
  const projects = useSelector((s) => s.projects);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? projects : projects.filter((p) => p.status === filter);

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-indigo-500 font-code text-sm font-medium mb-2">Things I've built</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border
                ${filter === f
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/30"
                  : "bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-500"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="card group overflow-hidden p-0 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${project.color}`} />

              <div className="p-6">
                {/* Title + Status */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{project.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap ml-2 ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{project.desc}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span><span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${project.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t) => (
                    <span key={t} className="tag text-xs">{t}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <FaStar className="text-yellow-400" size={13} />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex gap-3">
                    <a href={project.link} className="text-gray-400 hover:text-indigo-500 transition-colors" title="GitHub">
                      <FaGithub size={17} />
                    </a>
                    <a href={project.demo} className="text-gray-400 hover:text-indigo-500 transition-colors" title="Live Demo">
                      <FaExternalLinkAlt size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
