import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-800/80 px-6 py-3 md:px-12 flex items-center justify-between">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-wide">
          Note<span className="text-indigo-400 font-medium">AI</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1 md:gap-4">
        <Link
          to="/"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive("/")
              ? "text-indigo-400 bg-indigo-500/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          Home
        </Link>

        <Link
          to="/upload"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive("/upload")
              ? "text-indigo-400 bg-indigo-500/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          Upload
        </Link>

        <Link
          to="/dashboard"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive("/dashboard")
              ? "text-indigo-400 bg-indigo-500/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          Dashboard
        </Link>
      </div>

      {/* Status Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        LIVE
      </div>
    </nav>
  );
};

export default Navbar;
