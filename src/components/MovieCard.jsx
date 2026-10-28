import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Star, Flame } from "lucide-react";
import { useStore } from "../App";

const API = "http://localhost:5000";

export default function MovieCard({ m, onOpen }) {
  const { watch, toggleWatch } = useStore();

  const on = watch.includes(m.id);

  const [hype, setHype] = useState(null);
  const [hypeLoading, setHypeLoading] = useState(true);

  // ==========================================
  // FETCH HYPE SCORE
  // ==========================================

  useEffect(() => {
    const fetchHype = async () => {
      try {
        const token = localStorage.getItem("cs_token");

        if (!token) {
          setHypeLoading(false);
          return;
        }

        const response = await fetch(
          `${API}/api/hype/${m.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not fetch hype"
          );
        }

        setHype(data);
      } catch (error) {
        console.error(
          "Hype meter error:",
          error
        );

        setHype(null);
      } finally {
        setHypeLoading(false);
      }
    };

    fetchHype();
  }, [m.id]);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group glass overflow-hidden"
    >
      {/* ==========================================
          MOVIE POSTER
          ========================================== */}

      <button
        onClick={() => onOpen?.(m)}
        className="block w-full text-left"
      >
        <div className="aspect-[2/3] overflow-hidden relative">

          <img
            src={m.poster}
            alt={m.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />


          {/* ======================================
              HYPE BADGE
              ====================================== */}

          {!hypeLoading && hype && (
            <div className="absolute top-3 left-3">

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/75 backdrop-blur-md border border-orange-400/30">

                <Flame
                  size={13}
                  className="text-orange-400"
                />

                <span className="text-xs font-semibold text-orange-300">
                  {hype.hypeScore} HYPE
                </span>

              </div>

            </div>
          )}


          {/* Movie title */}

          <span className="absolute bottom-3 left-3 right-3 font-display text-sm text-white">
            {m.title}
          </span>

        </div>
      </button>


      {/* ==========================================
          MOVIE INFO
          ========================================== */}

      <div className="p-3">

        <div className="flex items-center justify-between text-xs">

          <span className="flex items-center gap-1 text-cyan">

            <Star size={13} />

            {m.rating} · {m.year}

          </span>


          {/* Watchlist */}

          <button
            aria-pressed={on}
            aria-label={
              on
                ? "Remove from watchlist"
                : "Add to watchlist"
            }
            onClick={() =>
              toggleWatch(m.id)
            }
            className="p-1.5 border border-white/15 hover:border-pink"
          >
            {on ? (
              <Check
                size={14}
                className="text-pink"
              />
            ) : (
              <Plus size={14} />
            )}
          </button>

        </div>


        {/* ==========================================
            HYPE LEVEL
            ========================================== */}

        {!hypeLoading && hype && (
          <div className="mt-2 flex items-center justify-between">

            <span className="text-[11px] text-slate-500">
              Community hype
            </span>

            <span
              className={`text-[11px] font-medium ${
                hype.hypeLevel === "Explosive"
                  ? "text-orange-400"
                  : hype.hypeLevel === "High"
                  ? "text-pink"
                  : hype.hypeLevel === "Rising"
                  ? "text-cyan"
                  : "text-slate-500"
              }`}
            >
              {hype.hypeLevel}
            </span>

          </div>
        )}

      </div>

    </motion.article>
  );
}
