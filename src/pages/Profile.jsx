import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Film,
  Heart,
  Clock,
  User,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useStore } from '../App';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('cs_user')) || {};
  } catch {
    return {};
  }
}

export default function Profile() {
  const {
    watch,
    liked,
    toggleLike,
  } = useStore();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  const name = (
    user.name ||
    user.fullName ||
    user.username ||
    (user.email
      ? user.email.split('@')[0]
      : '') ||
    'CineSphere User'
  ).trim();

  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    async function loadWatchlistMovies() {
      if (!watch.length) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const results = await Promise.all(
          watch.map(async (movieId) => {
            try {
              const response = await fetch(
                `http://localhost:5000/api/movies/${movieId}`
              );

              if (!response.ok) {
                return null;
              }

              return await response.json();
            } catch {
              return null;
            }
          })
        );

        setMovies(results.filter(Boolean));
      } catch (error) {
        console.error(
          'Profile movie loading error:',
          error.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadWatchlistMovies();
  }, [watch]);

  return (
    <section className="max-w-6xl mx-auto pb-16">

      {/* PROFILE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex items-center gap-5">

            <div
              aria-hidden
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink to-cyan grid place-items-center text-ink text-3xl font-semibold shadow-[0_0_30px_rgba(255,107,138,.25)]"
            >
              {initial}
            </div>

            <div>
              <p className="text-pink text-xs tracking-[.25em] mb-1">
                CINESPHERE MEMBER
              </p>

              <h1 className="font-display text-2xl md:text-3xl">
                {name}
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                {user.email || 'CineSphere member'}
              </p>
            </div>

          </div>

          <Link
            to="/discover"
            className="btn text-center"
          >
            DISCOVER MOVIES
          </Link>

        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
      >

        <div className="glass p-5">
          <Film className="text-cyan mb-3" size={20} />

          <p className="text-xs text-slate-500">
            WATCHLIST
          </p>

          <p className="font-display text-2xl mt-1">
            {watch.length}
          </p>
        </div>

        <div className="glass p-5">
          <Heart className="text-pink mb-3" size={20} />

          <p className="text-xs text-slate-500">
            FAVORITES
          </p>

          <p className="font-display text-2xl mt-1">
            {liked.length}
          </p>
        </div>

        <div className="glass p-5">
          <Star className="text-cyan mb-3" size={20} />

          <p className="text-xs text-slate-500">
            MOVIES SAVED
          </p>

          <p className="font-display text-2xl mt-1">
            {movies.length}
          </p>
        </div>

        <div className="glass p-5">
          <Clock className="text-pink mb-3" size={20} />

          <p className="text-xs text-slate-500">
            CINEMA STATUS
          </p>

          <p className="font-display text-lg mt-1">
            ACTIVE
          </p>
        </div>

      </motion.div>

      {/* WATCHLIST */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mt-10"
      >

        <div className="flex items-end justify-between">

          <div>
            <p className="text-pink text-xs tracking-[.25em]">
              YOUR CINEMA
            </p>

            <h2 className="font-display text-2xl mt-2">
              Your watchlist
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Save movies you want to watch later.
            </p>
          </div>

          {movies.length > 0 && (
            <Link
              to="/watchlist"
              className="text-xs text-cyan hover:text-pink transition"
            >
              VIEW ALL →
            </Link>
          )}

        </div>

        {loading && (
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[2/3] glass animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-5">

            {movies.slice(0, 8).map(
              (movie, index) => {

                const isFavorite = liked.some(
                  (id) =>
                    String(id) ===
                    String(movie.id)
                );

                return (
                  <motion.div
                    key={movie.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.06,
                    }}
                    whileHover={{ y: -6 }}
                    className="group glass overflow-hidden"
                  >

                    {/* POSTER */}
                    <Link
                      to="/discover"
                      className="block"
                    >
                      <div className="aspect-[2/3] overflow-hidden relative">

                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center bg-white/5">
                            <Film
                              size={30}
                              className="text-slate-600"
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-display text-sm line-clamp-2">
                            {movie.title}
                          </h3>
                        </div>

                      </div>
                    </Link>

                    {/* MOVIE INFO */}
                    <div className="p-3">

                      <div className="flex items-center justify-between text-xs">

                        <span className="flex items-center gap-1 text-cyan">
                          <Star size={13} />
                          {Number(
                            movie.rating || 0
                          ).toFixed(1)}
                        </span>

                        <span className="text-slate-500">
                          {movie.year}
                        </span>

                      </div>

                      {/* FAVORITE BUTTON */}
                      <button
                        onClick={() =>
                          toggleLike(movie.id)
                        }
                        aria-pressed={isFavorite}
                        className={`w-full mt-3 py-2 border text-xs flex items-center justify-center gap-2 transition ${
                          isFavorite
                            ? 'border-pink text-pink bg-pink/5'
                            : 'border-white/10 text-slate-400 hover:border-pink hover:text-pink'
                        }`}
                      >
                        {isFavorite ? (
                          <>
                            <Check size={14} />
                            FAVORITED
                          </>
                        ) : (
                          <>
                            <Heart size={14} />
                            ADD TO FAVORITES
                          </>
                        )}
                      </button>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="glass mt-7 p-10 text-center">

            <Film
              size={34}
              className="mx-auto text-slate-600"
            />

            <h3 className="font-display text-lg mt-4">
              Your watchlist is empty
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Start building your personal cinema
              collection.
            </p>

            <Link
              to="/discover"
              className="btn inline-block mt-5"
            >
              EXPLORE MOVIES
            </Link>

          </div>
        )}

      </motion.section>

      {/* FAVORITES INFO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-12"
      >

        <p className="text-pink text-xs tracking-[.25em]">
          YOUR CINEMA JOURNEY
        </p>

        <h2 className="font-display text-2xl mt-2">
          Your activity
        </h2>

        <div className="glass mt-5 p-6">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-full bg-pink/10 grid place-items-center">
              <Heart
                size={18}
                className="text-pink"
              />
            </div>

            <div>

              <p className="text-sm">
                You have{' '}
                <span className="text-pink">
                  {liked.length}
                </span>{' '}
                favorite movie
                {liked.length === 1
                  ? ''
                  : 's'}.
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Mark movies as favorites to build
                your personal cinema collection.
              </p>

            </div>

          </div>

        </div>

      </motion.section>

    </section>
  );
}
