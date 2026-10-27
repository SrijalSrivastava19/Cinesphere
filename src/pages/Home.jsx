import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star,
  Plus,
  Check,
  X,
  Calendar,
  Clock,
  User,
} from 'lucide-react';
import { useStore } from '../App';

const up = (i) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: 0.2 + i * 0.15,
    duration: 0.7,
  },
});

const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0
    ? `${hours}h ${mins}m`
    : `${mins}m`;
};

export default function Home() {
  const { watch, toggleWatch } = useStore();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);

        const response = await fetch(
          'http://localhost:5000/api/movies'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();

        const formatted = (data.movies || [])
          .slice(0, 8)
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            plot: movie.overview,
            poster: movie.poster,
            genreIds: movie.genreIds || [],
          }));

        setMovies(formatted);
      } catch (error) {
        console.error(
          'Home movie fetch error:',
          error.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  useEffect(() => {
    if (!selectedMovie) {
      setDetails(null);
      return;
    }

    async function fetchDetails() {
      try {
        setDetailsLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/movies/${selectedMovie.id}`
        );

        if (!response.ok) {
          throw new Error(
            'Could not fetch movie details'
          );
        }

        const data = await response.json();

        setDetails(data);
      } catch (error) {
        console.error(
          'Movie details error:',
          error.message
        );

        setDetails(selectedMovie);
      } finally {
        setDetailsLoading(false);
      }
    }

    fetchDetails();
  }, [selectedMovie]);

  const closeDetails = () => {
    setSelectedMovie(null);
    setDetails(null);
  };

  return (
    <section className="pb-16">

      {/* HERO */}
      <div className="grid md:grid-cols-2 items-center gap-10 min-h-[80vh]">

        <div>
          <motion.p
            {...up(0)}
            className="text-pink text-xs tracking-[.3em] mb-4"
          >
            Welcome to CineSphere
          </motion.p>

          <motion.h1
            {...up(1)}
            className="font-display text-4xl md:text-6xl leading-tight"
          >
            Your world of{' '}
            <span className="text-pink">
              cinema.
            </span>
          </motion.h1>

          <motion.p
            {...up(2)}
            className="mt-5 max-w-md text-slate-400"
          >
            Discover movies, log what you watch,
            share your perspective, and connect with
            people who love cinema as much as you do.
          </motion.p>

          <motion.div
            {...up(3)}
            className="mt-8 flex gap-3"
          >
            <Link
              to="/discover"
              className="btn active:scale-95"
            >
              EXPLORE MOVIES
            </Link>

            <Link
              to="/community"
              className="btn2 active:scale-95"
            >
              JOIN COMMUNITY
            </Link>
          </motion.div>

          <motion.dl
            {...up(4)}
            className="mt-10 flex gap-10 text-sm"
          >
            <div>
              <dt className="text-xs text-slate-500">
                Movies
              </dt>

              <dd className="text-xl font-display">
                10K+
              </dd>
            </div>

            <div>
              <dt className="text-xs text-slate-500">
                Cinema
              </dt>

              <dd className="text-xl font-display">
                24/7
              </dd>
            </div>

            <div>
              <dt className="text-xs text-slate-500">
                Community
              </dt>

              <dd className="text-xl font-display">
                Growing
              </dd>
            </div>
          </motion.dl>
        </div>

        {/* ORBITAL GRAPHIC */}
        <div
          aria-hidden
          className="relative mx-auto w-72 h-72 md:w-96 md:h-96"
        >
          {[1, 0.68, 0.38].map((s, i) => (
            <motion.div
              key={i}
              animate={{
                rotate: i % 2 ? -360 : 360,
              }}
              transition={{
                duration: 50 + i * 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ scale: s }}
              className="absolute inset-0 rounded-full border border-cyan/25"
            >
              <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#37d6e0]" />
            </motion.div>
          ))}

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
            className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-pink shadow-[0_0_40px_#ff6b8a]"
          />
        </div>
      </div>

      {/* POPULAR MOVIES */}
      <section className="mt-10">

        <div className="flex items-end justify-between">
          <div>
            <p className="text-pink text-xs tracking-[.25em]">
              EXPLORE
            </p>

            <h2 className="font-display text-2xl md:text-3xl mt-2">
              Popular right now
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Movies people are watching across the
              CineSphere.
            </p>
          </div>

          <Link
            to="/discover"
            className="hidden md:block text-xs text-cyan hover:text-pink transition"
          >
            VIEW ALL →
          </Link>
        </div>

        {loading && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[2/3] glass animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
            {movies.map((movie, index) => {
              const saved = watch.some(
                (id) =>
                  String(id) === String(movie.id)
              );

              return (
                <motion.article
                  key={movie.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  whileHover={{ y: -6 }}
                  className="group glass overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setSelectedMovie(movie)
                    }
                    className="block w-full text-left"
                  >
                    <div className="aspect-[2/3] overflow-hidden relative">

                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-display text-sm text-white line-clamp-2">
                          {movie.title}
                        </h3>
                      </div>
                    </div>
                  </button>

                  <div className="p-3 flex items-center justify-between text-xs">

                    <span className="flex items-center gap-1 text-cyan">
                      <Star size={13} />
                      {Number(movie.rating || 0).toFixed(1)}
                      {' · '}
                      {movie.year}
                    </span>

                    <button
                      aria-pressed={saved}
                      aria-label={
                        saved
                          ? 'Remove from watchlist'
                          : 'Add to watchlist'
                      }
                      onClick={() =>
                        toggleWatch(movie.id)
                      }
                      className="p-1.5 border border-white/15 hover:border-pink transition"
                    >
                      {saved ? (
                        <Check
                          size={14}
                          className="text-pink"
                        />
                      ) : (
                        <Plus size={14} />
                      )}
                    </button>

                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/discover"
            className="text-xs text-cyan"
          >
            VIEW ALL MOVIES →
          </Link>
        </div>
      </section>

      {/* MOVIE DETAILS MODAL */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetails}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedMovie.title}
              onClick={(e) =>
                e.stopPropagation()
              }
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >

              {/* BACKDROP */}
              <div className="relative h-52 md:h-72 overflow-hidden">

                {details?.backdrop ? (
                  <img
                    src={details.backdrop}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedMovie.poster}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <button
                  aria-label="Close"
                  onClick={closeDetails}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-5 left-5 right-5">
                  <h2 className="font-display text-2xl md:text-4xl">
                    {details?.title ||
                      selectedMovie.title}
                  </h2>

                  {details?.tagline && (
                    <p className="text-slate-300 italic mt-1">
                      {details.tagline}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 md:p-7">

                {detailsLoading && (
                  <p className="text-sm text-slate-500">
                    Loading movie details...
                  </p>
                )}

                {!detailsLoading && details && (
                  <>
                    {/* META */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">

                      <span className="flex items-center gap-1 text-cyan">
                        <Star size={15} />
                        {Number(
                          details.rating || 0
                        ).toFixed(1)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={15} />
                        {details.year}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={15} />
                        {formatRuntime(
                          details.runtime
                        )}
                      </span>

                      {details.director && (
                        <span className="flex items-center gap-1">
                          <User size={15} />
                          {details.director.name}
                        </span>
                      )}
                    </div>

                    {/* GENRES */}
                    {details.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {details.genres.map(
                          (genre) => (
                            <span
                              key={genre.id}
                              className="px-2.5 py-1 text-xs border border-white/15 text-slate-400"
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

                      <p className="mt-2 text-slate-400 leading-relaxed">
                        {details.overview ||
                          details.plot ||
                          'No overview available.'}
                      </p>
                    </div>

                    {/* CAST */}
                    {details.cast?.length > 0 && (
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
                                      <User size={24} />
                                    </div>
                                  )}
                                </div>

                                <p className="text-xs mt-2 text-white line-clamp-2">
                                  {person.name}
                                </p>

                                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                                  {person.character}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* WATCHLIST */}
                    <button
                      onClick={() =>
                        toggleWatch(details.id)
                      }
                      className="btn mt-7"
                    >
                      {watch.some(
                        (id) =>
                          String(id) ===
                          String(details.id)
                      )
                        ? 'REMOVE FROM WATCHLIST'
                        : 'ADD TO WATCHLIST'}
                    </button>
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
