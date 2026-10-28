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

  const [sentiment, setSentiment] = useState(null);

  const [sentimentLoading, setSentimentLoading] = useState(false);



  const [reviews, setReviews] = useState([]);

  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(8);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewRefresh, setReviewRefresh] = useState(0);

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

          "http\://localhost:5000/api/movies"

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

          `http\://localhost:5000/api/movies/${sel.id}`

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

// FETCH REVIEWS + SENTIMENT

// ==========================================



useEffect(() => {

  if (!sel?.id) {

    setSentiment(null);

    setReviews([]);

    return;

  }



  const fetchReviewsData = async () => {

    try {

      const token = localStorage.getItem("cs_token");



      if (!token) {

        return;

      }



      const movieId = details?.id || sel.id;



      setSentimentLoading(true);

      setReviewsLoading(true);



      const headers = {

        Authorization: `Bearer ${token}`,

      };



      const [sentimentResponse, reviewsResponse] =

        await Promise.all([

          fetch(

            `http\://localhost:5000/api/reviews/${movieId}/sentiment`,

            {

              headers,

            }

          ),



          fetch(

            `http\://localhost:5000/api/reviews/${movieId}`,

            {

              headers,

            }

          ),

        ]);



      const sentimentData =

        await sentimentResponse.json();



      const reviewsData =

        await reviewsResponse.json();



      if (sentimentResponse.ok) {

        setSentiment(sentimentData);

      } else {

        setSentiment(null);

      }



      if (reviewsResponse.ok) {

        setReviews(reviewsData.reviews || []);

      } else {

        setReviews([]);

      }

    } catch (error) {

      console.error(

        "Reviews and sentiment error:",

        error

      );



      setSentiment(null);

      setReviews([]);

    } finally {

      setSentimentLoading(false);

      setReviewsLoading(false);

    }

  };



  fetchReviewsData();

}, [sel, details, reviewRefresh]);



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
    setSentiment(null);
    setReviews([]);
    setReviewText("");
    setReviewRating(8);
    setReviewMessage("");
  };



  // ==========================================

  // ==========================================
  // SUBMIT REVIEW
  // ==========================================

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("cs_token");

      if (!token) {
        setReviewMessage("Please login to submit a review.");
        return;
      }

      if (!reviewText.trim()) {
        setReviewMessage("Please write something about the movie.");
        return;
      }

      const movieId = details?.id || sel?.id;
      const movieTitle = details?.title || sel?.title;

      if (!movieId || !movieTitle) {
        setReviewMessage("Movie information is unavailable.");
        return;
      }

      setReviewSubmitting(true);
      setReviewMessage("");

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            movieId: String(movieId),
            movieTitle,
            rating: reviewRating,
            text: reviewText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not submit review"
        );
      }

      setReviewText("");
      setReviewRating(8);
      setReviewMessage("Review submitted successfully!");
      setReviewRefresh((value) => value + 1);
    } catch (error) {
      console.error("Submit review error:", error);
      setReviewMessage(
        error.message || "Could not submit review"
      );
    } finally {
      setReviewSubmitting(false);
    }
  };


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



      {/* ========================================*

*&#xA0;         MOVIE DETAILS*

*&#xA0;     ======================================== */}



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



                    {/* ========================================*

*&#xA0;   COMMUNITY SENTIMENT*

*======================================== */}



