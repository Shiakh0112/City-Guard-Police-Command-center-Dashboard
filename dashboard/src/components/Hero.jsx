import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaGithub, FaLinkedin, FaTwitter, FaArrowDown } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const roles = ["Full Stack Developer", "React Specialist", "Node.js Expert", "Open Source Contributor"];

export default function Hero() {
  const profile = useSelector((s) => s.profile);
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = roles[roleIdx];
    let timeout;
    if (typing) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  const stats = [
    { label: "Years Exp.", value: `${profile.experience}+` },
    { label: "Projects", value: `${profile.projects}+` },
    { label: "Commits", value: `${profile.commits}+` },
    { label: "GitHub Stars", value: "750+" },
  ];

  return (
    <section id="about" className="min-h-screen flex items-center mesh-bg pt-20">
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-6">
            {/* Available badge */}
            {profile.available && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-medium animate-slide-up">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
                Available for opportunities
              </div>
            )}

            <div className="animate-slide-up delay-100">
              <p className="text-indigo-500 font-code text-sm font-medium mb-2">Hello, World! 👋 I'm</p>
              <h1 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900 dark:text-white">
                {profile.name}
              </h1>
            </div>

            {/* Typing effect */}
            <div className="animate-slide-up delay-200 h-10 flex items-center">
              <span className="text-2xl font-bold gradient-text">{displayed}</span>
              <span className="cursor text-2xl font-bold text-indigo-500 ml-0.5">|</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed animate-slide-up delay-300 max-w-lg">
              {profile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up delay-400">
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary"
              >
                View My Work
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline"
              >
                <MdEmail size={18} /> Contact Me
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 animate-slide-up delay-500">
              {[
                { icon: FaGithub, href: `https://${profile.github}`, label: "GitHub" },
                { icon: FaLinkedin, href: `https://${profile.linkedin}`, label: "LinkedIn" },
                { icon: FaTwitter, href: `https://${profile.twitter}`, label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 text-gray-600 dark:text-gray-400 transition-all hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30"
                  title={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Right — Avatar + Stats */}
          <div className="flex flex-col items-center gap-8 animate-slide-right delay-200">
            {/* Avatar */}
            <div className="relative">
              <div className="gradient-border float">
                <div className="w-64 h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-1">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 shadow-xl border border-indigo-500/20 text-sm font-semibold text-indigo-600 dark:text-indigo-400 animate-scale-in delay-600">
                ⚡ React Expert
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 shadow-xl border border-purple-500/20 text-sm font-semibold text-purple-600 dark:text-purple-400 animate-scale-in delay-700">
                🚀 Open to Work
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              {stats.map(({ label, value }) => (
                <div key={label} className="card text-center py-4 px-3 pulse-glow">
                  <p className="text-2xl font-black gradient-text">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16 animate-fade-in delay-800">
          <button
            onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <span className="text-xs font-medium">Scroll Down</span>
            <FaArrowDown size={16} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
