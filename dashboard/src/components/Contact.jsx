import { useState } from "react";
import { useSelector } from "react-redux";
import { MdEmail, MdLocationOn, MdPhone, MdSend } from "react-icons/md";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Contact() {
  const profile = useSelector((s) => s.profile);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", message: "" }); }, 3000);
  };

  const contacts = [
    { icon: MdEmail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: MdPhone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
    { icon: MdLocationOn, label: "Location", value: profile.location, href: "#" },
  ];

  const socials = [
    { icon: FaGithub, href: `https://${profile.github}`, label: "GitHub", color: "hover:bg-gray-800 hover:text-white" },
    { icon: FaLinkedin, href: `https://${profile.linkedin}`, label: "LinkedIn", color: "hover:bg-blue-600 hover:text-white" },
    { icon: FaTwitter, href: `https://${profile.twitter}`, label: "Twitter", color: "hover:bg-sky-500 hover:text-white" },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-500 font-code text-sm font-medium mb-2">Get in touch</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-md mx-auto">
            Have a project in mind or want to chat? I'm always open to new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Info */}
          <div className="space-y-6">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="card flex items-center gap-4 hover:border-indigo-500/40 group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{value}</p>
                </div>
              </a>
            ))}

            {/* Socials */}
            <div className="card">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Find me on</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium transition-all ${color}`}
                  >
                    <Icon size={16} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Send a Message</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all
                ${sent ? "bg-green-500 shadow-lg shadow-green-500/30" : "btn-primary w-full justify-center"}`}
            >
              {sent ? "✓ Message Sent!" : <><MdSend size={18} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