<div className="mt-8">

  <div className="flex items-center justify-between">

    <h3 className="font-display text-lg">

      Community Sentiment

    </h3>



    {sentiment && (

      <span className="text-xs text-slate-500">

        {sentiment.totalReviews}{" "}

        {sentiment.totalReviews === 1

          ? "review"

          : "reviews"}

      </span>

    )}

  </div>



  {sentimentLoading ? (

    <div className="mt-5 text-sm text-slate-500">

      Analyzing community sentiment...

    </div>

  ) : sentiment &&

    sentiment.totalReviews > 0 ? (

    <div className="mt-5 space-y-5">



      {/* Overall sentiment */}

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-white/10 bg-white/[0.02]">

        <div>

          <p className="text-xs uppercase tracking-wider text-slate-500">

            Overall

          </p>



          <p className="mt-1 text-lg font-medium text-white">

            {sentiment.overallSentiment}

          </p>

        </div>



        <div className="text-right">

          <div className="flex items-center justify-end gap-1 text-cyan">

            <Star

              size={15}

              fill="currentColor"

            />



            <span className="text-lg font-semibold">

              {sentiment.averageRating.toFixed(1)}

            </span>



            <span className="text-xs text-slate-500">

              / 10

            </span>

          </div>



          <p className="mt-1 text-[11px] text-slate-500">

            Community rating

          </p>

        </div>

      </div>



      {/* Positive */}

      <div>

        <div className="flex items-center justify-between text-xs">

          <span className="text-emerald-400">

            😊 Positive

          </span>



          <span className="text-slate-400">

            {sentiment.positive}%

          </span>

        </div>



        <div className="mt-2 h-2 overflow-hidden bg-white/5">

          <div

            className="h-full bg-emerald-400 transition-all duration-700"

            style={{

              width: `${sentiment.positive}%`,

            }}

          />

        </div>

      </div>



      {/* Neutral */}

      <div>

        <div className="flex items-center justify-between text-xs">

          <span className="text-slate-400">

            😐 Neutral

          </span>



          <span className="text-slate-400">

            {sentiment.neutral}%

          </span>

        </div>



        <div className="mt-2 h-2 overflow-hidden bg-white/5">

          <div

            className="h-full bg-slate-400 transition-all duration-700"

            style={{

              width: `${sentiment.neutral}%`,

            }}

          />

        </div>

      </div>



      {/* Negative */}

      <div>

        <div className="flex items-center justify-between text-xs">

          <span className="text-red-400">

            😡 Negative

          </span>



          <span className="text-slate-400">

            {sentiment.negative}%

          </span>

        </div>



        <div className="mt-2 h-2 overflow-hidden bg-white/5">

          <div

            className="h-full bg-red-400 transition-all duration-700"

            style={{

              width: `${sentiment.negative}%`,

            }}

          />

        </div>

      </div>

    </div>

  ) : (

    <p className="mt-4 text-sm text-slate-500">

      No community reviews yet.

    </p>

  )}

</div>



                  {/* ========================================*

*&#xA0;   COMMUNITY REVIEWS*

*======================================== */}



<div className="mt-8">

  <h3 className="font-display text-lg">

    Community Reviews

  </h3>



  
                  {/* WRITE A REVIEW */}
                  <div className="mt-5 p-5 border border-white/10 bg-white/[0.02]">
                    <h4 className="text-sm font-medium text-white">
                      Write a Review
                    </h4>

                    <div className="mt-4">
                      <p className="text-xs text-slate-500 mb-2">
                        Your rating
                      </p>

                      <div className="flex flex-wrap items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewRating(rating)}
                            className="p-0.5"
                            aria-label={`Rate ${rating} out of 10`}
                          >
                            <Star
                              size={18}
                              fill={rating <= reviewRating ? "currentColor" : "none"}
                              className={
                                rating <= reviewRating
                                  ? "text-cyan"
                                  : "text-slate-600"
                              }
                            />
                          </button>
                        ))}

                        <span className="ml-2 text-sm text-cyan">
                          {reviewRating}/10
                        </span>
                      </div>
                    </div>

                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="What did you think about this movie?"
                      maxLength={2000}
                      rows={4}
                      className="mt-4 w-full resize-none bg-black/30 border border-white/10 p-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan"
                    />

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-[11px] text-slate-600">
                        {reviewText.length}/2000
                      </span>

                      <button
                        type="button"
                        onClick={submitReview}
                        disabled={reviewSubmitting}
                        className="px-5 py-2.5 bg-white text-black text-xs font-medium hover:bg-cyan transition disabled:opacity-50"
                      >
                        {reviewSubmitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                      </button>
                    </div>

                    {reviewMessage && (
                      <p
                        className={`mt-3 text-xs ${
                          reviewMessage.includes("successfully")
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {reviewMessage}
                      </p>
                    )}
                  </div>

{reviewsLoading ? (

    <p className="mt-4 text-sm text-slate-500">

      Loading reviews...

    </p>

  ) : reviews.length === 0 ? (

    <p className="mt-4 text-sm text-slate-500">

      No reviews yet. Be the first to review this movie.

    </p>

  ) : (

    <div className="mt-5 space-y-4">

      {reviews.map((review) => (

        <div

          key={review._id}

          className="p-4 border border-white/10 bg-white/[0.02]"

        >

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-sm font-medium text-white">

                {review.userName}

              </p>



              <div className="mt-1 flex items-center gap-2">

                <span className="text-xs text-cyan">

                  ⭐ {review.rating}/10

                </span>



                <span

                  className={`text-[10px] uppercase tracking-wider ${

                    review.sentiment === "positive"

                      ? "text-emerald-400"

                      : review.sentiment === "negative"

                      ? "text-red-400"

                      : "text-slate-400"

                  }`}

                >

                  {review.sentiment}

                </span>

              </div>

            </div>

          </div>



          <p className="mt-3 text-sm leading-6 text-slate-400">

            {review.text}

          </p>

        </div>

      ))}

    </div>

  )}

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
