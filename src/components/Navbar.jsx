import { useEffect, useState } from "react";
import {
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";

const L = [
  ["/home", "Home"],
  ["/discover", "Discover"],
  ["/community", "Community"],
  ["/watchlist", "Watchlist"],
  ["/profile", "Profile"],
];

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("cs_user") || "null");
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(
    () => localStorage.getItem("cs_token")
  );

  const [user, setUser] = useState(getSavedUser);

  // Refresh authentication information after navigation or page refresh
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("cs_token"));
      setUser(getSavedUser());
    };

    syncAuth();

    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("cs_token");
    localStorage.removeItem("cs_user");

    setToken(null);
    setUser(null);

    navigate("/login");
  };

  const isLoggedIn = Boolean(token);

  return (
    <header className="fixed top-0 inset-x-0 z-40 glass border-x-0 border-t-0">
      <nav
        aria-label="Main"
        className="flex items-center justify-between px-5 md:px-12 h-16 gap-4"
      >
        {/* Logo */}
        <Link
          to="/home"
          className="font-display text-sm tracking-[.3em] shrink-0"
        >
          CINE<span className="text-pink">SPHERE</span>
        </Link>

        {/* Navigation links */}
        <ul className="flex gap-4 md:gap-8 text-xs md:text-sm overflow-x-auto">
          {L.map(([to, label]) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `relative py-2 whitespace-nowrap ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}

                    {isActive && (
                      <motion.span
                        layoutId="ind"
                        className="absolute -bottom-0.5 inset-x-0 h-px bg-pink shadow-[0_0_8px_#ff6b8a]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Authentication actions */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:block text-xs text-slate-300">
              Hi, {user?.name?.split(" ")[0] || "User"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="btn2 text-xs whitespace-nowrap"
            >
              LOG OUT
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn2 hidden sm:block whitespace-nowrap"
          >
            SIGN IN
          </Link>
        )}
      </nav>
    </header>
  );
}