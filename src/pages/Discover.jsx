import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Star,
  Plus,
  Check,
  Calendar,
  Clock,
  User,
  Heart,
} from "lucide-react";

import MovieCard from "../components/MovieCard";
import { useStore } from "../App";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  27: "Horror",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default function Discover() {
  const [q, setQ] = useState("");
  const [g, setG] = useState("All");

  const [sel, setSel] = useState(null);
  const [details, setDetails] = useState(null);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] =
    useState(false);
  const [error, setError] = useState("");

  const {
    watch,
    toggleWatch,
    liked,
    toggleLike,
  } = useStore();

  // ==========================================
  // FETCH MOVIES
  // ==========================================

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const url = new URL(
          "http://localhost:5000/api/movies"
        );

        if (q.trim()) {
          url.searchParams.set(
            "search",
            q.trim()
          );
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch movies"
          );
        }

        const data = await response.json();

        const formattedMovies =
          (data.movies || []).map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            plot: movie.overview,
            poster: movie.poster,
            genreIds: movie.genreIds || [],
            genre:
              GENRE_MAP[
                movie.genreIds?.[0]
              ] || "Drama",
            art: movie.poster,
          }));

        setMovies(formattedMovies);
      } catch (err) {
        console.error(
          "Movie fetch error:",
          err
        );

        setError(
          "Unable to load movies. Make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMovies();
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);

  // ==========================================
  // FETCH FULL MOVIE DETAILS
  // ==========================================

  useEffect(() => {
    if (!sel?.id) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        setDetailsLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/movies/${sel.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Could not load movie details"
          );
        }

        const data = await response.json();

        setDetails(data);
      } catch (error) {
        console.error(
          "Movie details error:",
          error
        );

        // Keep basic movie information
        // if detailed request fails.
        setDetails(sel);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [sel]);

  // ==========================================
  // SEARCH + GENRE FILTER
  // ==========================================

  const list = useMemo(() => {
    return movies.filter((m) => {
      const matchesSearch = m.title
        .toLowerCase()
        .includes(q.toLowerCase());

      const matchesGenre =
        g === "All" ||
        m.genreIds.some(
          (id) => GENRE_MAP[id] === g
        );

      return matchesSearch && matchesGenre;
    });
  }, [movies, q, g]);

  // ==========================================
  // FORMAT RUNTIME
  // ==========================================

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";

    const hours = Math.floor(
      minutes / 60
    );

    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    }

    return `${hours}h ${mins}m`;
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeDetails = () => {
    setSel(null);
    setDetails(null);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section>
      {/* HEADER */}

      <div>
        <h1 className="font-display text-3xl">
          Discover
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Explore movies from across the
          cinematic universe.
        </p>
      </div>

      {/* SEARCH */}

      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-3.5 text-slate-500"
          />

          <input
            aria-label="Search movies"
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
            placeholder="Search movies"
            className="field pl-9 w-64"
          />
        </div>

        {/* GENRES */}

        <div className="flex gap-2 flex-wrap">
          {GENRES.map((x) => (
            <button
              key={x}
              aria-pressed={g === x}
              onClick={() => setG(x)}
              className={`px-3 py-1.5 text-xs border transition ${
                g === x
                  ? "border-pink text-pink"
                  : "border-white/15 text-slate-400 hover:border-white/40"
              }`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <p className="mt-16 text-center text-slate-400">
          Loading movies...
        </p>
      )}

      {/* ERROR */}

      {error && !loading && (
        <p className="mt-16 text-center text-red-400">
          {error}
        </p>
      )}

      {/* MOVIES */}

      {!loading &&
        !error &&
        list.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
            {list.map((m) => (
              <MovieCard
                key={m.id}
                m={m}
                onOpen={setSel}
              />
            ))}
          </div>
        )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        list.length === 0 && (
          <p className="mt-16 text-center text-slate-400">
            No movies match "{q}". Try another
            title or genre.
          </p>
        )}

      {/* ========================================
          MOVIE DETAILS
      ======================================== */}

      <AnimatePresence>
        {sel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetails}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={sel.title}
              onClick={(e) =>
                e.stopPropagation()
              }
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 30,
                scale: 0.96,
              }}
              transition={{
                duration: 0.25,
              }}
              className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* BACKDROP */}

              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={
                    details?.backdrop ||
                    sel.poster
                  }
                  alt={sel.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* CLOSE */}

                <button
                  aria-label="Close"
                  onClick={closeDetails}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 transition"
                >
                  <X size={18} />
                </button>

                {/* TITLE */}

                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="font-display text-2xl md:text-4xl text-white">
                    {details?.title ||
                      sel.title}
                  </h2>

                  {details?.tagline && (
                    <p className="mt-2 text-sm italic text-slate-300">
                      "{details.tagline}"
                    </p>
                  )}
                </div>
              </div>

              {/* CONTENT */}

              <div className="p-6">
                {detailsLoading ? (
                  <div className="py-10 text-center text-slate-400">
                    Loading movie details...
                  </div>
                ) : (
                  <>
                    {/* META */}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                      <span className="flex items-center gap-1 text-cyan">
                        <Star
                          size={15}
                          fill="currentColor"
                        />

                        {Number(
                          details?.rating ||
                            sel.rating ||
                            0
                        ).toFixed(1)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={15} />

                        {details?.year ||
                          sel.year}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={15} />

                        {formatRuntime(
                          details?.runtime
                        )}
                      </span>

                      {details?.director && (
                        <span className="flex items-center gap-1">
                          <User size={15} />

                          {details.director.name}
                        </span>
                      )}
                    </div>

                    {/* GENRES */}

                    {details?.genres?.length >
                      0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {details.genres.map(
                          (genre) => (
                            <span
                              key={genre.id}
                              className="px-3 py-1 text-xs border border-white/15 text-slate-300"
                            >
                              {genre.name}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* OVERVIEW */}

                    <div className="mt-6">
                      <h3 className="font-display text-lg">
                        Overview
                      </h3>

                      <p className="mt-3 leading-7 text-slate-400">
                        {details?.overview ||
                          sel.plot ||
                          "No overview available."}
                      </p>
                    </div>

                    {/* CAST */}

                    {details?.cast?.length >
                      0 && (
                      <div className="mt-7">
                        <h3 className="font-display text-lg">
                          Top Cast
                        </h3>

                        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                          {details.cast.map(
                            (person) => (
                              <div
                                key={person.id}
                                className="min-w-[90px] w-[90px]"
                              >
                                <div className="h-28 overflow-hidden bg-white/5">
                                  {person.profile ? (
                                    <img
                                      src={
                                        person.profile
                                      }
                                      alt={
                                        person.name
                                      }
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full grid place-items-center text-slate-600">
                                      <User
                                        size={28}
                                      />
                                    </div>
                                  )}
                                </div>

                                <p className="mt-2 text-xs text-white truncate">
                                  {person.name}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-500 truncate">
                                  {person.character}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* ACTION BUTTONS */}

                    <div className="mt-7 flex flex-wrap gap-3">

                      {/* WATCHLIST */}

                      <button
                        onClick={() =>
                          toggleWatch(
                            details?.id ||
                              sel.id
                          )
                        }
                        className="btn flex items-center gap-2"
                      >
                        {watch.some(
                          (id) =>
                            String(id) ===
                            String(
                              details?.id ||
                                sel.id
                            )
                        ) ? (
                          <>
                            <Check size={16} />
                            REMOVE FROM WATCHLIST
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            ADD TO WATCHLIST
                          </>
                        )}
                      </button>

                      {/* FAVORITE */}

                      <button
                        onClick={() =>
                          toggleLike(
                            details?.id ||
                              sel.id
                          )
                        }
                        className={`px-5 py-2.5 border text-xs tracking-wide transition flex items-center gap-2 ${
                          liked.some(
                            (id) =>
                              String(id) ===
                              String(
                                details?.id ||
                                  sel.id
                              )
                          )
                            ? "border-pink text-pink bg-pink/5"
                            : "border-white/15 text-slate-300 hover:border-pink hover:text-pink"
                        }`}
                      >
                        {liked.some(
                          (id) =>
                            String(id) ===
                            String(
                              details?.id ||
                                sel.id
                            )
                        ) ? (
                          <>
                            <Heart
                              size={16}
                              fill="currentColor"
                            />
                            FAVORITED
                          </>
                        ) : (
                          <>
                            <Heart size={16} />
                            ADD TO FAVORITES
                          </>
                        )}
                      </button>

                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
