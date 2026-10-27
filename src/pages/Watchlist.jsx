import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { useStore } from '../App';

export default function Watchlist() {
  const { watch } = useStore();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      if (!watch.length) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const results = await Promise.all(
          watch.map(async (movieId) => {
            const response = await fetch(
              `http://localhost:5000/api/movies/${movieId}`
            );

            if (!response.ok) {
              return null;
            }

            return await response.json();
          })
        );

        setMovies(results.filter(Boolean));
      } catch (error) {
        console.error(
          'Watchlist movie loading error:',
          error.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [watch]);

  return (
    <section>
      <h1 className="font-display text-3xl">
        Watchlist
      </h1>

      {loading && (
        <p className="mt-16 text-center text-slate-400">
          Loading your watchlist...
        </p>
      )}

      {!loading && movies.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              m={movie}
            />
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Nothing saved yet. Add movies from Discover.
          </p>

          <Link
            to="/discover"
            className="btn inline-block mt-5"
          >
            BROWSE MOVIES
          </Link>
        </div>
      )}
    </section>
  );
}