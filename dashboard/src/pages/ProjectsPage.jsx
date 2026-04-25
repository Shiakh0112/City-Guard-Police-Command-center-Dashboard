import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../store/store";
import ProjectCard from "../components/ProjectCard";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function ProjectsPage() {
  const projects = useSelector((s) => s.projects);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", tech: "", status: "Planning", stars: 0, progress: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    dispatch(addProject({ ...form, stars: Number(form.stars), progress: Number(form.progress) }));
    setForm({ name: "", tech: "", status: "Planning", stars: 0, progress: 0 });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? <FaTimes /> : <FaPlus />}
          {showForm ? "Cancel" : "Add Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "name", placeholder: "Project Name", type: "text" },
            { key: "tech", placeholder: "Tech Stack (e.g. React, Node)", type: "text" },
            { key: "stars", placeholder: "Stars", type: "number" },
            { key: "progress", placeholder: "Progress (0-100)", type: "number" },
          ].map(({ key, placeholder, type }) => (
            <input
              key={key}
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
            />
          ))}
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 text-sm"
          >
            {["Planning", "In Progress", "Live"].map((s) => (
              <option key={s} value={s} className="bg-gray-800">{s}</option>
            ))}
          </select>
          <button
            type="submit"
            className="md:col-span-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add Project
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
