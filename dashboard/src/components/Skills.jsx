import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function SkillBar({ skill, animate }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          <span>{skill.icon}</span> {skill.name}
        </span>
        <span className="text-sm font-bold text-indigo-500">{skill.level}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="skill-bar-fill bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
          style={{ width: animate ? `${skill.level}%` : "0%" }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const { technical, tools, soft } = useSelector((s) => s.skills);
  const ref = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="py-24 bg-gray-50/50 dark:bg-white/[0.02]" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-500 font-code text-sm font-medium mb-2">What I work with</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technical Skills */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">💻</span>
              Technical Skills
            </h3>
            {technical.map((s) => <SkillBar key={s.name} skill={s} animate={animate} />)}
          </div>

          {/* Tools + Soft Skills */}
          <div className="flex flex-col gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">🛠️</span>
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">🧠</span>
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {soft.map((s) => (
                  <span key={s} className="tag" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", borderColor: "rgba(6,182,212,0.2)" }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Code snippet card */}
            <div className="card bg-gray-900 dark:bg-black border-gray-800">
              <p className="font-code text-xs text-gray-500 mb-2">// my_stack.js</p>
              <p className="font-code text-sm">
                <span className="text-purple-400">const</span>{" "}
                <span className="text-cyan-400">stack</span>{" "}
                <span className="text-white">= {"{"}</span>
              </p>
              <p className="font-code text-sm pl-4">
                <span className="text-green-400">frontend</span>
                <span className="text-white">: </span>
                <span className="text-yellow-300">"React, Next.js"</span><span className="text-white">,</span>
              </p>
              <p className="font-code text-sm pl-4">
                <span className="text-green-400">backend</span>
                <span className="text-white">: </span>
                <span className="text-yellow-300">"Node, Python"</span><span className="text-white">,</span>
              </p>
              <p className="font-code text-sm pl-4">
                <span className="text-green-400">cloud</span>
                <span className="text-white">: </span>
                <span className="text-yellow-300">"AWS, Docker"</span>
              </p>
              <p className="font-code text-sm"><span className="text-white">{"}"}</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
