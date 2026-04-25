import { FaStar, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteProject } from "../store/store";

const statusColors = {
  Live: "bg-green-500/20 text-green-400",
  "In Progress": "bg-yellow-500/20 text-yellow-400",
  Planning: "bg-blue-500/20 text-blue-400",
};

export default function ProjectCard({ project }) {
  const dispatch = useDispatch();

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.tech}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status] || "bg-gray-500/20 text-gray-400"}`}>
            {project.status}
          </span>
          <button onClick={() => dispatch(deleteProject(project.id))} className="text-gray-400 hover:text-red-400 transition-colors">
            <FaTrash size={13} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <FaStar className="text-yellow-400" />
        <span>{project.stars}</span>
      </div>
    </div>
  );
}
