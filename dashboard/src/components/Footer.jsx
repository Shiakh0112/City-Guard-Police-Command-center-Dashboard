import { useSelector } from "react-redux";

export default function Footer() {
  const profile = useSelector((s) => s.profile);
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xl font-bold gradient-text font-code">&lt;{profile.name.split(" ")[0]} /&gt;</span>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} {profile.name} · Built with React & ❤️
        </p>
        <p className="text-xs text-gray-400 font-code">v1.0.0</p>
      </div>
    </footer>
  );
}
