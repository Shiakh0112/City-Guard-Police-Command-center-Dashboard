import { useSelector } from "react-redux";
import { MdLocationOn, MdWork } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export default function Experience() {
  const experience = useSelector((s) => s.experience);

  return (
    <section id="experience" className="py-24 bg-gray-50/50 dark:bg-white/[0.02]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-500 font-code text-sm font-medium mb-2">Where I've worked</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">
            Work <span className="gradient-text">Experience</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative pl-12">
            {/* Timeline line */}
            <div className="timeline-line" />

            {experience.map((exp, i) => (
              <div key={exp.id} className="relative mb-10 animate-slide-left" style={{ animationDelay: `${i * 0.15}s` }}>
                {/* Timeline dot */}
                <div className="absolute -left-12 top-1 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <MdWork size={18} className="text-white" />
                </div>

                <div className="card hover:border-indigo-500/40">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                      <p className="text-indigo-500 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold border border-indigo-500/20">
                        {exp.period}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end">
                        <MdLocationOn size={13} /> {exp.location}
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{exp.desc}</p>

                  {/* Achievements */}
                  <ul className="space-y-2 mb-4">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" size={13} />
                        {a}
                      </li>
                    ))}
                  </ul>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100 dark:border-white/10">
                    {exp.tech.map((t) => (
                      <span key={t} className="tag text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
