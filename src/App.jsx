import BackendTest from "./BackendTest";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { MotionConfig } from "framer-motion";

import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import ParticleBackground from "./components/ParticleBackground";

import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import Discover from "./pages/Discover";
import Watchlist from "./pages/Watchlist";
import Profile from "./pages/Profile";

import { MOVIES } from "./data";

const Ctx = createContext();

export const useStore = () => useContext(Ctx);

// Read and save data in localStorage
function useLS(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Local storage error:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

// Match database string IDs to the IDs used by movie cards
function normalizeWatchlist(ids) {
  if (!Array.isArray(ids)) return [];

  return ids.map((id) => {
    const movie = MOVIES.find(
      (item) => String(item.id) === String(id)
    );

    return movie ? movie.id : String(id);
  });
}

// Protect pages that require login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("cs_token");

  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const loc = useLocation();
  const navigate = useNavigate();

  const [watch, setWatch] = useLS("cs_watch", []);
  const [liked, setLiked] = useLS("cs_liked", []);
  const [saved, setSaved] = useLS("cs_saved", []);

  // Load the signed-in user's watchlist from MongoDB
  useEffect(() => {
    const token = localStorage.getItem("cs_token");
    let cancelled = false;

    if (!token) {
      setWatch([]);
      return () => {
        cancelled = true;
      };
    }

    async function loadWatchlist() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/watchlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("cs_token");
            localStorage.removeItem("cs_user");

            if (!cancelled) {
              setWatch([]);
              navigate("/login");
            }
          }

          throw new Error(
            data.message || "Could not load watchlist"
          );
        }

        if (!cancelled) {
          setWatch(normalizeWatchlist(data.watchlist));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Watchlist loading error:", error.message);
        }
      }
    }

    loadWatchlist();

    return () => {
      cancelled = true;
    };
  }, [loc.pathname, navigate, setWatch]);

  // Add or remove a movie through the backend API
  const toggleWatch = async (movieId) => {
    const token = localStorage.getItem("cs_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const alreadySaved = watch.some(
      (id) => String(id) === String(movieId)
    );

    const url =
      "http://localhost:5000/api/watchlist/" +
      encodeURIComponent(String(movieId));

    try {
      const response = await fetch(url, {
        method: alreadySaved ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("cs_token");
          localStorage.removeItem("cs_user");
          setWatch([]);
          navigate("/login");
        }

        throw new Error(
          data.message || "Could not update watchlist"
        );
      }

      setWatch(normalizeWatchlist(data.watchlist));
    } catch (error) {
      console.error("Watchlist update error:", error.message);
      window.alert(error.message || "Could not update watchlist.");
    }
  };

  // Likes and saved posts still use localStorage for now
  const toggleItem = (setItems) => (id) =>
    setItems((items) =>
      items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id]
    );

  const page = (element) => (
    <PageTransition key={loc.pathname}>
      {element}
    </PageTransition>
  );

  return (
    <MotionConfig reducedMotion="user">
      <Ctx.Provider
        value={{
          watch,
          liked,
          saved,
          toggleWatch,
          toggleLike: toggleItem(setLiked),
          toggleSave: toggleItem(setSaved),
        }}
      >
        <ParticleBackground />

        {loc.pathname !== "/" && <Navbar />}

        <Routes location={loc}>
          <Route path="/backend-test" element={<BackendTest />} />

          <Route path="/" element={<Intro />} />
          <Route path="/home" element={page(<Home />)} />

          <Route
            path="/login"
            element={page(<Auth mode="login" />)}
          />

          <Route
            path="/signup"
            element={page(<Auth mode="signup" />)}
          />

          <Route
            path="/discover"
            element={page(<Discover />)}
          />

          <Route
            path="/community"
            element={page(
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/watchlist"
            element={page(
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/profile"
            element={page(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />

          <Route
            path="*"
            element={<Navigate to="/home" replace />}
          />
        </Routes>
      </Ctx.Provider>
    </MotionConfig>
  );
}